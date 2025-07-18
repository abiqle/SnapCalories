import { useState } from 'react';
import './ImageUploader.css';

function ImageUploader({ onImageReady }) {
  const [preview, setPreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      onImageReady(file, url);
    }
  };

  return (
    <div className="image-uploader">
      <h2>Upload a Food Image</h2>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      {preview && <img src={preview} alt="Preview" className="preview" />}
    </div>
  );
}

export default ImageUploader;
