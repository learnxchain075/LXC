import React, { useEffect, useState } from 'react';
import ChannelForm, { ChannelFormValues } from '../../components/Notification/ChannelForm';
import api from '../../services/api';

const NotificationChannels = () => {
  const [channels, setChannels] = useState<ChannelFormValues[]>([]);
  const [selected, setSelected] = useState<number | null>(null);

  const fetchChannels = () => {
    api.get('/api/notification/channel').then(res => setChannels(res.data || []));
  };

  useEffect(() => { fetchChannels(); }, []);

  const save = async (values: ChannelFormValues) => {
    await api.post('/api/notification/channel', values);
    setSelected(null);
    fetchChannels();
  };

  return (
    <div className="container mt-4">
      <h3>Notification Channels</h3>
      {channels.map((c,i)=>(
        <div key={i} className="border p-2 mb-2">
          <div className="d-flex justify-content-between">
            <div><strong>{c.provider}</strong></div>
            <button className="btn btn-sm btn-primary" onClick={()=>setSelected(i)}>Edit</button>
          </div>
          {selected===i && <ChannelForm initial={c} onSubmit={save} />}
        </div>
      ))}
      {selected===null && <ChannelForm onSubmit={save} />}
    </div>
  );
};

export default NotificationChannels;
