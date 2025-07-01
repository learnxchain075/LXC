import * as faceapi from '@vladmandic/face-api';
import {
  Canvas as NodeCanvas,
  Image as NodeImage,
  ImageData as NodeImageData,
  loadImage,
} from 'canvas';
import path from 'path';

const ENV_MODEL_PATH = process.env.FACE_MODEL_PATH;

let initialized = false;

async function init(modelsPath?: string): Promise<void> {
  if (initialized) return;
  const modelPath =
    modelsPath || ENV_MODEL_PATH || path.join(__dirname, '../../models');
  (faceapi.env as any).monkeyPatch({
    Canvas: NodeCanvas as unknown as typeof HTMLCanvasElement,
    Image: NodeImage as unknown as typeof HTMLImageElement,
    ImageData: NodeImageData as unknown as typeof ImageData,
  });
  await Promise.all([
    faceapi.nets.ssdMobilenetv1.loadFromDisk(modelPath),
    faceapi.nets.faceLandmark68Net.loadFromDisk(modelPath),
    faceapi.nets.faceRecognitionNet.loadFromDisk(modelPath),
  ]);
  initialized = true;
}

async function loadImageFromUrl(url: string): Promise<NodeImage> {
  const { default: fetch } = await import('node-fetch');
  const res = await fetch(url);
  const buffer = await res.arrayBuffer();
  return await loadImage(Buffer.from(buffer));
}

async function loadImageFromBase64(data: string): Promise<NodeImage> {
  const cleaned = data.replace(/^data:image\/\w+;base64,/, '');
  const buffer = Buffer.from(cleaned, 'base64');
  return await loadImage(buffer);
}

export async function matchFaceLocal(
  selfieBase64: string,
  storedImageUrl: string,
  modelsPath?: string,
): Promise<boolean> {
  await init(modelsPath);
  const [selfieImage, storedCanvas] = await Promise.all([
    loadImageFromBase64(selfieBase64),
    loadImageFromUrl(storedImageUrl),
  ]);
  const selfie = await faceapi
    .detectSingleFace(selfieImage as unknown as HTMLCanvasElement)
    .withFaceLandmarks()
    .withFaceDescriptor();
  const stored = await faceapi
    .detectSingleFace(storedCanvas as unknown as HTMLCanvasElement)
    .withFaceLandmarks()
    .withFaceDescriptor();
  if (!selfie || !stored) return false;
  const distance = faceapi.euclideanDistance(
    selfie.descriptor,
    stored.descriptor,
  );
  return distance < 0.6;
}

export async function getFaceEmbeddingLocal(
  imageUrl: string,
  modelsPath?: string,
): Promise<number[] | null> {
  await init(modelsPath);
  const canvas = await loadImageFromUrl(imageUrl);
  const detection = await faceapi
    .detectSingleFace(canvas as unknown as HTMLCanvasElement)
    .withFaceLandmarks()
    .withFaceDescriptor();
  if (!detection) return null;
  return Array.from(detection.descriptor);
}

export async function matchEmbeddingLocal(
  selfieBase64: string,
  embedding: number[],
  modelsPath?: string,
): Promise<boolean> {
  await init(modelsPath);
  const image = await loadImageFromBase64(selfieBase64);
  const detection = await faceapi
    .detectSingleFace(image as unknown as HTMLCanvasElement)
    .withFaceLandmarks()
    .withFaceDescriptor();
  if (!detection) return false;
  const distance = faceapi.euclideanDistance(detection.descriptor, embedding);
  return distance < 0.6;
}
