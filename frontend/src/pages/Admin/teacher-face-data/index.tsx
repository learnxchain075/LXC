import React, { useState } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';

const TeacherFaceDataPage: React.FC = () => {
  const [teacherId, setTeacherId] = useState('');
  const [captured, setCaptured] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const webcamRef = React.useRef<Webcam>(null);

  const capture = () => {
    const img = webcamRef.current?.getScreenshot();
    if (img) {
      setCaptured(img);
    }
  };

  const register = async () => {
    if (!captured) return;
    setLoading(true);
    try {
      const blob = await (await fetch(captured)).blob();
      const form = new FormData();
      form.append('image', blob, 'selfie.png');
      form.append('teacherId', teacherId);
      await axios.post('/api/admin/teacher-face/register', form);
      setMessage('Face registered');
      setCaptured(null);
    } catch (err) {
      setMessage('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Register Teacher Face</h3>
      <input value={teacherId} onChange={e => setTeacherId(e.target.value)} placeholder="Teacher ID" />
      {captured ? (
        <div>
          <img src={captured} alt="selfie" width={200} />
          <button disabled={loading} onClick={register}>Upload</button>
          <button onClick={() => setCaptured(null)}>Retake</button>
        </div>
      ) : (
        <div>
          <Webcam audio={false} ref={webcamRef} screenshotFormat="image/png" />
          <button onClick={capture}>Capture</button>
        </div>
      )}
      {loading && <p>Uploading...</p>}
      {message && <p>{message}</p>}
    </div>
  );
};

export default TeacherFaceDataPage;
