import * as faceapi from '@vladmandic/face-api';
import { Canvas, Image, ImageData, loadImage } from 'canvas';
import fetch from 'node-fetch';
import path from 'path';

let initialized = false;

async function init(modelsPath?: string): Promise<void> {
  if (initialized) return;
  const modelPath = modelsPath || path.join(__dirname, '../../models');
  faceapi.env.monkeyPatch({ Canvas, Image, ImageData });
  await Promise.all([
    faceapi.nets.ssdMobilenetv1.loadFromDisk(modelPath),
    faceapi.nets.faceLandmark68Net.loadFromDisk(modelPath),
    faceapi.nets.faceRecognitionNet.loadFromDisk(modelPath),
  ]);
  initialized = true;
}

async function loadImageFromUrl(url: string): Promise<Canvas> {
  const res = await fetch(url);
  const buffer = await res.arrayBuffer();
  return await loadImage(Buffer.from(buffer));
}

async function loadImageFromBase64(data: string): Promise<Canvas> {
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
  const [selfieCanvas, storedCanvas] = await Promise.all([
    loadImageFromBase64(selfieBase64),
    loadImageFromUrl(storedImageUrl),
  ]);
  const selfie = await faceapi
    .detectSingleFace(selfieCanvas)
    .withFaceLandmarks()
    .withFaceDescriptor();
  const stored = await faceapi
    .detectSingleFace(storedCanvas)
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
    .detectSingleFace(canvas)
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
  const canvas = await loadImageFromBase64(selfieBase64);
  const detection = await faceapi
    .detectSingleFace(canvas)
    .withFaceLandmarks()
    .withFaceDescriptor();
  if (!detection) return false;
  const distance = faceapi.euclideanDistance(detection.descriptor, embedding);
  return distance < 0.6;
}
