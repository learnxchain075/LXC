import React, { useEffect, useState } from 'react';
import LogTable from '../../components/Notification/LogTable';
import api from '../../services/api';

const NotificationLogs = () => {
  const [logs, setLogs] = useState<any[]>([]);

  const fetchLogs = () => {
    api.get('/api/notification/logs').then(res => setLogs(res.data || []));
  };

  useEffect(() => { fetchLogs(); }, []);

  return (
  
    <div className="page-wrapper">
      <div className="container mt-4">
        <h3>Notification Logs</h3>
        <LogTable logs={logs} />
      </div>
    </div>
   
  );
};

export default NotificationLogs;
