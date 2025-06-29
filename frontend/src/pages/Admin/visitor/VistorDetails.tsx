import React, { useEffect, useState } from "react";
import {
  Table,
  Modal,
  Button,
  Form,
  InputGroup,
  Spinner,
  OverlayTrigger,
  Tooltip,
  Card,
  Badge,
  Row,
  Col,
} from "react-bootstrap";
import { toast } from "react-toastify";
import { FaSearch, FaQrcode, FaTimesCircle, FaEdit, FaTrash } from "react-icons/fa";
import { MdDateRange, MdAccessTime } from "react-icons/md";
import { getVisitorOfSchool } from "../../../services/admin/visitorApi"; // Update with delete/update endpoints

interface Visitor {
  id: string;
  name: string;
  phone: string;
  email?: string;
  purpose: string;
  validFrom: string;
  validUntil: string;
  entryTime?: string;
  exitTime?: string;
  token: string;
}

const VisitorDetails: React.FC = () => {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [filteredVisitors, setFilteredVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedQR, setSelectedQR] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState<keyof Visitor>("name");
  const [sortAsc, setSortAsc] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editVisitor, setEditVisitor] = useState<Visitor | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Visitor | null>(null);

  useEffect(() => {
    const idFromStorage = localStorage.getItem("schoolId");
    if (!idFromStorage) {
      toast.error("School ID not found. Please login again.");
      return;
    }

    fetchVisitors(idFromStorage);
  }, []);

  const fetchVisitors = async (schoolId: string) => {
    setLoading(true);
    try {
      const response = await getVisitorOfSchool(schoolId);
      const data = response.data.visitors || response.data;
      setVisitors(data);
      setFilteredVisitors(data);
    } catch (error) {
      toast.error("Failed to fetch visitors");
    } finally {
      setLoading(false);
    }
  };
  // console.log("Visitor Data", visitors);
  // console.log("Filtered Visitor Data", filteredVisitors);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = visitors.filter((v) =>
      v.name.toLowerCase().includes(term) ||
      v.phone.includes(term) ||
      v.purpose.toLowerCase().includes(term)
    );
    setFilteredVisitors(filtered);
  };

  const handleSort = (key: keyof Visitor) => {
    const isAsc = sortKey === key ? !sortAsc : true;
    setSortKey(key);
    setSortAsc(isAsc);

    const sorted = [...filteredVisitors].sort((a, b) => {
      if (a[key]! < b[key]!) return isAsc ? -1 : 1;
      if (a[key]! > b[key]!) return isAsc ? 1 : -1;
      return 0;
    });

    setFilteredVisitors(sorted);
  };

  const handleEdit = (visitor: Visitor) => {
    setEditVisitor(visitor);
    setShowEditModal(true);
  };

  const handleDelete = (visitor: Visitor) => {
    setDeleteConfirm(visitor);
  };

  const confirmDelete = async () => {
    if (deleteConfirm) {
      // Replace with your delete API logic
      toast.success(`Deleted visitor ${deleteConfirm.name}`);
      setVisitors(prev => prev.filter(v => v.id !== deleteConfirm.id));
      setFilteredVisitors(prev => prev.filter(v => v.id !== deleteConfirm.id));
      setDeleteConfirm(null);
    }
  };

  const saveEdit = () => {
    if (editVisitor) {
      // Replace with update API logic
      toast.success(`Updated visitor ${editVisitor.name}`);
      const updatedList = visitors.map(v =>
        v.id === editVisitor.id ? editVisitor : v
      );
      setVisitors(updatedList);
      setFilteredVisitors(updatedList);
      setShowEditModal(false);
    }
  };

  const formatDate = (date?: string) =>
    date ? new Date(date).toLocaleString() : "-";

  return (
    <div className="page-wrapper">
      <div className="container py-5">
        <Card className="shadow-lg border-0 rounded-4">
          <Card.Body>
            <h2 className="mb-4 text-center fw-bold text-primary">Visitor Details</h2>

            <Row className="mb-3">
              <Col md={8}>
                <InputGroup>
                  <InputGroup.Text><FaSearch /></InputGroup.Text>
                  <Form.Control
                    placeholder="Search by name, phone or purpose..."
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </InputGroup>
              </Col>
            </Row>

            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
              </div>
            ) : (
              <div style={{ maxHeight: "500px", overflowY: "auto" }}>
                <Table striped hover bordered responsive className="align-middle table-fixed-header">
                  <thead className="table-primary text-center sticky-top" style={{ top: 0 }}>
                    <tr>
                      {["name", "phone", "email", "purpose", "validFrom", "validUntil", "entryTime", "exitTime", "QR", "Actions"].map(
                        (key, idx) => (
                          <th
                            key={idx}
                            onClick={() =>
                              key !== "QR" && key !== "Actions"
                                ? handleSort(key as keyof Visitor)
                                : undefined
                            }
                            style={{ cursor: key !== "QR" && key !== "Actions" ? "pointer" : "default" }}
                          >
                            {key === "QR" ? "QR Code" : key === "Actions" ? "Actions" : key.charAt(0).toUpperCase() + key.slice(1)}
                            {sortKey === key && (sortAsc ? " 🔼" : " 🔽")}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody className="text-center">
                    {filteredVisitors.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="text-muted py-4">
                          No visitor data available.
                        </td>
                      </tr>
                    ) : (
                      filteredVisitors.map((v) => (
                        <tr key={v.id}>
                          <td>{v.name}</td>
                          <td>{v.phone}</td>
                          <td>{v.email || "-"}</td>
                          <td>{v.purpose}</td>
                          <td>{formatDate(v.validFrom)}</td>
                          <td>{formatDate(v.validUntil)}</td>
                          <td>
                            {v.entryTime ? (
                              <Badge bg="success">
                                <MdAccessTime className="me-1" />
                                {formatDate(v.entryTime)}
                              </Badge>
                            ) : (
                              <Badge bg="secondary">Not Entered</Badge>
                            )}
                          </td>
                          <td>
                            {v.exitTime ? (
                              <Badge bg="danger">
                                <MdAccessTime className="me-1" />
                                {formatDate(v.exitTime)}
                              </Badge>
                            ) : (
                              <Badge bg="warning">In Campus</Badge>
                            )}
                          </td>
                          <td>
                            <OverlayTrigger overlay={<Tooltip>View QR</Tooltip>} placement="top">
                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() =>
                                  setSelectedQR(
                                    JSON.stringify({
                                      token: v.token,
                                      name: v.name,
                                      phone: v.phone,
                                      email: v.email,
                                      purpose: v.purpose,
                                    })
                                  )
                                }
                              >
                                <FaQrcode />
                              </Button>
                            </OverlayTrigger>
                          </td>
                          <td>
                            <Button variant="warning" size="sm" className="me-2" onClick={() => handleEdit(v)}>
                              <FaEdit />
                            </Button>
                            <Button variant="danger" size="sm" onClick={() => handleDelete(v)}>
                              <FaTrash />
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </div>
            )}
          </Card.Body>
        </Card>

        {/* QR Modal */}
        <Modal show={!!selectedQR} onHide={() => setSelectedQR(null)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Visitor QR Code</Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-center">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
                selectedQR || ""
              )}&size=200x200`}
              alt="QR Code"
              className="img-fluid border rounded-3 shadow-sm"
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setSelectedQR(null)}>
              <FaTimesCircle className="me-1" /> Close
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Edit Modal */}
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Edit Visitor</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {editVisitor && (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    value={editVisitor.name}
                    onChange={(e) => setEditVisitor({ ...editVisitor, name: e.target.value })}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    value={editVisitor.phone}
                    onChange={(e) => setEditVisitor({ ...editVisitor, phone: e.target.value })}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Purpose</Form.Label>
                  <Form.Control
                    value={editVisitor.purpose}
                    onChange={(e) => setEditVisitor({ ...editVisitor, purpose: e.target.value })}
                  />
                </Form.Group>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={saveEdit}>Save Changes</Button>
          </Modal.Footer>
        </Modal>

        {/* Delete Confirmation */}
        <Modal show={!!deleteConfirm} onHide={() => setDeleteConfirm(null)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Delete Visitor</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete <strong>{deleteConfirm?.name}</strong>?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
            <Button variant="danger" onClick={confirmDelete}>Delete</Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default VisitorDetails;
