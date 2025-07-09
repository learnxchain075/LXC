import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';

type Props = {
  show: boolean;
  onHide: () => void;
  onSubmit: (data: any) => void;
};

const placeholders = (text: string) => {
  const matches = text.match(/{{(.*?)}}/g);
  return matches ? Array.from(new Set(matches.map(m => m.replace(/{{|}}/g, '')))) : [];
};

const TemplateForm: React.FC<Props> = ({ show, onHide, onSubmit }) => {
  const [form, setForm] = useState({
    name: '',
    type: 'EMAIL',
    content: '',
    isAutomated: false,
    triggerEvent: '',
    schoolId: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const parsed = form.content;
  const fields = placeholders(form.content);
  const [data, setData] = useState<Record<string, string>>({});

  const preview = fields.reduce((msg, key) => msg.replace(`{{${key}}}`, data[key] || ''), parsed);

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Create Template</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control name="name" value={form.name} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Type</Form.Label>
            <Form.Select name="type" value={form.type} onChange={handleChange}>
              <option value="EMAIL">EMAIL</option>
              <option value="SMS">SMS</option>
              <option value="WHATSAPP">WHATSAPP</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Content</Form.Label>
            <Form.Control as="textarea" rows={4} name="content" value={form.content} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Check type="checkbox" label="Automated" name="isAutomated" checked={form.isAutomated} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Trigger Event</Form.Label>
            <Form.Control name="triggerEvent" value={form.triggerEvent} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>School ID (optional)</Form.Label>
            <Form.Control name="schoolId" value={form.schoolId} onChange={handleChange} />
          </Form.Group>
          {fields.length > 0 && (
            <div className="mb-3">
              <h6>Placeholder Values</h6>
              {fields.map((f) => (
                <Form.Group className="mb-2" key={f}>
                  <Form.Label>{f}</Form.Label>
                  <Form.Control value={data[f] || ''} onChange={(e) => setData({ ...data, [f]: e.target.value })} />
                </Form.Group>
              ))}
              <div className="border p-2 bg-light mt-3">
                <strong>Preview:</strong>
                <div>{preview}</div>
              </div>
            </div>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Close</Button>
        <Button onClick={() => onSubmit({ ...form })}>Save</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TemplateForm;
