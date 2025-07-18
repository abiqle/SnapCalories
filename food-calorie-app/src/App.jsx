import { useState, useRef, useEffect } from 'react';
import ImageUploader from './components/ImageUploader';
import { classifyImage } from './utils/classifyImage';

function App() {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const imgRef = useRef(null);

  const handleImageReady = (_file, url) => {
    setPreviewUrl(url);
    setPrediction(null); // reset old result
  };

  useEffect(() => {
    const runClassification = async () => {
      if (imgRef.current) {
        const result = await classifyImage(imgRef.current);
        setPrediction(result[0]); // top prediction
      }
    };

    if (previewUrl) {
      setTimeout(runClassification, 500);
    }
  }, [previewUrl]);

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>🍽️ SnapCalories</h1>
      <ImageUploader onImageReady={handleImageReady} />
      {previewUrl && (
        <img
          src={previewUrl}
          ref={imgRef}
          alt="To classify"
          style={{ display: 'none' }}
        />
      )}
      {prediction && (
        <div style={{ marginTop: '20px' }}>
          <h3>🥗 Food Detected: {prediction.className}</h3>
          <p>Confidence: {(prediction.probability * 100).toFixed(2)}%</p>
          <p>Estimated Calories: {getEstimatedCalories(prediction.className)} kcal (approx)</p>
        </div>
      )}
    </div>
  );
}

function getEstimatedCalories(foodName) {
  const caloriesMap = {
    pizza: 266,
    hamburger: 295,
    apple: 52,
    banana: 89,
    cake: 350,
    'french fries': 312,
    pasta: 131,
    rice: 130,
    bread: 265,
  };

  for (let key in caloriesMap) {
    if (foodName.toLowerCase().includes(key)) {
      return caloriesMap[key];
    }
  }

  return 'N/A';
}

export default App;
