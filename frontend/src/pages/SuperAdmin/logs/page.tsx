// Enhanced Logs component with full advanced features and detailed modal viewer
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import Spinner from 'react-bootstrap/Spinner';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as XLSX from 'xlsx';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const socket = io('https://api.learnxchain.io');

type Log = {
  id: string;
  createdAt: string;
  method: string;
  path: string;
  status: number;
  duration: number;
  ip: string;
  userAgent?: string;
  city?: string;
  region?: string;
  requestHeaders?: string;
  requestQuery?: string;
  requestBody?: string;
  responseBody?: string;
  errorStack?: string;
  isNew?: boolean;
};

const Logs = () => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [allLogs, setAllLogs] = useState<Log[]>([]);
  const [selectedLog, setSelectedLog] = useState<Log | null>(null);
  const [page, setPage] = useState(1);
  const [filterMethod, setFilterMethod] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterSearch, setFilterSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sort, setSort] = useState('desc');
  const [stats, setStats] = useState({ total: 0, success: 0, failed: 0 });
  const [loading, setLoading] = useState(true);

  const pageSize = 12;

  useEffect(() => {
    fetchLogs();
    let isMounted = true;

    socket.on('new-log', (log) => {
      if (isMounted) {
        toast.success('New log received');
        const newLog = { ...log, isNew: true };
        setLogs((prev) => [newLog, ...prev.slice(0, 99)]);
        setTimeout(() => {
          setLogs((prevLogs) => prevLogs.map(l => l.id === newLog.id ? { ...l, isNew: false } : l));
        }, 5000);
      }
    });

    return () => {
      isMounted = false;
      socket.off('new-log');
    };
  }, [filterMethod, sort, page, filterStatus, filterSearch, startDate, endDate]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await axios.get('https://api.learnxchain.io/api/v1/server/logs');
      let logsData = res.data.logs.map((log: Log) => ({ ...log, isNew: false }));
      setAllLogs(logsData);

      logsData = filterMethod ? logsData.filter((log: Log) => log.method === filterMethod) : logsData;
      logsData = filterStatus ? logsData.filter((log: Log) => log.status.toString().startsWith(filterStatus)) : logsData;
      logsData = filterSearch ? logsData.filter((log: Log) => log.path.includes(filterSearch) || log.ip.includes(filterSearch) || (log.userAgent || '').includes(filterSearch)) : logsData;
      logsData = startDate ? logsData.filter((log: Log) => new Date(log.createdAt) >= new Date(startDate)) : logsData;
      logsData = endDate ? logsData.filter((log: Log) => new Date(log.createdAt) <= new Date(endDate)) : logsData;

      const sorted = [...logsData].sort((a, b) =>
        sort === 'desc'
          ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

      const start = (page - 1) * pageSize;
      const paginated = sorted.slice(start, start + pageSize);

      setLogs(paginated);
      setStats({
        total: logsData.length,
        success: logsData.filter((log: Log) => log.status < 400).length,
        failed: logsData.filter((log: Log) => log.status >= 400).length,
      });
    } catch (error) {
      toast.error('Failed to fetch logs');
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(allLogs);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Logs');
    XLSX.writeFile(workbook, `logs-${new Date().toISOString()}.xlsx`);
  };

  const formatJson = (jsonStr: string | undefined) => {
    if (!jsonStr) return <span className="text-muted">None</span>;
    try {
      const obj = JSON.parse(jsonStr);
      return <pre>{JSON.stringify(obj, null, 2)}</pre>;
    } catch {
      return <code>{jsonStr}</code>;
    }
  };

  const chartData = {
    labels: ['Total', 'Success', 'Failed'],
    datasets: [{
      label: 'Requests',
      data: [stats.total, stats.success, stats.failed],
      backgroundColor: ['#0d6efd', '#198754', '#dc3545'],
      barThickness: 30,
    }],
  };

  return (
    <div className="page-wrapper">
    <div className="container-fluid py-4">
      <ToastContainer />
      <h3 className="mb-4">🚨 Real-time Error Tracker</h3>

      <div className="d-flex flex-wrap gap-2 mb-3">
        <input type="text" className="form-control w-auto" placeholder="Search IP / Path / UA" value={filterSearch} onChange={(e) => setFilterSearch(e.target.value)} />
        <input type="date" className="form-control w-auto" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        <input type="date" className="form-control w-auto" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        <select className="form-select w-auto" value={filterMethod} onChange={(e) => setFilterMethod(e.target.value)}>
          <option value="">All Methods</option>
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
        </select>
        <select className="form-select w-auto" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="">All Status</option>
          <option value="2">2xx</option>
          <option value="4">4xx</option>
          <option value="5">5xx</option>
        </select>
        <select className="form-select w-auto" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="desc">Newest First</option>
          <option value="asc">Oldest First</option>
        </select>
        <button className="btn btn-outline-success" onClick={exportToExcel}>Export to Excel</button>
      </div>

      <div style={{ maxWidth: '400px' }} className="mb-4">
        <Bar data={chartData} options={{ plugins: { legend: { display: false } } }} />
      </div>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Loading logs...</p>
        </div>
      ) : (
        <div className="row">
          {logs.map(log => (
            <div key={log.id} className={`col-md-4 mb-3 ${log.isNew ? 'new-log' : ''}`}>
              <div className="card">
                <div className="card-header">{new Date(log.createdAt).toLocaleString()}</div>
                <div className="card-body">
                  <span className={`badge bg-${log.method === 'GET' ? 'primary' : log.method === 'POST' ? 'success' : log.method === 'PUT' ? 'warning' : 'danger'} me-2`}>{log.method}</span>
                  <code>{log.path}</code>
                  <p className="mt-2">Status: <span className={`badge bg-${log.status >= 500 ? 'danger' : log.status >= 400 ? 'warning' : 'success'}`}>{log.status}</span></p>
                  <p>Duration: {log.duration}ms | IP: {log.ip}</p>
                </div>
                <div className="card-footer">
                  <button className="btn btn-primary btn-sm" onClick={() => setSelectedLog(log)}>Details</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <nav>
        <ul className="pagination">
          <li className={`page-item ${page === 1 ? 'disabled' : ''}`}><button className="page-link" onClick={() => setPage(p => p - 1)}>Previous</button></li>
          <li className="page-item"><span className="page-link">Page {page}</span></li>
          <li className={`page-item ${logs.length < pageSize ? 'disabled' : ''}`}><button className="page-link" onClick={() => setPage(p => p + 1)}>Next</button></li>
        </ul>
      </nav>

      {selectedLog && (
        <>
          <div className="modal fade show" style={{ display: 'block' }}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Log Details - {new Date(selectedLog.createdAt).toLocaleString()}</h5>
                  <button type="button" className="btn-close" onClick={() => setSelectedLog(null)}></button>
                </div>
                <div className="modal-body">
                  <p><strong>Method:</strong> {selectedLog.method}</p>
                  <p><strong>Path:</strong> {selectedLog.path}</p>
                  <p><strong>Status:</strong> {selectedLog.status}</p>
                  <p><strong>Duration:</strong> {selectedLog.duration}ms</p>
                  <p><strong>IP:</strong> {selectedLog.ip}</p>
                  <p><strong>User Agent:</strong> {selectedLog.userAgent || '-'}</p>
                  <p><strong>Location:</strong> {selectedLog.city || '-'}, {selectedLog.region || '-'}</p>
                  <hr />
                  <details><summary>Request Headers</summary>{formatJson(selectedLog.requestHeaders)}</details>
                  <details><summary>Request Query</summary>{formatJson(selectedLog.requestQuery)}</details>
                  <details><summary>Request Body</summary>{formatJson(selectedLog.requestBody)}</details>
                  <details><summary>Response Body</summary>{formatJson(selectedLog.responseBody)}</details>
                  {selectedLog.errorStack && <details><summary className="text-danger">Error Stack</summary><pre className="text-danger">{selectedLog.errorStack}</pre></details>}
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </div>
    </div>
  );
};

export default Logs;
