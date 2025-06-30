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
    if (img) setCaptured(img);
  };

  const register = async () => {
    if (!captured || !teacherId) {
      setMessage("❗ Please enter Teacher ID and capture image first.");
      return;
    }
    setLoading(true);
    try {
      const blob = await (await fetch(captured)).blob();
      const form = new FormData();
      form.append('image', blob, 'selfie.png');
      form.append('teacherId', teacherId);
      await axios.post('/api/admin/teacher-face/register', form);
      setMessage('✅ Face registered successfully!');
      setCaptured(null);
      setTeacherId('');
    } catch (err) {
      setMessage('❌ Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <style>{`
        .card-style {
          background: #fff;
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 0 20px rgba(0,0,0,0.1);
          max-width: 600px;
          margin: auto;
        }

        .btn-custom {
          width: 100%;
          margin-top: 10px;
          font-weight: 500;
          border-radius: 6px;
        }

        .form-control {
          border-radius: 6px;
        }

        .webcam-wrapper, .preview-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: 20px;
        }

        .status-message {
          margin-top: 15px;
          font-weight: 500;
        }

        .status-message.success {
          color: #198754;
        }

        .status-message.error {
          color: #dc3545;
        }
      `}</style>

      <div className="card-style">
        <h3 className="text-center text-primary mb-4">🎓 Register Teacher Face</h3>

        <div className="mb-3">
          <label className="form-label">Teacher ID</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter Teacher ID"
            value={teacherId}
            onChange={e => setTeacherId(e.target.value)}
          />
        </div>

        {captured ? (
          <div className="preview-wrapper">
            <img src={captured} alt="selfie" width={200} className="img-thumbnail mb-3" />
            <button className="btn btn-success btn-custom" disabled={loading} onClick={register}>
              {loading ? 'Uploading...' : '📤 Upload'}
            </button>
            <button className="btn btn-secondary btn-custom" onClick={() => setCaptured(null)}>
              🔁 Retake
            </button>
          </div>
        ) : (
          <div className="webcam-wrapper">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/png"
              width={300}
              videoConstraints={{ facingMode: 'user' }}
              className="border rounded"
            />
            <button className="btn btn-primary btn-custom" onClick={capture}>
              📸 Capture
            </button>
          </div>
        )}

        {message && (
          <p className={`status-message text-center ${message.includes('successfully') ? 'success' : 'error'}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default TeacherFaceDataPage;

























// import React, { useState } from 'react';
// import Webcam from 'react-webcam';
// import axios from 'axios';

// const TeacherFaceDataPage: React.FC = () => {
//   const [teacherId, setTeacherId] = useState('');
//   const [captured, setCaptured] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState('');
//   const webcamRef = React.useRef<Webcam>(null);

//   const capture = () => {
//     const img = webcamRef.current?.getScreenshot();
//     if (img) {
//       setCaptured(img);
//     }
//   };

//   const register = async () => {
//     if (!captured) return;
//     setLoading(true);
//     try {
//       const blob = await (await fetch(captured)).blob();
//       const form = new FormData();
//       form.append('image', blob, 'selfie.png');
//       form.append('teacherId', teacherId);
//       await axios.post('/api/admin/teacher-face/register', form);
//       setMessage('Face registered');
//       setCaptured(null);
//     } catch (err) {
//       setMessage('Registration failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className='page-wrapper'>
//       <h3>Register Teacher Face</h3>
//       <input value={teacherId} onChange={e => setTeacherId(e.target.value)} placeholder="Teacher ID" />
//       {captured ? (
//         <div>
//           <img src={captured} alt="selfie" width={200} />
//           <button disabled={loading} onClick={register}>Upload</button>
//           <button onClick={() => setCaptured(null)}>Retake</button>
//         </div>
//       ) : (
//         <div>
//           <Webcam audio={false} ref={webcamRef} screenshotFormat="image/png" />
//           <button onClick={capture}>Capture</button>
//         </div>
//       )}
//       {loading && <p>Uploading...</p>}
//       {message && <p>{message}</p>}
//     </div>
//   );
// };

// export default TeacherFaceDataPage;
