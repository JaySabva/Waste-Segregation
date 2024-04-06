const express = require('express');
const { spawn } = require('child_process');
const multer = require('multer');
const fs = require('fs');
const morgan = require('morgan');
const app = express();
const redis = require('ioredis-rejson');

const upload = multer({ dest: 'uploads/' });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));

const redisClient = new redis({
    port: 18829,          // Redis port
    host: 'redis-18829.c267.us-east-1-4.ec2.cloud.redislabs.com',   // Redis host
    password: 'j8DtiinZTW0k5FIz9eRvm27eZVB7gU6Z',   // Redis password
});
redisClient.on('connect', () => {
    console.log('Connected to Redis Cloud successfully');
});

// async function redisSetup() {
//     try {
//         await redisClient.json_set('recycler', '.', []);
//         console.log("User Array Setup - Redis");
//     }
//     catch (e) {
//         console.log(e);
//     }
// }
// redisSetup();
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // * means all
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization'); // * means all
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET'); // * means all
        return res.status(200).json({});
    }
    next();
});

app.post('/predict', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No image file provided' });
    }

    const imagePath = `uploads/${Date.now()}_${req.file.originalname}`;
    fs.renameSync(req.file.path, imagePath);

    const pythonProcess = spawn('python', ['predict_image.py', imagePath]);
    let prediction = '';
    pythonProcess.stdout.on('data', (data) => {
        prediction += data.toString();
    });
    pythonProcess.stderr.on('data', (data) => {
        console.error(`Error: ${data}`);
    });
    pythonProcess.on('close', (code) => {
        if (code !== 0) {
            return res.status(500).json({ error: 'Failed to make prediction' });
        }
        const category = prediction.trim().split('\r\n').pop();

        const response = `${prediction}`;

        fs.unlink(imagePath, (err) => {
            if (err) {
                console.error(`Failed to delete file: ${err}`);
            }
        });

        res.json({ Category: response });
    });
});

app.post('/add-recycler', (req, res) => {
    const { name, address, phone, email, category, latitude, longitude, gmap} = req.body;

    redisClient.json_get('recycler', '.').then((recyclers) => {
        recyclers.push({ name, address, phone, email, category, latitude, longitude, gmap });
        redisClient.json_set('recycler', '.', recyclers);
        res.json({ success: true });
    });
});

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1); // deg2rad below
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

app.get('/get-recyclers', async (req, res) => {
    try {
        const category = req.query.category;
        const latitude = parseFloat(req.query.latitude);
        const longitude = parseFloat(req.query.longitude);
        const recyclers = await redisClient.json_get('recycler', '.');

        const filteredRecyclers = recyclers.filter((recycler) => recycler.category.includes(category));

        filteredRecyclers.forEach((recycler) => {
            const distance = getDistanceFromLatLonInKm(latitude, longitude, parseFloat(recycler.latitude), parseFloat(recycler.longitude));
            recycler.distance = distance; // Add distance property to each recycler
        });

        filteredRecyclers.sort((a, b) => a.distance - b.distance);

        res.json({ recyclers: filteredRecyclers });
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
