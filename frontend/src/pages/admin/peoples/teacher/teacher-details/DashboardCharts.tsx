import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Label } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28CFF', '#FF6F91', '#FFB347', '#B0E57C'];
const DARK_COLORS = ['#1e90ff', '#00b894', '#fdcb6e', '#e17055', '#6c5ce7', '#d63031', '#fd79a8', '#00cec9'];

interface LeaveBalance {
  total: number;
  used: number;
  remaining: number;
}

interface DashboardStats {
  totalClasses: number;
  totalStudents: number;
  attendanceRate: number;
  leaveBalance: number;
  upcomingClasses: number;
  recentActivities: number;
  pendingLeaves: number;
  todayClasses: number;
  assignmentsDue: number;
  notifications: number;
}

interface ITeacherUIClassData {
  id: string;
  name: string;
  section?: string;
  roomNumber?: string;
  totalStudents: number;
  subjects?: any[];
}

interface ITeacherUIStudentLeaveRequest {
  id: string;
  status: string;
}

interface Notification {
  id: string;
  type: string;
}

const customLegend = (props: any) => {
  const payload = props.payload || [];
  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexWrap: 'wrap', gap: 12 }}>
      {payload.map((entry: any, idx: number) => (
        <li key={entry.value} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ display: 'inline-block', width: 14, height: 14, borderRadius: 3, background: entry.color, marginRight: 4 }}></span>
          <span style={{ fontWeight: 500 }}>{entry.value}</span>
        </li>
      ))}
    </ul>
  );
};

