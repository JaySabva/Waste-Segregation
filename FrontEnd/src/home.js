import { useState, useEffect, useRef, useCallback } from "react";
// import { makeStyles, withStyles } from "@mui/styles";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Container from "@mui/material/Container";
import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Paper, CardActionArea, CardMedia, Grid, TableContainer, Table, TableBody, TableHead, TableRow, TableCell, Button, CircularProgress } from "@mui/material";
import cblogo from "./cblogo.PNG";
import image from "./bg1.jpg";
import DragDropFile from "./drag_and_drop";
import WebcamCapture from "./Webcapture";
//import { DropzoneArea } from 'material-ui-dropzone';
import { common } from '@mui/material/colors';
import Clear from '@mui/icons-material/Clear';
import CloseIcon from '@mui/icons-material/Close';
import './home.css';
import { CameraAlt } from "@mui/icons-material";
// import React from 'react';
import Collapsible from 'react-collapsible';

const mainContainerstyle = {
    backgroundImage: `url(${image})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    height: "110vh",
    marginTop: "16px",
};

const appbarstyle = {
    background: '#14a39a',
    boxShadow: 'none',
    color: 'white',
};

const growstyle = {
    flexGrow: 1,
};

const clearButtonstyle = {
    borderRadius: "15px",
    padding: "8px 16px",
    backgroundColor: "#b3c7bb",
    color: "#000000a6",
    fontSize: "14px",
    fontWeight: 900,
    marginLeft: "auto",
    marginRight: "10px",
};
const rootstyle = {
    maxWidth: 345,
    flexGrow: 1,
};

const mediastyle = {
    height: 300,
};

const paperstyle = {
    padding: "16px",
    margin: 'auto',
    maxWidth: 500,
};

const gridContainerstyle = {
    justifyContent: "center",
    padding: "1em 1em 0 1em",
};


const imageCardstyle = {
    margin: "auto",
    maxWidth: 400,
    height: 400,
    backgroundColor: 'transparent',
    boxShadow: '0px 9px 70px 0px rgb(0 0 0 / 30%) !important',
    borderRadius: '15px',
};

const imageCardEmptystyle = {
    height: 'auto',
    margin: "auto",
    maxWidth: 400,
    backgroundColor: 'transparent',
    boxShadow: '0px 9px 70px 0px rgb(0 0 0 / 30%) !important',
    borderRadius: '15px',
};

const noImagestyle = {
    margin: "auto",
    width: 400,
    height: "400 !important",
};

const inputstyle = {
    display: 'none',
};

const uploadIconstyle = {
    background: 'white',
};

const tableContainerstyle = {
    backgroundColor: 'transparent !important',
    boxShadow: 'none !important',
};

const tablestyle = {
    backgroundColor: 'transparent !important',
};

const tableHeadstyle = {
    backgroundColor: 'transparent !important',
};

const tableRowstyle = {
    backgroundColor: 'transparent !important',
};

const tableCellstyle = {
    fontSize: '22px',
    backgroundColor: 'transparent !important',
    borderColor: 'transparent !important',
    color: '#000000a6 !important',
    fontWeight: 'bolder',
    padding: '1px 24px 1px 16px',
};

const tableCell1style = {
    fontSize: '14px',
    backgroundColor: 'transparent !important',
    borderColor: 'transparent !important',
    color: '#000000a6 !important',
    fontWeight: 'bolder',
    padding: '1px 24px 1px 16px',
};

const tableBodystyle = {
    backgroundColor: 'transparent !important',
};

const textstyle = {
    color: 'white !important',
    textAlign: 'center',
};

const buttonGridstyle = {
    maxWidth: "416px",
    width: "100%",
};

const detailstyle = {
    backgroundColor: '#b3c7bb',
    display: 'flex',
    height: 100,
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
};

const loaderstyle = {
    color: '#be6a77 !important',
};

const Buttonstyle = {
    width: 250,
    height: 50,
    borderRadius: "15px",
    padding: "12px 22px",
    backgroundColor: "#b3c7bb",
    color: "#000000a6",
    fontSize: "20px",
    fontWeight: 900,
};

const axios = require("axios").default;


export const ImageUpload = () => {
    // const classes = useStyles();
    const [expandedIndex, setExpandedIndex] = useState(null);
    const [selectedFile, setSelectedFile] = useState();
    const [preview, setPreview] = useState();
    const [data, setData] = useState();
    const [image, setImage] = useState(false);
    const [isLoading, setIsloading] = useState(false);
    const [iswebcamera, setIswebcamera] = useState(false);
    const webcamRef = useRef(null);
    // const [latitude, setLatitude] = useState(null);
    // const [longitude, setLongitude] = useState(null);
    const [recycler, setRecycler] = useState(null);
    let confidence = 0;

    const sendFile = async () => {
        // getLocation();
        if (image) {

            let formData = new FormData();
            formData.append("image", selectedFile);
            try {
                const response = await fetch("http://127.0.0.1:8000/predict/", {
                    method: "POST",
                    body: formData,
                });

                const responseData = await response.json();
                console.log(responseData);
                if (response.status === 200) {
                    setData(responseData.Category);
                }
            } catch (error) {
                console.error("There was a problem with the fetch operation:", error);
            }
            setIsloading(false);
        }
    }

    const clearData = () => {
        setData(null);
        setImage(false);
        setSelectedFile(null);
        setIsloading(false);
        setPreview(null);
        setRecycler(null);
        setIswebcamera(false);
    };

    useEffect(() => {
        if (!selectedFile) {
            setPreview(undefined);
            return;
        }
        const objectUrl = URL.createObjectURL(selectedFile);
        setPreview(objectUrl);
    }, [selectedFile]);

    useEffect(() => {
        if (!preview) {
            return;
        }
        setIsloading(true);
        sendFile();
    }, [preview]);

    const onSelectFile = (files) => {
        if (!files || files.length === 0) {
            setSelectedFile(undefined);
            setImage(false);
            setData(undefined);
            return;
        }
        setSelectedFile(files[0]);
        setData(undefined);
        setImage(true);
    };

    const getLocation = () => {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                },
                (error) => {
                    reject(error);
                }
            );
        });
    };

    const getRecycler = async () => {
        try {
            console.log("I");
            const { latitude, longitude } = await getLocation();
            const response = await fetch(`http://localhost:5000/get-recyclers?category=${data}&latitude=${latitude}&longitude=${longitude}`, {
                method: "GET",
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const responseData = await response.json();
            console.log(responseData);
            setRecycler(responseData.recyclers);
        } catch (error) {
            console.error("There was a problem:", error);
        }
    };




    const uploadtocam = () => {
        setIswebcamera(!iswebcamera);
    }

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        setImage(imageSrc);
        setPreview(imageSrc);
    }, [webcamRef, setImage]);

    const recapture = () => {
        setImage(null);
        setPreview(null);
        setIswebcamera(true);
    }

    if (data) {
        confidence = (parseFloat(data.confidence) * 100).toFixed(2);
    }
    const recyclerContainerStyle = {
        maxHeight: "50vh", // Set the max height as per your requirement
        overflow: "auto",
    };
    const handleCardClick = (index) => {
        setExpandedIndex(index);
    };
    const renderRecyclerCards = () => {
        if (!recycler) {
            return null;
        }

        return (
            <div style={{ overflowY: "auto", maxHeight: "50vh", backgroundColor: "#b3c7bb" }}>
                {recycler.map((recyclerData, index) => (
                    <div key={index}>
                        <Collapsible trigger={`${recyclerData.name} - Distane: ${recyclerData.distance.toPrecision(3)} Km`}>
                            <CardContent>
                                {/*<Typography variant="body1" color="textSecondary">Distance: {recyclerData.distance}</Typography>*/}
                                <Typography variant="body1" color="textSecondary">{recyclerData.address}</Typography>
                                <Typography variant="body1" color="textSecondary">{recyclerData.phone}</Typography>
                                <Typography variant="body1" color="textSecondary">{recyclerData.email}</Typography>
                                <Typography variant="body1" color="textSecondary">Google Maps Link: {recyclerData.gmap}</Typography>
                                {/* Add more details here */}
                            </CardContent>
                        </Collapsible>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <React.Fragment>
            <AppBar position="static" style={appbarstyle}>
                <Toolbar>

                    <Typography variant="h6" noWrap style={growstyle}>
                        Garbage Separator Tool
                    </Typography>

                    {!image && !iswebcamera && (<Button style={clearButtonstyle} variant="outlined" startIcon={<CameraAlt />} onClick={uploadtocam}>
                        Open Camera
                    </Button>)}

                    {!image && iswebcamera && (<Button style={clearButtonstyle} variant="outlined" startIcon={<CameraAlt />} onClick={uploadtocam}>
                        Upload Image
                    </Button>)}


                    {iswebcamera && image && (
                        <Button style={clearButtonstyle} variant="outlined" onClick={recapture}>
                            Recapture image
                        </Button>
                    )}

                    {iswebcamera && !image && (
                        <Button style={clearButtonstyle} variant="outlined" onClick={capture}>
                            capture image
                        </Button>
                    )}


                    {/* Move Get Recycler button to the right */}
                    {data && !recycler && (
                        <Button style={clearButtonstyle} variant="outlined" onClick={getRecycler}>
                            Get Recycler
                        </Button>
                    )}

                    {/* Move Close button next to Get Recycler button */}
                    {image && (
                        <Button style={clearButtonstyle} variant="outlined" onClick={clearData}>
                            upload new image
                        </Button>
                    )}

                </Toolbar>
            </AppBar>
            <Container maxWidth={false} style={mainContainerstyle} disableGutters={true}>
                <Grid
                    style={gridContainerstyle}
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    spacing={2}
                >
                    <Grid item xs={12}>
                        { (image || !iswebcamera) && <Card style={imageCardstyle}>
                            {image && <CardActionArea>
                                <CardMedia
                                    style={mediastyle}
                                    image={preview}
                                    component="image"
                                    title="Contemplative Reptile"
                                />
                            </CardActionArea>
                            }
                            {!image && !iswebcamera && <CardContent >
                                <DragDropFile filechange={onSelectFile} />
                            </CardContent>}
                            {data && !recycler && <CardContent style={detailstyle}>
                                <Typography variant="h6" noWrap>{data}</Typography>
                            </CardContent>}
                            {recycler && <CardContent style={detailstyle}>
                                <Typography variant="h6" noWrap>{data}</Typography>
                            </CardContent>}
                            {isLoading && <CardContent style={detailstyle}>
                                <CircularProgress color="secondary" style={loaderstyle} />
                                <Typography variant="h6" noWrap>
                                    Processing
                                </Typography>
                            </CardContent>}
                        </Card>}

                        {!image && iswebcamera && <WebcamCapture webcamRef={webcamRef} />}
                        {/* {iswebcamera && (
                            <div style={{ textAlign: "center" }}>
                                <Button style={clearButtonstyle} variant="outlined" startIcon={<CameraAlt />} onClick={uploadtocam}>
                                    Upload Image
                                </Button>
                            </div>
                        )} */}
                    </Grid>
                    {/* {data && !recycler &&
                        <Grid item style={buttonGridstyle} >
                            <Button style={clearButtonstyle} variant="outlined" startIcon={<CloseIcon />} onClick={clearData}>
                                Close
                            </Button>
                            <Button style={clearButtonstyle} variant="outlined" onClick={getRecycler}>
                                getRecycler
                            </Button>
                        </Grid>} */}
                    {recycler && <Grid item style={buttonGridstyle} >
                        {renderRecyclerCards()}
                        {/* <Button style={clearButtonstyle} variant="outlined" startIcon={<CloseIcon />} onClick={clearData}>
                            Close
                        </Button> */}
                    </Grid>}

                </Grid >
            </Container >
        </React.Fragment >
    );
};
