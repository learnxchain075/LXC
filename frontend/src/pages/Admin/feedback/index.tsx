import React, { useEffect, useState } from "react";
import { Table, Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import {
  createFeedback,
  getFeedbackBySchool,
} from "../../../services/admin/feedbackService";
import { ICreateFeedback, FeedbackStatus } from "../../../services/types/feeback";

const AdminFeedbackPage: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [feedbacks, setFeedbacks] = useState<ICreateFeedback[]>([]);

  const schoolId = localStorage.getItem("schoolId") || "";

  const loadData = async () => {
    if (!schoolId) return;
    try {
      const res = await getFeedbackBySchool(schoolId);
      setFeedbacks(res.data as any);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch feedback");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) {
      toast.error("Title and description required");
      return;
    }
    try {
      await createFeedback("", title, description, FeedbackStatus.PENDING, schoolId);
      toast.success("Feedback submitted");
      setTitle("");
      setDescription("");
      loadData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit feedback");
    }
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        <h3 className="mb-4">Feedback</h3>
        <Form onSubmit={handleSubmit} className="mb-4">
          <Form.Group className="mb-2">
            <Form.Label>Title</Form.Label>
            <Form.Control
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </Form.Group>
          <Button type="submit">Submit</Button>
        </Form>
        <Table bordered>
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {feedbacks.map((fb) => (
              <tr key={fb.id}>
                <td>{fb.title}</td>
                <td>{fb.description}</td>
                <td>{fb.status}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default AdminFeedbackPage;
