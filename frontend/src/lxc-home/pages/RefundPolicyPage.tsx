// src/components/RefundPolicyPage.js

import React from 'react';
import { Container, Card, Accordion } from 'react-bootstrap';
import refundPolicyData from '../assets/data/lxcRefundPolicyData';

const RefundPolicyPage = () => {
  return (
    <Container className="mt-5 mb-5">
      <Card className="shadow">
        <Card.Body>
          <h2 className="mb-3 text-primary">Cancellation & Refund Policy</h2>
          <p className="text-muted">Last updated on {refundPolicyData.lastUpdated}</p>
          <Accordion defaultActiveKey="0">
            {refundPolicyData.sections.map((section, index) => (
              <Accordion.Item eventKey={index.toString()} key={index}>
                <Accordion.Header>{section.title}</Accordion.Header>
                <Accordion.Body>
                  {section.content.map((line, idx) => (
                    <p key={idx} style={{ marginBottom: "0.5rem" }}>{line}</p>
                  ))}
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default RefundPolicyPage;
