import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getSchoolLocation, updateSchool } from '../../../services/superadmin/schoolService';

const SetSchoolLocation: React.FC = () => {
  const { schoolId } = useParams<{ schoolId: string }>();
  const [lat, setLat] = useState('');
  const [lon, setLon] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (schoolId) {
      getSchoolLocation(schoolId)
        .then((res) => {
          setLat(res.data.latitude?.toString() || '');
          setLon(res.data.longitude?.toString() || '');
        })
        .catch(() => {});
    }
  }, [schoolId]);

  const useCurrent = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setLat(pos.coords.latitude.toString());
        setLon(pos.coords.longitude.toString());
      });
    }
  };

  const save = async () => {
    if (!schoolId) return;
    await updateSchool(schoolId, '', '', '', '', '', '', '', '', '', Number(lat), Number(lon));
    setMessage('✅ School location updated successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="container mt-5">
      <style>{`
        .location-card {
          background: #ffffff;
          border-radius: 10px;
          box-shadow: 0 0 15px rgba(0,0,0,0.1);
          padding: 30px;
          max-width: 600px;
          margin: auto;
        }

        .location-card h3 {
          color: #0d6efd;
          font-weight: 600;
        }

        .form-control {
          border-radius: 8px;
          padding: 10px 15px;
        }

        .btn-custom {
          width: 100%;
          border-radius: 8px;
          font-weight: 500;
        }

        .btn-current {
          background-color: #198754;
          color: white;
        }

        .btn-current:hover {
          background-color: #157347;
        }

        .message-success {
          color: #198754;
          font-weight: 500;
          margin-top: 15px;
        }
      `}</style>

      <div className="location-card">
        <h3 className="text-center mb-4">📍 Set School Location</h3>
        <div className="mb-3">
          <label>Latitude</label>
          <input
            type="text"
            className="form-control"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            placeholder="Enter Latitude"
          />
        </div>
        <div className="mb-3">
          <label>Longitude</label>
          <input
            type="text"
            className="form-control"
            value={lon}
            onChange={(e) => setLon(e.target.value)}
            placeholder="Enter Longitude"
          />
        </div>

        <div className="row mb-3">
          <div className="col-md-6 mb-2">
            <button className="btn btn-current btn-custom" onClick={useCurrent}>
              📍 Use Current Location
            </button>
          </div>
          <div className="col-md-6 mb-2">
            <button className="btn btn-primary btn-custom" onClick={save}>
              💾 Save Location
            </button>
          </div>
        </div>

        {message && <p className="message-success text-center">{message}</p>}
      </div>
    </div>
  );
};

export default SetSchoolLocation;









// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { getSchoolLocation, updateSchool } from '../../../services/superadmin/schoolService';

// const SetSchoolLocation: React.FC = () => {
//   const { schoolId } = useParams<{ schoolId: string }>();
//   const [lat, setLat] = useState('');
//   const [lon, setLon] = useState('');
//   const [message, setMessage] = useState('');

//   useEffect(() => {
//     if (schoolId) {
//       getSchoolLocation(schoolId).then((res) => {
//         setLat(res.data.latitude?.toString() || '');
//         setLon(res.data.longitude?.toString() || '');
//       }).catch(() => {});
//     }
//   }, [schoolId]);

//   const useCurrent = () => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition((pos) => {
//         setLat(pos.coords.latitude.toString());
//         setLon(pos.coords.longitude.toString());
//       });
//     }
//   };

//   const save = async () => {
//     if (!schoolId) return;
//     await updateSchool(schoolId, '', '', '', '', '', '', '', '', '', Number(lat), Number(lon));
//     setMessage('Updated');
//   };

//   return (
//     <div>
//       <h3>Set School Location</h3>
//       <div>
//         <input value={lat} onChange={e => setLat(e.target.value)} placeholder="Latitude" />
//         <input value={lon} onChange={e => setLon(e.target.value)} placeholder="Longitude" />
//       </div>
//       <button onClick={useCurrent}>Use Current Location</button>
//       <button onClick={save}>Save</button>
//       {message && <p>{message}</p>}
//     </div>
//   );
// };

// export default SetSchoolLocation;
