import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import TemplateForm from '../../components/Notification/TemplateForm';
import api from '../../services/api';

const NotificationTemplates = () => {
  const [templates, setTemplates] = useState<any[]>([]);
  const [show, setShow] = useState(false);

  const fetchTemplates = () => {
    api.get('/api/notification/template').then(res => setTemplates(res.data || []));
  };

  useEffect(() => { fetchTemplates(); }, []);

  const addTemplate = async (data: any) => {
    await api.post('/api/notification/template', data);
    setShow(false);
    fetchTemplates();
  };

  return (
    <div className="page-wrapper">
    <div className="container mt-4">
      <h3>Notification Templates</h3>
      <Button className="mb-3" onClick={() => setShow(true)}>Add Template</Button>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Automated</th>
            <th>Trigger Event</th>
          </tr>
        </thead>
        <tbody>
          {templates.map(t => (
            <tr key={t.id}>
              <td>{t.name}</td>
              <td>{t.type}</td>
              <td>{t.isAutomated? 'Yes':'No'}</td>
              <td>{t.triggerEvent}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <TemplateForm show={show} onHide={()=>setShow(false)} onSubmit={addTemplate} />
    </div>
    </div>
  );
};

export default NotificationTemplates;
