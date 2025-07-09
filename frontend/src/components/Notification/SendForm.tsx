import React, { useEffect, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import api from '../../services/api';

interface Template { id: string; name: string; content: string; }

const extractFields = (content: string) => {
  const matches = content.match(/{{(.*?)}}/g);
  return matches ? Array.from(new Set(matches.map(m => m.replace(/{{|}}/g,'')))) : [];
};

const SendForm: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [templateId, setTemplateId] = useState('');
  const [placeholders, setPlaceholders] = useState<Record<string,string>>({});
  const [recipients, setRecipients] = useState('');
  const [preview, setPreview] = useState('');

  useEffect(() => {
    api.get('/api/notification/template').then(res => setTemplates(res.data || []));
  }, []);

  const current = templates.find(t => t.id === templateId);
  const fields = current ? extractFields(current.content) : [];

  useEffect(() => {
    if(current){
      let msg = current.content;
      fields.forEach(f => { msg = msg.replace(`{{${f}}}`, placeholders[f] || ''); });
      setPreview(msg);
    }
  }, [placeholders, templateId]);

  const send = async () => {
    await api.post('/api/notification/send', {
      templateId,
      recipients: recipients.split(',').map(r => r.trim()),
      data: placeholders,
    });
  };

  return (
    <div className='page-wrapper'>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Template</Form.Label>
          <Form.Select value={templateId} onChange={(e)=>setTemplateId(e.target.value)}>
            <option value="">Select</option>
            {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Recipients (comma separated)</Form.Label>
          <Form.Control value={recipients} onChange={e=>setRecipients(e.target.value)} />
        </Form.Group>
        {fields.map(f => (
          <Form.Group className="mb-2" key={f}>
            <Form.Label>{f}</Form.Label>
            <Form.Control value={placeholders[f] || ''} onChange={e=>setPlaceholders({...placeholders,[f]:e.target.value})} />
          </Form.Group>
        ))}
        {current && (
          <div className="border p-2 bg-light mt-3">
            <strong>Preview:</strong>
            <div>{preview}</div>
          </div>
        )}
        <Button className="mt-3" onClick={send}>Send</Button>
      </Form>
    </div>
  );
};

export default SendForm;
