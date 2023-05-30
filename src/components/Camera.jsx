import React, {useCallback, useEffect, useRef, useState} from "react";
import Webcam from "react-webcam";
const videoConstraints ={
    width: 520,
    facingMode: "enviroment",
};
 
const Camera =()=>{
    const webcamRef = useRef(null);
    const [url, setUrl] = useState(null);

    const capturePhoto = useCallback(async () => {
        const imgeSrc = webcamRef.current.getScreenshot();
        setUrl(imgeSrc);
    },[webcamRef]);

    const onUserMedia =(e)=>{
        console.log(e)
    }
    return (
        <>
        <div className="takePic">
            <p>Take Picture</p>
        </div>
            <Webcam 
                ref={webcamRef}
                audio= {false}
                screenshotFormat="image/png"
                videoConstraints={videoConstraints}
                onUserMedia={onUserMedia}
                mirrored={true}
                screenshotQuality={10}
            />
            <div className="cameraBtn">
            <button  onClick={capturePhoto}>Capture</button>
            <button  onClick={()=>setUrl(null)}>Refesh</button>

            </div>

            {url && (
                <div>
                    <img src={url} alt="Screenshot"></img>
                </div>
            )}
        </>

    )
}

export default Camera ;
