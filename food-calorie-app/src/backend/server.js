import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fetch from 'node-fetch';
import * as dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();
const app = express();
const upload = multer({ dest: 'uploads/' });
app.use(cors());

app.post('/describe', upload.single('image'), async (req, res) => {
  const imagePath = req.file.path;
  const imageBuffer = fs.readFileSync(imagePath);
  const base64 = imageBuffer.toString('base64');
  const input = {
    image: `data:image/jpeg;base64,${base64}`,
    prompt: "Describe the food in this image",
  };

  try {
    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        version: "3d7c0271c8f431a366623db1ce3d8fc1510fbeb35598d749df69c54b9a0cde56", // LLaVA v1.6
        input
      })
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong.");
  } finally {
    fs.unlinkSync(imagePath); // Clean up
  }
});

app.listen(5000, () => console.log('Server running on http://localhost:5000'));
