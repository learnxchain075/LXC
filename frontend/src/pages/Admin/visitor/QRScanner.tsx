import React, { useState, useRef, useEffect } from "react";
import {
  Card,
  Button,
  Modal,
  Form,
  Alert,
  Spinner,
  Badge,
  Row,
  Col,
  Container,
} from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { QrReader } from "react-qr-reader";
import { 
  FaCamera, 
  FaUpload, 
  FaQrcode, 
  FaClock, 
  FaUserCheck, 
  FaUserTimes,
  FaHistory,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimesCircle,
  FaPlay,
  FaStop,
  FaCog,
  FaLightbulb,
  FaDatabase
} from "react-icons/fa";
import { verifyEntry, verifyExit, getVisitorByToken, validateQRToken } from "../../../services/admin/visitorApi";
import { IVisitor, IVisitorQRData } from "../../../services/types/admin/vistior/vistiorService";

interface ScanRecord {
  id: string;
  token: string;
  visitorName: string;
  scanType: 'entry' | 'exit';
  timestamp: Date;
  status: 'success' | 'error' | 'expired' | 'limit_exceeded';
  message: string;
}

const QRScanner: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [currentVisitor, setCurrentVisitor] = useState<IVisitor | null>(null);
  const [scanHistory, setScanHistory] = useState<ScanRecord[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showData, setShowData] = useState(false);
  const [timer, setTimer] = useState<{ start: Date | null; end: Date | null }>({ start: null, end: null });
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [scanDelay, setScanDelay] = useState(300);
  const [lastScannedData, setLastScannedData] = useState<string>('');
  const [storedData, setStoredData] = useState<Record<string, any>>({});
  const [testMode, setTestMode] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isTimerRunning) {
      const interval = setInterval(() => {
        setTimer((prev: { start: Date | null; end: Date | null }) => ({ ...prev }));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isTimerRunning]);

  const handleScan = (result: any) => {
    if (result && result.text && result.text !== lastScannedData) {
      setLastScannedData(result.text);
      
      const scanData = {
        rawData: result.text,
        timestamp: new Date().toISOString(),
        processed: false
      };
      
      setStoredData((prev: Record<string, any>) => ({
        ...prev,
        [Date.now()]: scanData
      }));
      
      processQRData(result.text);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      simulateQRRead(result);
    };
    reader.readAsDataURL(file);
  };

  const simulateQRRead = (imageData: string) => {
    setIsProcessing(true);
    setTimeout(() => {
      const mockToken = "TEST_" + Math.random().toString(36).substr(2, 9);
      const scanData = {
        rawData: imageData,
        timestamp: new Date().toISOString(),
        processed: true,
        parsedData: { token: mockToken }
      };
      
      setStoredData((prev: Record<string, any>) => ({
        ...prev,
        [Date.now()]: scanData
      }));
      
      processQRData(mockToken);
      setIsProcessing(false);
    }, 2000);
  };

  const processQRData = async (token: string) => {
    setIsProcessing(true);
    
    try {
      let visitor: IVisitor | null = null;
      
      if (testMode) {
        // Generate mock visitor data for testing
        visitor = {
          id: "test-" + Date.now(),
          name: "Test Visitor " + Math.floor(Math.random() * 100),
          phone: "+1" + Math.floor(Math.random() * 9000000000) + 1000000000,
          email: "test" + Math.floor(Math.random() * 1000) + "@example.com",
          purpose: "Testing QR Scanner",
          token: token,
          validFrom: new Date(Date.now() - 24 * 60 * 60 * 1000),
          validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000),
          schoolId: "test-school",
          createdAt: new Date(),
          updatedAt: new Date()
        };
      } else {
        // Get visitor data from backend
        const response = await getVisitorByToken(token);
        visitor = response.data;
      }
      
      if (!visitor) {
        throw new Error("Visitor not found");
      }
      
      setCurrentVisitor(visitor);
      
      const validation = validateQRCode(visitor);
      
      if (!validation.isValid) {
        addScanRecord({
          id: Date.now().toString(),
          token: visitor.token,
          visitorName: visitor.name,
          scanType: 'entry',
          timestamp: new Date(),
          status: validation.status,
          message: validation.message
        });
        
        toast.error(validation.message);
        return;
      }

      const isEntry = !visitor.entryTime || (visitor.entryTime && visitor.exitTime);
      
      if (isEntry) {
        await handleEntry(visitor);
      } else {
        await handleExit(visitor);
      }
      
    } catch (error) {
      console.error("Scan processing error:", error);
      toast.error("Failed to process scan");
      
      addScanRecord({
        id: Date.now().toString(),
        token: token,
        visitorName: "Unknown",
        scanType: 'entry',
        timestamp: new Date(),
        status: 'error',
        message: "Failed to process scan"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const validateQRCode = (visitor: IVisitor): { isValid: boolean; status: ScanRecord['status']; message: string } => {
    const now = new Date();
    const validFrom = new Date(visitor.validFrom);
    const validUntil = new Date(visitor.validUntil);

    if (now > validUntil) {
      return {
        isValid: false,
        status: 'expired',
        message: 'QR code has expired'
      };
    }

    if (now < validFrom) {
      return {
        isValid: false,
        status: 'error',
        message: 'QR code is not yet valid'
      };
    }

    return {
      isValid: true,
      status: 'success',
      message: 'QR code is valid'
    };
  };

  const handleEntry = async (visitor: IVisitor) => {
    try {
      if (!testMode) {
        await verifyEntry(visitor.token);
      }
      
      addScanRecord({
        id: Date.now().toString(),
        token: visitor.token,
        visitorName: visitor.name,
        scanType: 'entry',
        timestamp: new Date(),
        status: 'success',
        message: 'Entry recorded successfully'
      });

      toast.success(`Welcome ${visitor.name}! Entry time recorded.`);
      
      setTimer({ start: new Date(), end: null });
      setIsTimerRunning(true);
      
    } catch (error) {
      toast.error("Failed to record entry");
      throw error;
    }
  };

  const handleExit = async (visitor: IVisitor) => {
    try {
      if (!testMode) {
        await verifyExit(visitor.token);
      }
      
      addScanRecord({
        id: Date.now().toString(),
        token: visitor.token,
        visitorName: visitor.name,
        scanType: 'exit',
        timestamp: new Date(),
        status: 'success',
        message: 'Exit recorded successfully'
      });

      toast.success(`Goodbye ${visitor.name}! Exit time recorded.`);
      
      setTimer({ start: timer.start, end: new Date() });
      setIsTimerRunning(false);
      
    } catch (error) {
      toast.error("Failed to record exit");
      throw error;
    }
  };

  const addScanRecord = (record: ScanRecord) => {
    setScanHistory(prev => [record, ...prev.slice(0, 9)]);
  };

  const getStatusIcon = (status: ScanRecord['status']) => {
    switch (status) {
      case 'success':
        return <FaCheckCircle className="text-success" />;
      case 'error':
        return <FaTimesCircle className="text-danger" />;
      case 'expired':
        return <FaExclamationTriangle className="text-warning" />;
      case 'limit_exceeded':
        return <FaExclamationTriangle className="text-danger" />;
      default:
        return <FaTimesCircle className="text-secondary" />;
    }
  };

  const getStatusBadge = (status: ScanRecord['status']) => {
    const variants = {
      success: 'success',
      error: 'danger',
      expired: 'warning',
      limit_exceeded: 'danger'
    };
    
    return <Badge bg={variants[status]}>{status.replace('_', ' ').toUpperCase()}</Badge>;
  };

  const formatDuration = (start: Date, end: Date) => {
    const diff = end.getTime() - start.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const resetTimer = () => {
    setTimer({ start: null, end: null });
    setIsTimerRunning(false);
  };

  const clearStoredData = () => {
    setStoredData({});
    setScanHistory([]);
    setCurrentVisitor(null);
    toast.success("All stored data cleared");
  };

  const generateTestQR = () => {
    const testToken = "TEST_" + Math.random().toString(36).substr(2, 9);
    setLastScannedData(testToken);
    processQRData(testToken);
  };

  return (
    <div className="page-wrapper">
      <Container fluid className="py-4">
        <ToastContainer position="top-center" autoClose={3000} />
        
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h2 className="mb-2">
                  <FaQrcode className="me-2 text-primary" />
                  QR Code Scanner
                  {testMode && <Badge bg="warning" className="ms-2">TEST MODE</Badge>}
                </h2>
                <p className="text-muted mb-0">
                  Scan QR codes to record visitor entry and exit times with real-time validation
                </p>
              </div>
              <div>
                <Button
                  variant="outline-warning"
                  size="sm"
                  onClick={() => setTestMode(!testMode)}
                  className="me-2"
                >
                  {testMode ? "Live Mode" : "Test Mode"}
                </Button>
                <Button
                  variant="outline-info"
                  size="sm"
                  onClick={() => setShowData(true)}
                  className="me-2"
                >
                  <FaDatabase className="me-1" />
                  Data
                </Button>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => setShowSettings(true)}
                  className="me-2"
                >
                  <FaLightbulb className="me-1" />
                  Tips
                </Button>
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => setShowHistory(true)}
                >
                  <FaHistory className="me-1" />
                  History
                </Button>
              </div>
            </div>
          </Col>
        </Row>

        <Row>
          <Col lg={8}>
            <Card className="shadow-lg border-0 rounded-4 mb-4">
              <Card.Header className="bg-primary text-white">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">
                    <FaCamera className="me-2" />
                    QR Scanner
                  </h5>
                  <div>
                    {isScanning && (
                      <Badge bg="success" className="me-2">
                        <FaPlay className="me-1" />
                        Active
                      </Badge>
                    )}
                    <Badge bg="info">
                      Delay: {scanDelay}ms
                    </Badge>
                  </div>
                </div>
              </Card.Header>
              <Card.Body className="p-4">
                
                <Row className="mb-4">
                  <Col md={4}>
                    <Button
                      variant={isScanning ? "danger" : "primary"}
                      size="sm"
                      className="w-100 mb-2"
                      onClick={() => setIsScanning(!isScanning)}
                      disabled={isProcessing}
                    >
                      {isScanning ? (
                        <>
                          <FaStop className="me-2" />
                          Stop Scanner
                        </>
                      ) : (
                        <>
                          <FaCamera className="me-2" />
                          Start Scanner
                        </>
                      )}
                    </Button>
                  </Col>
                  <Col md={4}>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="w-100 mb-2"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isProcessing}
                    >
                      <FaUpload className="me-2" />
                      Upload QR Image
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      style={{ display: 'none' }}
                    />
                  </Col>
                  <Col md={4}>
                    <Button
                      variant="outline-success"
                      size="sm"
                      className="w-100 mb-2"
                      onClick={generateTestQR}
                      disabled={isProcessing}
                    >
                      <FaQrcode className="me-2" />
                      Generate Test QR
                    </Button>
                  </Col>
                </Row>

                {isScanning && (
                  <div className="text-center mb-4">
                    <div className="position-relative d-inline-block">
                      <div style={{ width: '100%', maxWidth: '500px' }} className="border rounded-3">
                        <QrReader
                          constraints={{ facingMode: 'environment' }}
                          onResult={handleScan}
                        />
                      </div>
                      <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center pointer-events-none">
                        <div className="border border-3 border-primary rounded" style={{ width: '200px', height: '200px' }}>
                          <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center">
                            <FaQrcode className="text-primary" style={{ fontSize: '3rem', opacity: 0.3 }} />
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="text-muted mt-2">
                      <FaLightbulb className="me-1" />
                      Position QR code within the frame for automatic scanning
                    </p>
                  </div>
                )}

                {isProcessing && (
                  <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" size="sm" />
                    <p className="mt-3">Processing QR code...</p>
                  </div>
                )}

                {currentVisitor && (
                  <Card className="border-primary">
                    <Card.Header className="bg-light">
                      <h6 className="mb-0">
                        <FaUserCheck className="me-2" />
                        Scanned Visitor Details
                      </h6>
                    </Card.Header>
                    <Card.Body>
                      <Row>
                        <Col md={6}>
                          <p><strong>Name:</strong> {currentVisitor.name}</p>
                          <p><strong>Phone:</strong> {currentVisitor.phone}</p>
                          <p><strong>Purpose:</strong> {currentVisitor.purpose}</p>
                        </Col>
                        <Col md={6}>
                          <p><strong>Token:</strong> <code>{currentVisitor.token}</code></p>
                          <p><strong>Valid Until:</strong> {new Date(currentVisitor.validUntil).toLocaleString()}</p>
                          <p><strong>Status:</strong> 
                            {currentVisitor.entryTime && !currentVisitor.exitTime ? (
                              <Badge bg="success" className="ms-2">Inside</Badge>
                            ) : currentVisitor.exitTime ? (
                              <Badge bg="secondary" className="ms-2">Exited</Badge>
                            ) : (
                              <Badge bg="warning" className="ms-2">Not Entered</Badge>
                            )}
                          </p>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                )}
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            <Card className="shadow-lg border-0 rounded-4 mb-4">
              <Card.Header className="bg-success text-white">
                <div className="d-flex justify-content-between align-items-center">
                  <h6 className="mb-0">
                    <FaClock className="me-2" />
                    Visit Timer
                  </h6>
                  {isTimerRunning && (
                    <Button
                      variant="outline-light"
                      size="sm"
                      onClick={resetTimer}
                    >
                      Reset
                    </Button>
                  )}
                </div>
              </Card.Header>
              <Card.Body className="text-center">
                {isTimerRunning ? (
                  <>
                    <div className="display-4 text-success mb-3">
                      {timer.start && timer.end 
                        ? formatDuration(timer.start, timer.end)
                        : timer.start 
                        ? formatDuration(timer.start, new Date())
                        : '00:00:00'
                      }
                    </div>
                    <Badge bg="success" className="mb-3">
                      <FaPlay className="me-1" />
                      Timer Running
                    </Badge>
                  </>
                ) : (
                  <>
                    <div className="display-4 text-muted mb-3">00:00:00</div>
                    <Badge bg="secondary">
                      <FaStop className="me-1" />
                      Timer Stopped
                    </Badge>
                  </>
                )}
              </Card.Body>
            </Card>

            <Card className="shadow-lg border-0 rounded-4">
              <Card.Header className="bg-info text-white d-flex justify-content-between align-items-center">
                <h6 className="mb-0">
                  <FaHistory className="me-2" />
                  Recent Scans
                </h6>
                <Button
                  variant="outline-light"
                  size="sm"
                  onClick={() => setShowHistory(true)}
                >
                  View All
                </Button>
              </Card.Header>
              <Card.Body style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {scanHistory.length === 0 ? (
                  <div className="text-center text-muted">
                    <FaQrcode className="mb-2" style={{ fontSize: '2rem', opacity: 0.5 }} />
                    <p>No scans yet</p>
                    <small>Start scanning to see activity here</small>
                  </div>
                ) : (
                  scanHistory.slice(0, 5).map((record) => (
                    <div key={record.id} className="d-flex align-items-center mb-3 p-2 border-bottom">
                      <div className="me-3">
                        {getStatusIcon(record.status)}
                      </div>
                      <div className="flex-grow-1">
                        <div className="fw-bold">{record.visitorName}</div>
                        <div className="small text-muted">
                          {record.scanType === 'entry' ? 'Entry' : 'Exit'} - {record.timestamp.toLocaleTimeString()}
                        </div>
                        <div className="small">
                          {getStatusBadge(record.status)}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Modal show={showHistory} onHide={() => setShowHistory(false)} size="xl">
          <Modal.Header closeButton>
            <Modal.Title>
              <FaHistory className="me-2" />
              Scan History
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {scanHistory.length === 0 ? (
                <p className="text-muted text-center">No scan history available</p>
              ) : (
                scanHistory.map((record) => (
                  <Card key={record.id} className="mb-3">
                    <Card.Body>
                      <div className="d-flex align-items-center">
                        <div className="me-3">
                          {getStatusIcon(record.status)}
                        </div>
                        <div className="flex-grow-1">
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <h6 className="mb-1">{record.visitorName}</h6>
                              <p className="mb-1 text-muted">
                                Token: <code>{record.token}</code>
                              </p>
                              <p className="mb-1">
                                {record.scanType === 'entry' ? (
                                  <Badge bg="success">Entry</Badge>
                                ) : (
                                  <Badge bg="danger">Exit</Badge>
                                )}
                              </p>
                            </div>
                            <div className="text-end">
                              <div className="small text-muted">
                                {record.timestamp.toLocaleDateString()}
                              </div>
                              <div className="small text-muted">
                                {record.timestamp.toLocaleTimeString()}
                              </div>
                            </div>
                          </div>
                          <div className="mt-2">
                            {getStatusBadge(record.status)}
                            <span className="ms-2 small">{record.message}</span>
                          </div>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                ))
              )}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowHistory(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showData} onHide={() => setShowData(false)}>
          <Modal.Header closeButton>
            <Modal.Title>
              <FaDatabase className="me-2" />
              Stored Data
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6>Raw Scan Data ({Object.keys(storedData).length} entries)</h6>
              <Button variant="outline-danger" size="sm" onClick={clearStoredData}>
                Clear All Data
              </Button>
            </div>
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {Object.keys(storedData).length === 0 ? (
                <p className="text-muted text-center">No stored data available</p>
              ) : (
                Object.entries(storedData).map(([timestamp, data]: [string, any]) => (
                  <Card key={timestamp} className="mb-3">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h6 className="mb-0">Scan at {new Date(parseInt(timestamp)).toLocaleString()}</h6>
                        <Badge bg={data.processed ? "success" : "warning"}>
                          {data.processed ? "Processed" : "Raw"}
                        </Badge>
                      </div>
                      <div className="mb-2">
                        <strong>Raw Data:</strong>
                        <pre className="bg-light p-2 rounded mt-1" style={{ fontSize: '0.8rem' }}>
                          {data.rawData}
                        </pre>
                      </div>
                      {data.parsedData && (
                        <div>
                          <strong>Parsed Data:</strong>
                          <pre className="bg-light p-2 rounded mt-1" style={{ fontSize: '0.8rem' }}>
                            {JSON.stringify(data.parsedData, null, 2)}
                          </pre>
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                ))
              )}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowData(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showSettings} onHide={() => setShowSettings(false)}>
          <Modal.Header closeButton>
            <Modal.Title>
              <FaLightbulb className="me-2" />
              Scanner Tips & Settings
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="mb-4">
              <h6>How to Use:</h6>
              <ul>
                <li>Click "Start Scanner" to activate camera</li>
                <li>Position QR code within the scanning frame</li>
                <li>Scanner will automatically detect and process QR codes</li>
                <li>First scan = Entry time, Second scan = Exit time</li>
                <li>Each QR code can be used up to 3 times</li>
                <li>Use "Generate Test QR" for testing without real QR codes</li>
              </ul>
            </div>
            
            <div className="mb-4">
              <h6>Validation Rules:</h6>
              <ul>
                <li>QR code must be within valid date range</li>
                <li>Maximum 3 scan attempts per QR code</li>
                <li>Entry and exit times are automatically tracked</li>
                <li>Real-time validation prevents expired codes</li>
              </ul>
            </div>

            <div>
              <h6>Scanner Settings:</h6>
              <Form.Group>
                <Form.Label>Scan Delay (ms)</Form.Label>
                <Form.Control
                  type="range"
                  min="100"
                  max="1000"
                  step="100"
                  value={scanDelay}
                  onChange={(e) => setScanDelay(Number(e.target.value))}
                />
                <Form.Text className="text-muted">
                  Lower delay = faster scanning, Higher delay = more stable
                </Form.Text>
              </Form.Group>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowSettings(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

export default QRScanner; 