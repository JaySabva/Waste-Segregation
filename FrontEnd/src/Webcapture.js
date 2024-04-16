// import { Padding } from "@mui/icons-material";
import { Height, Margin } from "@mui/icons-material";
import React, { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";

const WebcamCapture = ({webcamRef}) => {
    // const webcamRef = useRef(null);
    // const [imgSrc, setImgSrc] = useState(null);


    // const capture = useCallback(() => {
    //     const imageSrc = webcamRef.current.getScreenshot();
    //     setImgSrc(imageSrc);
    // }, [webcamRef, setImgSrc]);

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

    return (
        <>
            <div>
                    <div>
                        <Webcam
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                        />
                        {/* <div style={{ textAlign: "center" }}>
                            <button style={Buttonstyle} variant="outlined" onClick={capture}>Capture photo</button>
                        </div> */}
                    </div>


            
                {/* <div style={{ textAlign: "center" }}>
                    {imgSrc && (
                        <div>
                            <img
                                src={imgSrc}
                                alt="Captured"
                            />
                        </div>
                    )}
                </div> */}

            </div>
        </>
    );
};

export default WebcamCapture;
