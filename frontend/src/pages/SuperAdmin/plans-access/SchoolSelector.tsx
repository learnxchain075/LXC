import React, { useState, useEffect } from "react";
import {
  Form,
  Modal,
  Button,
  InputGroup,
  Spinner,
  ListGroup,
} from "react-bootstrap";
import { FaSearch, FaSchool } from "react-icons/fa";
import { getAllSchools } from "../../../services/superadmin/schoolService";
import { Loader } from "react-feather";
import CustomLoader from "../../../components/Loader";

interface School {
  id: string;
  schoolName: string;
  schoolLogo?: string;
}

interface SchoolSelectorProps {
  onSelect: (school: School) => void;
}

const SchoolSelector: React.FC<SchoolSelectorProps> = ({ onSelect }) => {
  const [schools, setSchools] = useState<School[]>([]);
  const [filtered, setFiltered] = useState<School[]>([]);
  const [search, setSearch] = useState("");
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSchools = async () => {
    setLoading(true);
    try {
      const response = await getAllSchools();
      const data = response?.data?.schools;
      if (Array.isArray(data)) {
        const valid = data.filter(
          (s: any) =>
            s && typeof s.id === "string" && typeof s.schoolName === "string"
        );
        setSchools(valid);
        setFiltered(valid);
      } else {
        setError("Failed to load school list.");
      }
    } catch (err) {
      setError("Failed to load school list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showModal) fetchSchools();
  }, [showModal]);

  const handleSearch = (text: string) => {
    setSearch(text);
    setFiltered(
      schools.filter((s) =>
        s.schoolName.toLowerCase().includes(text.toLowerCase())
      )
    );
  };

  const handleSchoolSelect = (school: School) => {
    setSelectedSchool(school);
    onSelect(school);
    setShowModal(false);
    setSearch("");
  };

  return (
    <>
      <InputGroup onClick={() => setShowModal(true)} style={{ cursor: "pointer" }}>
        <InputGroup.Text>
          <FaSchool />
        </InputGroup.Text>
        <Form.Control
          type="text"
          value={selectedSchool ? selectedSchool.schoolName : ""}
          placeholder="Select a school"
          readOnly
          className="bg-white"
        />
        <InputGroup.Text className="text-muted">▼</InputGroup.Text>
      </InputGroup>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Select a School</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputGroup className="mb-3">
            <InputGroup.Text>
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search school..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </InputGroup>

          {loading ? (
            <div className="d-flex align-items-center justify-content-center my-5">
              {/* <Spinner animation="border" /> */}
              <CustomLoader variant="dots" color="#3067e3" size={50} />
            </div>
          ) : error ? (
            <div className="text-danger">{error}</div>
          ) : (
            <ListGroup style={{ maxHeight: "300px", overflowY: "auto" }}>
              {filtered.length > 0 ? (
                filtered.map((school) => (
                  <ListGroup.Item
                    key={school.id}
                    action
                    onClick={() => handleSchoolSelect(school)}
                    className="d-flex align-items-center"
                  >
                    {school.schoolLogo && (
                      <img
                        src={school.schoolLogo}
                        alt="Logo"
                        style={{
                          width: 35,
                          height: 35,
                          borderRadius: "50%",
                          objectFit: "cover",
                          marginRight: 10,
                        }}
                      />
                    )}
                    {school.schoolName}
                  </ListGroup.Item>
                ))
              ) : (
                <div className="text-muted text-center py-3">
                  No schools found.
                </div>
              )}
            </ListGroup>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default SchoolSelector;
