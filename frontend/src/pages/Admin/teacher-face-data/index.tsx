import React, { useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';

interface TeacherOption {
  id: string;
  name: string;
}

interface FaceRecord {
  id: string;
  teacherId: string;
  faceImageUrl: string;
  teacher: { user: { name: string } };
}

const TeacherFaceDataPage: React.FC = () => {
  const [teacherId, setTeacherId] = useState('');
  const [teachers, setTeachers] = useState<TeacherOption[]>([]);
  const [records, setRecords] = useState<FaceRecord[]>([]);
  const [captured, setCaptured] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const webcamRef = React.useRef<Webcam>(null);

  useEffect(() => {
    const schoolId = localStorage.getItem('schoolId');
    if (!schoolId) return;

    axios.get(`https://api.learnxchain.io/api/v1/school/${schoolId}/teacher`).then((res) => {
      const list = res.data.map((t: any) => ({
        id: t.id,
        name: t.user?.name || 'Unnamed',
      }));
      setTeachers(list);
    });

    axios
      .get(`https://api.learnxchain.io/api/v1/admin/teacher-face/school/${schoolId}`)
      .then((res) => setRecords(res.data.data || []));
  }, []);

  const capture = () => {
    const img = webcamRef.current?.getScreenshot();
    if (img) setCaptured(img);
  };

  const removeFaceData = async (tid: string) => {
    try {
      await axios.delete(`https://api.learnxchain.io/api/v1/admin/teacher-face/${tid}`);
      setRecords((prev) => prev.filter((r) => r.teacherId !== tid));
    } catch {
      // ignore errors
    }
  };

  const register = async () => {
    if (!captured || !teacherId) {
      setMessage('❗ Please select teacher and capture image first.');
      return;
    }
    setLoading(true);
    try {
      const blob = await (await fetch(captured)).blob();
      const form = new FormData();
      form.append('image', blob, 'selfie.png');
      form.append('teacherId', teacherId);
      await axios.post('https://api.learnxchain.io/api/v1/admin/teacher-face/register', form);
      setMessage('✅ Face registered successfully!');
      setCaptured(null);
      setTeacherId('');
      const schoolId = localStorage.getItem('schoolId');
      if (schoolId) {
        const res = await axios.get(`https://api.learnxchain.io/api/v1/admin/teacher-face/school/${schoolId}`);
        setRecords(res.data.data || []);
      }
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
          <label className="form-label">Teacher</label>
          <select
            className="form-control"
            value={teacherId}
            onChange={(e) => setTeacherId(e.target.value)}
          >
            <option value="">Select Teacher</option>
            {teachers.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
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

        {records.length > 0 && (
          <>
            <hr />
            <h5 className="text-center mt-3">Registered Faces</h5>
            <div className="row">
              {records.map((rec) => (
                <div className="col-md-4 text-center mb-4" key={rec.id}>
                  <img
                    src={rec.faceImageUrl}
                    alt={rec.teacher.user.name}
                    className="img-thumbnail mb-2"
                    width={120}
                  />
                  <p>{rec.teacher.user.name}</p>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => removeFaceData(rec.teacherId)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </>
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
