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
