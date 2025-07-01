import axios from "axios";
import {
  matchFaceLocal,
  getFaceEmbeddingLocal,
  matchEmbeddingLocal,
} from "../utils/localFaceMatcher";

const FACE_SERVICE_URL = process.env.FACE_SERVICE_URL;

export async function matchFace(
  selfieBase64: string,
  storedImageUrl: string
): Promise<boolean> {
  if (FACE_SERVICE_URL) {
    try {
      const response = await axios.post(`${FACE_SERVICE_URL}/match`, {
        selfieBase64,
        storedImageUrl,
      });
      return response.data.matched;
    } catch (error) {
      console.error(
        "Face match request failed, falling back to local matcher",
        error,
      );
      // fall through to local implementation
    }
  }
  return matchFaceLocal(selfieBase64, storedImageUrl);
}

export async function getFaceEmbedding(imageUrl: string): Promise<any> {
  if (FACE_SERVICE_URL) {
    try {
      const res = await axios.post(`${FACE_SERVICE_URL}/embedding`, { imageUrl });
      return res.data.embedding;
    } catch (error) {
      console.error(
        "Embedding request failed, falling back to local matcher",
        error,
      );
      // fall through to local implementation
    }
  }
  return getFaceEmbeddingLocal(imageUrl);
}

export async function matchEmbedding(selfieBase64: string, embedding: any): Promise<boolean> {
  if (FACE_SERVICE_URL) {
    try {
      const res = await axios.post(`${FACE_SERVICE_URL}/match-embedding`, {
        selfieBase64,
        embedding,
      });
      return res.data.matched;
    } catch (error) {
      console.error(
        "Embedding match request failed, falling back to local matcher",
        error,
      );
      // fall through to local implementation
    }
  }
  return matchEmbeddingLocal(selfieBase64, embedding);
}
