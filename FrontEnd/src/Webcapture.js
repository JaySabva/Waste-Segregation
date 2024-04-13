// import { Padding } from "@mui/icons-material";
import { Height, Margin } from "@mui/icons-material";
import React, { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";

const WebcamCapture = () => {
    const webcamRef = useRef(null);
    const [imgSrc, setImgSrc] = useState(null);

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        setImgSrc(imageSrc);
    }, [webcamRef, setImgSrc]);

    const divstyle = {
        width : 'auto',
        Height : 200,
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
                    console.log(responseData);
                }
            } catch (error) {
                console.error("There was a problem with the fetch operation:", error);
            }
        } else {
            console.error("No image captured yet");
        }
    };

    return (
        <div style={divstyle}>
            {!imgSrc && (
              <div>
                    <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                    />
                     <div style={{textAlign: "center"}}>
                        <button style={Buttonstyle} variant="outlined" onClick={capture}>Capture photo</button>
                    </div>
              </div>


            )}
            <div style={{ textAlign: "center"}}>
                {imgSrc && (
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
            </div>

        </div>
    );
};

export default WebcamCapture;
