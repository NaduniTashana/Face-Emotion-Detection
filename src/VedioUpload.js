
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const VideoUpload = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [predictions, setPredictions] = useState([]);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setVideoFile(file);
    setVideoUrl(URL.createObjectURL(file)); // Create a URL for video playback
    setPredictions([]);
  };

  const handleUploadAndPredict = async () => {
    if (!videoFile) return;

    const formData = new FormData();
    formData.append('file', videoFile);

    try {
      const response = await axios.post('http://127.0.0.1:5000/predict-video-emotion', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Upload and prediction successful:', response.data);
      setPredictions(response.data.predictions); // Update state with predictions
      
      // Automatically play the video once predictions are ready
      if (videoRef.current) {
        videoRef.current.play();
      }
    } catch (error) {
      console.error('Error uploading video:', error);
    }
  };

  const handleVideoPlay = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    const drawPredictions = () => {
      if (video.paused || video.ended) return;

      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const currentFrame = Math.round(video.currentTime * 30); // Assuming 30fps

      const currentPredictions = predictions.filter(
        (prediction) => prediction.frame === currentFrame
      );

      context.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas before drawing

      currentPredictions.forEach(({ emotion, bbox }) => {
        context.strokeStyle = 'red';
        context.lineWidth = 2;
        context.strokeRect(bbox.x, bbox.y, bbox.w, bbox.h);
        context.font = '18px Arial';
        context.fillStyle = 'red';
        context.fillText(emotion, bbox.x, bbox.y - 10);
      });

      requestAnimationFrame(drawPredictions); // Continue rendering as video plays
    };

    drawPredictions(); // Start drawing predictions when video plays
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.addEventListener('play', handleVideoPlay);
    }
    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener('play', handleVideoPlay);
      }
    };
  }, [handleVideoPlay, predictions]); // Add predictions as a dependency

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '600px', margin: '0 auto' }}>
        <h1>Emotion Detection for Vedios</h1>
      <input type="file" accept="video/*" onChange={handleFileChange} />
      <button onClick={handleUploadAndPredict} disabled={!videoFile}>Upload and Predict</button>

      {videoUrl && (
        <div style={{ position: 'relative', marginTop: '20px' }}>
          <video
            ref={videoRef}
            src={videoUrl}
            controls
            style={{ width: '100%', display: 'block' }}
          />
          <canvas
            ref={canvasRef}
            width="1280" height="720"
            style={{ position: 'absolute', top: '0', left: '0', pointerEvents: 'none', width: '100%', height: '100%' }}
          />
        </div>
      )}
    </div>
  );
};

export default VideoUpload;
