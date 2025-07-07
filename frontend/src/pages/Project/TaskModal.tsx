import { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { FaBug, FaTasks, FaRocket, FaLightbulb, FaCog } from 'react-icons/fa';

export type IssueType = 'BUG' | 'STORY' | 'TASK' | 'EPIC' | 'IMPROVEMENT';

const ISSUE_OPTIONS = [
  { value: 'BUG', label: 'Bug', icon: <FaBug />, color: 'danger' },
  { value: 'STORY', label: 'Story', icon: <FaLightbulb />, color: 'primary' },
  { value: 'TASK', label: 'Task', icon: <FaTasks />, color: 'secondary' },
  { value: 'EPIC', label: 'Epic', icon: <FaRocket />, color: 'warning' },
  { value: 'IMPROVEMENT', label: 'Improvement', icon: <FaCog />, color: 'info' },
];

interface Props {
  show: boolean;
  onHide: () => void;
  onSave: (data: any) => void;
}

const TaskModal = ({ show, onHide, onSave }: Props) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [issueType, setIssueType] = useState<IssueType>('TASK');
  const [severity, setSeverity] = useState(1);
  const [storyPoints, setStoryPoints] = useState(1);

  useEffect(() => {
    if (!show) {
      setTitle('');
      setDescription('');
      setIssueType('TASK');
      setSeverity(1);
      setStoryPoints(1);
    }
  }, [show]);

  const handleSave = () => {
    const data: any = { title, description, issueType };
    if (issueType === 'BUG') data.severity = severity;
    if (issueType === 'STORY') data.storyPoints = storyPoints;
    onSave(data);
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Create Task</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-2">
            <Form.Label>Title</Form.Label>
            <Form.Control value={title} onChange={(e) => setTitle(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Description</Form.Label>
            <Form.Control as="textarea" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Issue Type</Form.Label>
            <Form.Select value={issueType} onChange={(e) => setIssueType(e.target.value as IssueType)}>
              {ISSUE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </Form.Select>
          </Form.Group>
          {issueType === 'BUG' && (
            <Form.Group className="mb-2">
              <Form.Label>Severity (1-5)</Form.Label>
              <Form.Control type="number" min={1} max={5} value={severity} onChange={(e) => setSeverity(Number(e.target.value))} />
            </Form.Group>
          )}
          {issueType === 'STORY' && (
            <Form.Group className="mb-2">
              <Form.Label>Story Points</Form.Label>
              <Form.Control type="number" min={1} value={storyPoints} onChange={(e) => setStoryPoints(Number(e.target.value))} />
            </Form.Group>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cancel</Button>
        <Button variant="primary" onClick={handleSave}>Save</Button>
      </Modal.Footer>
    </Modal>
  );
};

export { ISSUE_OPTIONS };
export default TaskModal;
