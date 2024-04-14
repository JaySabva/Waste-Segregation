// import { Padding } from "@mui/icons-material";
import { Height, Margin } from "@mui/icons-material";
import React, { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import Typography from "@mui/material/Typography";

const WebcamCapture = () => {
    const webcamRef = useRef(null);
    const [imgSrc, setImgSrc] = useState(null);
    const [data, setIsdata] = useState(null);
    const [recycler, setRecycler] = useState(null);
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);

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

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        setImgSrc(imageSrc);
    }, [webcamRef, setImgSrc]);

    const divstyle = {
        width: 'auto',
        Height: 200,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
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

    const dataURItoBlob = (dataURI) => {
        const byteString = atob(dataURI.split(",")[1]);
        const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([ab], { type: mimeString });
        return blob;
    };

    const recapture = () => {
        setImgSrc(null);
    };

 

    const sendFile = async () => {
        if (imgSrc) {
            const blob = dataURItoBlob(imgSrc);
            const file = new File([blob], "captured_photo.jpg", { type: "image/jpeg" });

            let formData = new FormData();
            formData.append("image", file);

            try {
                const response = await fetch("http://localhost:5000/predict", {
                    method: "POST",
                    body: formData,
                });

                const responseData = await response.json();
                if (response.status === 200) {
                    setIsdata(responseData.category);
                }
            } catch (error) {
                console.error("There was a problem with the fetch operation:", error);
            }
        } else {
            console.error("No image captured yet");
        }
    };

    const getRecycler = async () => {
        getLocation();
        try {
            const response = await fetch(`http://localhost:3000/get-recyclers?category=${data}&latitude=${latitude}&longitude=${longitude}`, {
                method: "GET",
            });

            const responseData = await response.json();
            if (response.status === 200) {
                setRecycler(responseData.recycler);
            }
        } catch (error) {
            console.error("There was a problem with the fetch operation:", error);
        }
    };

    const cleardata = () => {
        setImgSrc(null);
        setIsdata(null);
        setRecycler(null);
    };

    return (
        <div style={divstyle}>
            {!data && !imgSrc && (
                <div>
                    <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                    />
                    <div style={{ textAlign: "center" }}>
                        <button style={Buttonstyle} variant="outlined" onClick={capture}>Capture photo</button>
                    </div>
                </div>


            )}
            <div style={{ textAlign: "center" }}>
                {!data && imgSrc && (
                    <div>
                        <img
                            src={imgSrc}
                            alt="Captured"
                        />
                        <div>
                            <button style={Buttonstyle} variant="outlined" onClick={sendFile}>Send Photo</button>
                            <button style={Buttonstyle} variant="outlined" onClick={recapture}>Recapture Photo</button>
                        </div>
                    </div>
                )}
                {data && !recycler && (
                    <div>
                        <Typography variant="h6" noWrap>{data}</Typography>
                        <button style={Buttonstyle} variant="outlined" onClick={getRecycler}>Get Recycler</button>
                    </div>
                )}
                {recycler && (
                    <div>
                        <Typography variant="h6" noWrap>{recycler}</Typography>
                        <button style={Buttonstyle} variant="outlined" onClick={cleardata}>Clear</button>
                    </div>
                )}
                
            </div>

        </div>
    );
};

export default WebcamCapture;
