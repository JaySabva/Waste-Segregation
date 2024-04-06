import { useState, useEffect, useRef, useCallback } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Paper, CardActionArea, CardMedia, Grid, TableContainer, Table, TableBody, TableHead, TableRow, TableCell, Button, CircularProgress } from "@mui/material";
import Clear from '@mui/icons-material/Clear';
import CloseIcon from '@mui/icons-material/Close';
import Webcam from "react-webcam"; // Import Webcam component
import './home.css';

const mainContainerstyle = {
    height: "90vh",
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
    width: "-webkit-fill-available",
    borderRadius: "15px",
    padding: "15px 22px",
    backgroundColor: "#b3c7bb",
    color: "#000000a6",
    fontSize: "20px",
    fontWeight: 900,
};

const mediastyle = {
    height: 300,
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

const ImageUpload = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [data, setData] = useState(null);
    const [image, setImage] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    let confidence = 0;

    const webcamRef = useRef(null);

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        setSelectedFile(imageSrc);
        setImage(true);
    }, [webcamRef]);

    const sendFile = async () => {
        if (image && selectedFile) {
            let formData = new FormData();
            formData.append("image", selectedFile);

            try {
                const response = await fetch("http://localhost:5000/predict", {
                    method: "POST",
                    body: formData,
                });

                const responseData = await response.json();
                if (response.status === 200) {
                    setData(responseData.data.Category);
                }
                setIsLoading(false);
            } catch (error) {
                console.error("There was a problem with the fetch operation:", error);
            }
        }
    };

    const clearData = () => {
        setData(null);
        setImage(false);
        setSelectedFile(null);
        setPreview(null);
    };

    useEffect(() => {
        if (selectedFile && !image) {
            setPreview(selectedFile);
        }
    }, [selectedFile, image]);

    useEffect(() => {
        if (image) {
            setIsLoading(true);
            sendFile();
        }
    }, [image]);

    if (data) {
        confidence = (parseFloat(data.confidence) * 100).toFixed(2);
    }

    return (
        <React.Fragment>
            <AppBar position="static" style={appbarstyle}>
                <Toolbar>
                    <Typography variant="h6" noWrap>
                        Garbage Separator Tool
                    </Typography>
                    <div style={growstyle} />
                </Toolbar>
            </AppBar>
            <Container maxWidth={false} style={mainContainerstyle} disableGutters={true}>
                <Grid
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    spacing={2}
                >
                    <Grid item xs={12}>
                        <Card>
                            {image && (
                                <CardContent>
                                    <CardMedia
                                        style={mediastyle}
                                        image={preview}
                                        component="img"
                                        title="Contemplative Reptile"
                                    />
                                </CardContent>
                            )}
                            {!image && (
                                <CardContent>
                                    <Webcam
                                        audio={false}
                                        ref={webcamRef}
                                        screenshotFormat="image/jpeg"
                                    />
                                    <Button onClick={capture}>Capture photo</Button>
                                </CardContent>
                            )}
                            {data && (
                                <CardContent style={detailstyle}>
                                    <TableContainer component={Paper} style={tableContainerstyle}>
                                        <Table style={tablestyle} size="small" aria-label="simple table">
                                            <TableHead style={tableHeadstyle}>
                                                <TableRow style={tableRowstyle}>
                                                    <TableCell style={tableCell1style}>Label:</TableCell>
                                                    <TableCell align="right" style={tableCell1style}>Confidence:</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody style={tableBodystyle}>
                                                <TableRow style={tableRowstyle}>
                                                    <TableCell component="th" scope="row" style={tableCellstyle}>
                                                        {data.class}
                                                    </TableCell>
                                                    <TableCell align="right" style={tableCellstyle}>{confidence}%</TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </CardContent>
                            )}
                            {isLoading && (
                                <CardContent style={detailstyle}>
                                    <CircularProgress color="secondary" style={loaderstyle} />
                                    <Typography variant="h6" noWrap>
                                        Processing
                                    </Typography>
                                </CardContent>
                            )}
                        </Card>
                    </Grid>
                    {data && (
                        <Grid item style={buttonGridstyle}>
                            <Button style={clearButtonstyle} variant="outlined" startIcon={<CloseIcon />} onClick={clearData}>
                                Close
                            </Button>
                        </Grid>
                    )}
                </Grid>
            </Container>
        </React.Fragment>
    );
};

export default ImageUpload;
