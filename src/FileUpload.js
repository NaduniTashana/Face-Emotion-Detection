import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [emotion, setEmotion] = useState('');
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');

  const handleFileChange = (event) => {
    
    const file = event.target.files[0];
    setSelectedFile(file);
    setImagePreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      alert('Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post('http://127.0.0.1:5000/predict-emotion', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(response.data);
      setEmotion(response.data.emotion);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '600px', margin: '0 auto' }}>
    <div className="App">
      <h1>Emotion Detection For Photos</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>

      {imagePreviewUrl && (
        <div style={{ marginTop: '20px' }}>
          <img src={imagePreviewUrl} alt="Selected" style={{ maxWidth: '100%', height: 'auto' }} />
        </div>
      )}
      
      {emotion && (
                <div>
                    <h2>Prediction Result: {emotion}</h2>
                </div>
            )}
    </div>
    </div>
  );
}

export default App;

