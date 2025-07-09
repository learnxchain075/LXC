import React from 'react';
import { Table } from 'react-bootstrap';

type Log = {
  id: string;
  recipient: string;
  type: string;
  message: string;
  status: string;
  triggerEvent?: string;
  channelUsed?: string;
  sentBy?: string;
  school?: string;
};

interface Props {
  logs: Log[];
}

const LogTable: React.FC<Props> = ({ logs }) => (
  <Table  bordered hover responsive>
    <thead>
      <tr>
        <th>Date</th>
        <th>Recipient</th>
        <th>Type</th>
        <th>Status</th>
        <th>Event</th>
        <th>Channel</th>
      </tr>
    </thead>
    <tbody>
      {logs.map(l => (
        <tr key={l.id}>
          <td>{l.id}</td>
          <td>{l.recipient}</td>
          <td>{l.type}</td>
          <td>{l.status}</td>
          <td>{l.triggerEvent}</td>
          <td>{l.channelUsed}</td>
        </tr>
      ))}
    </tbody>
  </Table>
);

export default LogTable;
