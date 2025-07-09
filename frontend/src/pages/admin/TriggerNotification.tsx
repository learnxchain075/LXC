import React from 'react';
import TriggerForm from '../../components/Notification/TriggerForm';
import api from '../../services/api';

const events = ['FEE_PAID','STUDENT_ABSENT'];

const TriggerNotification = () => {
  const handle = async (event: string, data: Record<string,string>) => {
    await api.post('/api/notification/trigger', {event, data});
  };

  return (
    <div className="container mt-4">
      <h3>Trigger Notification</h3>
      <TriggerForm events={events} onSubmit={handle} />
    </div>
  );
};

export default TriggerNotification;
