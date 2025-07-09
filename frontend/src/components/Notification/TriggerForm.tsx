import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

interface Props {
  events: string[];
  onSubmit: (event: string, data: Record<string,string>) => void;
}

const TriggerForm: React.FC<Props> = ({ events, onSubmit }) => {
  const [event, setEvent] = useState('');
  const [data, setData] = useState<Record<string,string>>({});

  return (
    <Form>
      <Form.Group className="mb-3">
        <Form.Label>Trigger Event</Form.Label>
        <Form.Select value={event} onChange={e=>setEvent(e.target.value)}>
          <option value="">Select</option>
          {events.map(ev=> <option key={ev} value={ev}>{ev}</option>)}
        </Form.Select>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Data (JSON)</Form.Label>
        <Form.Control as="textarea" rows={3} value={JSON.stringify(data)} onChange={e=>{
          try { setData(JSON.parse(e.target.value || '{}')); } catch { }
        }} />
      </Form.Group>
      <Button onClick={()=>onSubmit(event, data)}>Trigger</Button>
    </Form>
  );
};

export default TriggerForm;
