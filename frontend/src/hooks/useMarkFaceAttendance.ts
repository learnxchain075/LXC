import { useState } from "react";
import { markFaceAttendance } from "../services/teacher/faceAttendance";

export const useMarkFaceAttendance = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const submit = async (image: Blob, coords?: { lat: number; lon: number }) => {
    setLoading(true);
    setMessage("");
    try {
      const form = new FormData();
      form.append("image", image, "selfie.png");
      if (coords) {
        form.append("latitude", coords.lat.toString());
        form.append("longitude", coords.lon.toString());
      }
      const res = await markFaceAttendance(form);
      setMessage(`✅ ${res.data.message}`);
    } catch (err: any) {
      setMessage(`❌ ${err.response?.data?.message || "Error occurred"}`);
    } finally {
      setLoading(false);
    }
  };

  return { loading, message, submit, setMessage };
};
