import { useState, useRef } from 'react';
import './App.css';

function App() {
  const [imageUrl, setImageUrl] = useState(null);
  const [description, setDescription] = useState('');
  const [calories, setCalories] = useState('');
  const [loading, setLoading] = useState(false);
  const imageRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setImageUrl(url);
    setDescription('');
    setCalories('');
  };

  const getCalories = (desc) => {
    const foodMap = {
      banana: 89,
      apple: 52,
      pizza: 266,
      burger: 295,
      cake: 350,
      'french fries': 312,
      pasta: 131,
      sandwich: 250,
      rice: 130,
      'ice cream': 207,
      egg: 155,
      'chicken curry': 240,
    };

    const lowerDesc = desc.toLowerCase();
    for (const food in foodMap) {
      if (lowerDesc.includes(food)) {
        return foodMap[food];
      }
    }

    return 'N/A';
  };

  const handlePredict = async () => {
    if (!imageRef.current) return;

    setLoading(true);
    try {
      const file = await fetch(imageUrl).then(res => res.blob());

      const formData = new FormData();
      formData.append('image', file);

      const res = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      const desc = data.description || 'Unknown food';
      setDescription(desc);
      setCalories(getCalories(desc));
    } catch (err) {
      console.error('Prediction failed:', err);
      setDescription('Error processing image');
      setCalories('N/A');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setImageUrl(null);
    setDescription('');
    setCalories('');
  };

  return (
    <div className="container">
      <h1>🍽️ SnapCalories</h1>

      <div className="uploader">
        <h2>Upload a Food Image</h2>
        <input type="file" accept="image/*" onChange={handleFileChange} />

        {imageUrl && (
          <>
            <img ref={imageRef} src={imageUrl} alt="Preview" className="preview" />
            <div className="buttons">
              <button onClick={handlePredict}>🔍 Detect</button>
              <button onClick={handleReset}>♻️ Reset</button>
            </div>
          </>
        )}
      </div>

      {loading && <div className="loader">Detecting food...</div>}

      {!loading && description && (
        <div className="results">
          <h3>🥗 Description: {description}</h3>
          <p>Estimated Calories: {calories} kcal</p>
        </div>
      )}
    </div>
  );
}

export default App;
  