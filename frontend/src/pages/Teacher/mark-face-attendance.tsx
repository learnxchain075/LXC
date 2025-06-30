import React, { useState } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';

const MarkFaceAttendance: React.FC = () => {
  const [captured, setCaptured] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const webcamRef = React.useRef<Webcam>(null);

  const capture = () => {
    const img = webcamRef.current?.getScreenshot();
    if (img) setCaptured(img);
  };

  const markAttendance = async () => {
    if (!captured) return;
    setLoading(true);
    try {
      const blob = await (await fetch(captured)).blob();
      const form = new FormData();
      form.append('image', blob, 'selfie.png');
      const res = await axios.post('/api/teacher/face-attendance', form);
      setMessage(res.data.message);
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Error');
    } finally {
      setLoading(false);
      setCaptured(null);
    }
  };

  return (
    <div>
      <h3>Mark Face Attendance</h3>
      {captured ? (
        <div>
          <img src={captured} alt="selfie" width={200} />
          <button disabled={loading} onClick={markAttendance}>Submit</button>
          <button onClick={() => setCaptured(null)}>Retake</button>
        </div>
      ) : (
        <div>
          <Webcam audio={false} ref={webcamRef} screenshotFormat="image/png" />
          <button onClick={capture}>Capture</button>
        </div>
      )}
      {message && <p>{message}</p>}
    </div>
  );
};

export default MarkFaceAttendance;
