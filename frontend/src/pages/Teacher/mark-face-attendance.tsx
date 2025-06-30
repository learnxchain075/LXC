import React, { useState, useEffect, useRef } from "react";
import Webcam from "react-webcam";
import { useMarkFaceAttendance } from "../../hooks/useMarkFaceAttendance";

const MarkFaceAttendance: React.FC = () => {
  const [captured, setCaptured] = useState<string | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const webcamRef = useRef<Webcam>(null);
  const { loading, message, submit, setMessage } = useMarkFaceAttendance();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (p) => setCoords({ lat: p.coords.latitude, lon: p.coords.longitude }),
        () => setCoords(null)
      );
    }
  }, []);

  const capture = () => {
    const img = webcamRef.current?.getScreenshot();
    if (img) setCaptured(img);
  };

  const markAttendance = async () => {
    if (!captured) return;
    const blob = await (await fetch(captured)).blob();
    await submit(blob, coords || undefined);
    setCaptured(null);
  };

  return (
    <div className="container mt-5">
      <style>{`
        .attendance-card {
          background: #ffffff;
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 0 15px rgba(0,0,0,0.1);
          max-width: 600px;
          margin: auto;
        }

        .webcam-box, .preview-box {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .btn-action {
          width: 100%;
          margin-top: 10px;
          font-weight: 500;
          border-radius: 6px;
        }

        .status-message {
          margin-top: 15px;
          font-weight: 500;
          text-align: center;
        }

        .status-message.success {
          color: #198754;
        }

        .status-message.error {
          color: #dc3545;
        }
      `}</style>

      <div className="attendance-card">
        <h3 className="text-center text-primary mb-4">🧑‍🏫 Mark Face Attendance</h3>

        {captured ? (
          <div className="preview-box">
            <img src={captured} alt="Captured" className="img-thumbnail mb-3" width={250} />
            <button
              className="btn btn-success btn-action"
              onClick={markAttendance}
              disabled={loading}
            >
              {loading ? "Submitting..." : "📤 Submit Attendance"}
            </button>
            <button className="btn btn-secondary btn-action" onClick={() => setCaptured(null)}>
              🔁 Retake
            </button>
          </div>
        ) : (
          <div className="webcam-box">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/png"
              width={300}
              videoConstraints={{ facingMode: "user" }}
              className="border rounded"
            />
            <button className="btn btn-primary btn-action" onClick={capture}>
              📸 Capture Face
            </button>
          </div>
        )}

        {message && (
          <p className={`status-message ${message.includes("✅") ? "success" : "error"}`}>{message}</p>
        )}
      </div>
    </div>
  );
};

export default MarkFaceAttendance;
