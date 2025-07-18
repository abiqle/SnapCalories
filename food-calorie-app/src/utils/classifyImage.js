import * as mobilenet from '@tensorflow-models/mobilenet';
import '@tensorflow/tfjs';

export async function classifyImage(imageElement) {
  const model = await mobilenet.load();
  const predictions = await model.classify(imageElement);
  return predictions;
}
