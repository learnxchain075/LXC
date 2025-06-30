import axios from "axios";

export async function matchFace(
  selfieBase64: string,
  storedImageUrl: string
): Promise<boolean> {
  try {
    const response = await axios.post("http://localhost:5001/match", {
      selfieBase64,
      storedImageUrl,
    });
    return response.data.matched;
  } catch (error) {
    console.error("Face match request failed", error);
    return false;
  }
}

export async function getFaceEmbedding(imageUrl: string): Promise<any> {
  try {
    const res = await axios.post("http://localhost:5001/embedding", { imageUrl });
    return res.data.embedding;
  } catch (error) {
    console.error("Embedding request failed", error);
    return null;
  }
}

export async function matchEmbedding(selfieBase64: string, embedding: any): Promise<boolean> {
  try {
    const res = await axios.post("http://localhost:5001/match-embedding", {
      selfieBase64,
      embedding,
    });
    return res.data.matched;
  } catch (error) {
    console.error("Embedding match request failed", error);
    return false;
  }
}
