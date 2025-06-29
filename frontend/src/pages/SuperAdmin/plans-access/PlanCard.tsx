import React from "react";
import { Card, Badge, Button } from "react-bootstrap";
import {
  FaUserFriends,
  FaCalendarAlt,
  FaRupeeSign,
  FaCheckCircle,
  FaInfinity,
  FaCube,
} from "react-icons/fa";

const PlanCard = ({ plan, selected, onSelect }: any) => {
  const modules = [
    "Student & Teacher Portals",
    "Library, Hostel, Transport",
    "Fee & Payment Management",
    "Live Classes & Whiteboard",
    "Attendance & Exam Reports",
    "Study Planner + Leaderboard",
  ];

  return (
    <Card
      className={`mb-4 shadow-lg ${selected ? "border-primary" : "border-light"}`}
      onClick={onSelect}
      style={{
        cursor: "pointer",
        borderWidth: selected ? "2px" : "1px",
        transition: "all 0.3s ease-in-out",
        background: selected
          ? "linear-gradient(135deg, #4B6CB7 0%, #182848 100%)"
          : "#ffffff",
        color: selected ? "#ffffff" : "#333",
        borderRadius: "12px",
      }}
    >
      <Card.Body>
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <Card.Title style={{ fontWeight: "700", fontSize: "1.4rem" }}>
            {plan.name}
          </Card.Title>
          {selected && (
            <Badge bg="light" text="dark" pill>
              Selected
            </Badge>
          )}
        </div>

        {/* Price and Basic Info */}
        <div className="mb-3">
          <div className="d-flex align-items-center mb-2">
            <FaRupeeSign className="me-2" />
            <strong style={{ fontSize: "1.2rem" }}>₹{plan.price}</strong>
          </div>
          <div className="d-flex align-items-center mb-2">
            <FaCalendarAlt className="me-2" />
            Duration: {plan.durationDays} Days
          </div>
          <div className="d-flex align-items-center mb-2">
            <FaUserFriends className="me-2" />
            Max Users: {plan.maxUsers}
          </div>
          <div className="d-flex align-items-center">
            <FaInfinity className="me-2" />
            <span className="fw-bold">All Modules Included</span>
          </div>
        </div>

        {/* Module Access List */}
        <div className="mb-3">
          {modules.map((mod, idx) => (
            <div
              key={idx}
              className="d-flex align-items-center mb-1"
              style={{
                fontSize: "0.9rem",
                color: selected ? "#e0e0e0" : "#555",
              }}
            >
              <FaCheckCircle className="me-2 text-success" />
              {mod}
            </div>
          ))}
        </div>

        {/* Static Content Info */}
        <div className="mb-3">
          <Badge bg={selected ? "light" : "info"} text={selected ? "dark" : "light"}>
            <FaCube className="me-1" />
            Static + Smart AI Content Included
          </Badge>
        </div>

        {/* Call to Action */}
        <div className="text-end">
          <Button
            variant={selected ? "light" : "primary"}
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(plan);
            }}
          >
            {selected ? "Selected" : "Choose Plan"}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default PlanCard;