const DashboardCharts: React.FC<{
  dashboardStats: DashboardStats;
  leaveBalances: { [key: string]: LeaveBalance };
  classList: ITeacherUIClassData[];
  studentLeaveRequests: ITeacherUIStudentLeaveRequest[];
  assignmentsDue: number;
  notifications: Notification[];
  theme?: 'light' | 'dark';
}> = ({ dashboardStats, leaveBalances, classList, studentLeaveRequests, assignmentsDue, notifications, theme = 'light' }) => {

  console.log('dashboardStats:', dashboardStats);
  console.log('leaveBalances:', leaveBalances);
  console.log('classList:', classList);
  console.log('studentLeaveRequests:', studentLeaveRequests);
  console.log('assignmentsDue:', assignmentsDue);
  console.log('notifications:', notifications);

  const palette = theme === 'dark' ? DARK_COLORS : COLORS;

  // Attendance Gauge (custom PieChart)
  const attendanceRate = Math.max(0, Math.min(100, dashboardStats.attendanceRate));
  const attendanceGaugeData = [
    { name: 'Present', value: attendanceRate },
    { name: 'Absent', value: 100 - attendanceRate }
  ];

  // Leave Balances Bar
  const leaveBalanceData = Object.entries(leaveBalances).map(([type, bal]) => ({
    type,
    remaining: bal.remaining,
    used: bal.used
  }));

  // Class Distribution Pie
  const classData = classList.map(cls => ({ name: cls.name, value: cls.totalStudents }));

  // Student Leave Requests Bar
  const leaveRequestStatus = ['PENDING', 'APPROVED', 'REJECTED'];
  const leaveRequestData = leaveRequestStatus.map((status, idx) => ({
    status,
    count: studentLeaveRequests.filter(r => r.status === status).length,
    color: palette[idx % palette.length]
  }));

  // Assignments Due Bar
  const assignmentsData = [
    { name: 'Assignments Due', value: assignmentsDue },
    { name: 'Completed', value: dashboardStats.assignmentsDue - assignmentsDue }
  ];

  // Notifications Bar
  const notificationTypes = ['info', 'warning', 'success', 'error'];
  const notificationData = notificationTypes.map((type, idx) => ({
    type,
    count: notifications.filter(n => n.type === type).length,
    color: palette[idx % palette.length]
  }));

  // Chart click handlers (for drill-down)
  const handleBarClick = (data: any) => {
    alert(`Drill-down: ${data && data.activeLabel ? data.activeLabel : JSON.stringify(data)}`);
  };
  const handlePieClick = (data: any) => {
    alert(`Drill-down: ${data && data.name ? data.name : JSON.stringify(data)}`);
  };

  // Responsive layout
  const chartCol = 'col-12 col-md-6 col-lg-4 mb-4';
  const barCol = 'col-12 col-md-6 mb-4';

  return (
    <div className="row g-4 mb-4">
      {/* Attendance Gauge */}
      <div className={chartCol}>
        <div className="card h-100 shadow rounded-4">
          <div className="card-header d-flex justify-content-between align-items-center bg-transparent border-0">
            <span>Attendance Rate</span>
          </div>
          <div className="card-body d-flex flex-column align-items-center justify-content-center">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={attendanceGaugeData}
                  dataKey="value"
                  startAngle={180}
                  endAngle={0}
                  innerRadius={60}
                  outerRadius={80}
                  cx="50%"
                  cy="100%"
                  label={false}
                  isAnimationActive
                  onClick={handlePieClick}
                >
                  {attendanceGaugeData.map((entry, idx) => (
                    <Cell key={`cell-gauge-${idx}`} fill={palette[idx % palette.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend content={customLegend} />
                <Label
                  value={`${attendanceRate}%`}
                  position="centerBottom"
                  className="attendance-gauge-label"
                  style={{ fontSize: 32, fontWeight: 700, fill: palette[0], textAnchor: 'middle' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ position: 'absolute', top: '60%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: 32, fontWeight: 700, color: palette[0] }}>{attendanceRate}%</div>
          </div>
        </div>
      </div>
      {/* Leave Balances Bar */}
      <div className={chartCol}>
        <div className="card h-100 shadow rounded-4">
          <div className="card-header d-flex justify-content-between align-items-center bg-transparent border-0">
            <span>Leave Balances</span>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={leaveBalanceData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }} onClick={handleBarClick}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip />
                <Legend content={customLegend} />
                <Bar dataKey="remaining" fill={palette[0]} name="Remaining" radius={[8, 8, 0, 0]} isAnimationActive />
                <Bar dataKey="used" fill={palette[1]} name="Used" radius={[8, 8, 0, 0]} isAnimationActive />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      {/* Class Distribution Pie */}
      <div className={chartCol}>
        <div className="card h-100 shadow rounded-4">
          <div className="card-header d-flex justify-content-between align-items-center bg-transparent border-0">
            <span>Class Distribution</span>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart onClick={handlePieClick}>
                <Pie data={classData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label isAnimationActive>
                  {classData.map((entry, idx) => (
                    <Cell key={`cell-class-${idx}`} fill={palette[idx % palette.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend content={customLegend} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      {/* Student Leave Requests Bar */}
      <div className={barCol}>
        <div className="card h-100 shadow rounded-4">
          <div className="card-header d-flex justify-content-between align-items-center bg-transparent border-0">
            <span>Student Leave Requests</span>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={leaveRequestData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }} onClick={handleBarClick}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" />
                <YAxis />
                <Tooltip />
                <Legend content={customLegend} />
                <Bar dataKey="count" name="Requests" isAnimationActive>
                  {leaveRequestData.map((entry, idx) => (
                    <Cell key={`cell-leave-${idx}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      {/* Assignments Due Bar */}
      <div className={barCol}>
        <div className="card h-100 shadow rounded-4">
          <div className="card-header d-flex justify-content-between align-items-center bg-transparent border-0">
            <span>Assignments Due</span>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={assignmentsData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }} onClick={handleBarClick}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend content={customLegend} />
                <Bar dataKey="value" name="Assignments" isAnimationActive>
                  {assignmentsData.map((entry, idx) => (
                    <Cell key={`cell-assign-${idx}`} fill={palette[idx % palette.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      {/* Notifications Bar */}
      <div className="col-12 mb-4">
        <div className="card h-100 shadow rounded-4">
          <div className="card-header d-flex justify-content-between align-items-center bg-transparent border-0">
            <span>Notifications</span>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={notificationData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }} onClick={handleBarClick}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip />
                <Legend content={customLegend} />
                <Bar dataKey="count" name="Notifications" isAnimationActive>
                  {notificationData.map((entry, idx) => (
                    <Cell key={`cell-notif-${idx}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts; 