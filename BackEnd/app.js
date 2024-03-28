const express = require('express');
const { spawn } = require('child_process');
const multer = require('multer');
const fs = require('fs');
const morgan = require('morgan');
const app = express();

const upload = multer({ dest: 'uploads/' });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
