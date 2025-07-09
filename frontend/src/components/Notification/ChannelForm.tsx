import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

export interface ChannelFormValues {
  provider: string;
  config: string;
}

const ChannelForm: React.FC<{onSubmit: (v: ChannelFormValues) => void; initial?: ChannelFormValues}> = ({onSubmit, initial}) => {
  const [values, setValues] = useState<ChannelFormValues>(initial || {provider:'',config:'{}'});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {name, value} = e.target;
    setValues({...values, [name]: value});
  };

  return (
    <Form>
      <Form.Group className="mb-3">
        <Form.Label>Provider</Form.Label>
        <Form.Control name="provider" value={values.provider} onChange={handleChange} />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Config (JSON)</Form.Label>
        <Form.Control as="textarea" rows={3} name="config" value={values.config} onChange={handleChange} />
      </Form.Group>
      <Button onClick={() => onSubmit(values)}>Save</Button>
    </Form>
  );
};

export default ChannelForm;
