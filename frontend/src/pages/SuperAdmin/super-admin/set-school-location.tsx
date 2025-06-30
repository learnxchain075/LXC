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
      getSchoolLocation(schoolId).then((res) => {
        setLat(res.data.latitude?.toString() || '');
        setLon(res.data.longitude?.toString() || '');
      }).catch(() => {});
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
    setMessage('Updated');
  };

  return (
    <div>
      <h3>Set School Location</h3>
      <div>
        <input value={lat} onChange={e => setLat(e.target.value)} placeholder="Latitude" />
        <input value={lon} onChange={e => setLon(e.target.value)} placeholder="Longitude" />
      </div>
      <button onClick={useCurrent}>Use Current Location</button>
      <button onClick={save}>Save</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default SetSchoolLocation;
