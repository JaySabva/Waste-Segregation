import { useState, useEffect } from "react";
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
import WebcamCapture  from "./Webcapture";
//import { DropzoneArea } from 'material-ui-dropzone';
import { common } from '@mui/material/colors';
import Clear from '@mui/icons-material/Clear';
import CloseIcon from '@mui/icons-material/Close';
import './home.css';
import { CameraAlt } from "@mui/icons-material";


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
    width: "-webkit-fill-available",
    borderRadius: "15px",
    padding: "15px 22px",
    backgroundColor: "#b3c7bb",
    color: "#000000a6",
    fontSize: "20px",
    fontWeight: 900,
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



// const ColorButton = withStyles((theme) => ({
//     root: {
//         color: theme.palette.getContrastText(common.white),
//         backgroundColor: common.white,
//         '&:hover': {
//             backgroundColor: '#ffffff7a',
//         },
//     },
// }))(Button);
const axios = require("axios").default;

// const useStyles = makeStyles((theme) => ({
//     grow: {
//         flexGrow: 1,
//     },
//     clearButton: {
//         width: "-webkit-fill-available",
//         borderRadius: "15px",
//         padding: "15px 22px",
//         color: "#000000a6",
//         fontSize: "20px",
//         fontWeight: 900,
//     },
//     root: {
//         maxWidth: 345,
//         flexGrow: 1,
//     },
//     media: {
//         height: 400,
//     },
//     paper: {
//         padding: theme.spacing(2),
//         margin: 'auto',
//         maxWidth: 500,
//     },
//     gridContainer: {
//         justifyContent: "center",
//         padding: "4em 1em 0 1em",
//     },
//     mainContainer: {
//         backgroundImage: `url(${image})`,
//         backgroundRepeat: 'no-repeat',
//         backgroundPosition: 'center',
//         backgroundSize: 'cover',
//         height: "93vh",
//         marginTop: "8px",
//     },
//     imageCard: {
//         margin: "auto",
//         maxWidth: 400,
//         height: 500,
//         backgroundColor: 'transparent',
//         boxShadow: '0px 9px 70px 0px rgb(0 0 0 / 30%) !important',
//         borderRadius: '15px',
//     },
//     imageCardEmpty: {
//         height: 'auto',
//     },
//     noImage: {
//         margin: "auto",
//         width: 400,
//         height: "400 !important",
//     },
//     input: {
//         display: 'none',
//     },
//     uploadIcon: {
//         background: 'white',
//     },
//     tableContainer: {
//         backgroundColor: 'transparent !important',
//         boxShadow: 'none !important',
//     },
//     table: {
//         backgroundColor: 'transparent !important',
//     },
//     tableHead: {
//         backgroundColor: 'transparent !important',
//     },
//     tableRow: {
//         backgroundColor: 'transparent !important',
//     },
//     tableCell: {
//         fontSize: '22px',
//         backgroundColor: 'transparent !important',
//         borderColor: 'transparent !important',
//         color: '#000000a6 !important',
//         fontWeight: 'bolder',
//         padding: '1px 24px 1px 16px',
//     },
//     tableCell1: {
//         fontSize: '14px',
//         backgroundColor: 'transparent !important',
//         borderColor: 'transparent !important',
//         color: '#000000a6 !important',
//         fontWeight: 'bolder',
//         padding: '1px 24px 1px 16px',
//     },
//     tableBody: {
//         backgroundColor: 'transparent !important',
//     },
//     text: {
//         color: 'white !important',
//         textAlign: 'center',
//     },
//     buttonGrid: {
//         maxWidth: "416px",
//         width: "100%",
//     },
//     detail: {
//         backgroundColor: 'white',
//         display: 'flex',
//         justifyContent: 'center',
//         flexDirection: 'column',
//         alignItems: 'center',
//     },
//     appbar: {
//         background: '#be6a77',
//         boxShadow: 'none',
//         color: 'white'
//     },
//     loader: {
//         color: '#be6a77 !important',
//     }
// }));
export const ImageUpload = () => {
    // const classes = useStyles();
    const [selectedFile, setSelectedFile] = useState();
    const [preview, setPreview] = useState();
    const [data, setData] = useState();
    const [image, setImage] = useState(false);
    const [isLoading, setIsloading] = useState(false);
    const [iswebcamera, setIswebcamera] = useState(false);
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    let confidence = 0;

      const sendFile = async () => {
        getLocation();
        if (image) {

          let formData = new FormData();
          formData.append("file", selectedFile);
          let res = await axios({
            method: "post",
            url: process.env.REACT_APP_API_URL,
            data: formData,
          });
          if (res.status === 200) {
            setData(res.data);
          }
          setIsloading(false);
        }
      }

    const clearData = () => {
        setData(null);
        setImage(false);
        setSelectedFile(null);
        setIsloading(null);
        setPreview(null);
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
        //sendFile();
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
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLatitude(position.coords.latitude);
            setLongitude(position.coords.longitude);
          },
          (error) => {
            console.error('Error getting location:', error);
          }
        );
      };

    

    const uploadtocam = () =>{
        setIswebcamera(!iswebcamera);
    }

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
                    {/* <Avatar src={cblogo}></Avatar> */}
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
                       {!iswebcamera && <Card style={imageCardstyle}>
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
                            {!iswebcamera && !image && <Button style={clearButtonstyle} variant="outlined" startIcon={<CameraAlt/>} onClick={uploadtocam}>
                                Open Camera
                            </Button>}
                            {data && <CardContent style={detailstyle}>
                                {/* <TableContainer component={Paper} style={tableContainerstyle}>
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
                                </TableContainer> */}
                                <Typography variant="h6" noWrap>{data}</Typography>
                            </CardContent>}
                            {isLoading && <CardContent style={detailstyle}>
                                <CircularProgress color="secondary" style={loaderstyle} />
                                <Typography variant="h6" noWrap>
                                    Processing
                                </Typography>
                            </CardContent>}
                        </Card>}
                       
                            {!image && iswebcamera && <WebcamCapture/>}
                            {iswebcamera && (
                            <div style={{textAlign: "center"}}>
                            <Button style={clearButtonstyle} variant="outlined" startIcon={<CameraAlt/>} onClick={uploadtocam}>
                                Upload Image
                            </Button>
                            </div>
                        )}
                    </Grid>
                    {data &&
                        <Grid item style={buttonGridstyle} >
                            <Button style={clearButtonstyle} variant="outlined" startIcon={<CloseIcon/>} onClick={clearData}>
                                Close
                            </Button>
                        </Grid>}
                        
                </Grid >
            </Container >
        </React.Fragment >
    );
};
