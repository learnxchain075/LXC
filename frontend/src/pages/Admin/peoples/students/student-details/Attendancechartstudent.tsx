// // import React, { useState, useEffect } from 'react';
// // import { Table, Modal } from 'antd';
// // import ReactApexChart from 'react-apexcharts';
// // import { toast } from 'react-toastify';
// // import mockApi from './MockApi';
// // import { ToastContainer } from 'react-toastify';

// // type AttendanceData = {
// //   series: number[];
// //   details: { key: string; date: string; status: string }[];
// // };

// // const Attendancechartstudent = () => {
// //   const [data, setData] = useState<AttendanceData | null>(null);
// //   const [isModalVisible, setIsModalVisible] = useState(false);

// //   const fetchData = (): Promise<AttendanceData> => {
// //     return new Promise((resolve, reject) => {
// //       try {
// //         resolve(mockApi.attendance as any);
// //       } catch (error) {
// //         reject(error);
// //       }
// //     });
// //   };

// //   useEffect(() => {
// //     toast.promise(fetchData(), {
// //       pending: 'Fetching attendance data...',
// //       success: 'Attendance data loaded!',
// //       error: 'Failed to load attendance data.',
// //     })
// //       .then((response) => setData(response))
// //       .catch((error) => console.error(error));
// //   }, []);

// //   const handleShowDetails = () => {
// //     setIsModalVisible(true);
// //     toast('Showing attendance details');
// //   };

// //   const handleCloseDetails = () => {
// //     setIsModalVisible(false);
// //     toast('Closed attendance details');
// //   };

// //   if (!data) return <div className="text-center dark:text-white">Loading...</div>;

// //   const chartOptions = {
// //     chart: {
// //       type: "pie" as const,
// //       events: { dataPointSelection: handleShowDetails },
// //     },
// //     labels: ['Present', 'Absent', 'Late'],
// //     colors: ['#00E396', '#FF4560', '#FEB019'],
// //     responsive: [{ breakpoint: 480, options: { chart: { width: 200 }, legend: { position: 'bottom' } } }],
// //   };

// //   const columns = [
// //     { title: 'Date', dataIndex: 'date', key: 'date' },
// //     { title: 'Status', dataIndex: 'status', key: 'status' },
// //   ];

// //   return (
// //     <div className="card flex-fill">
// //         <ToastContainer position="top-right" autoClose={3000} />
// //       <div className="card-header">
// //         <h5 className="dark:text-white">Attendance</h5>
// //       </div>
// //       <div className="card-body">
// //         <ReactApexChart options={chartOptions} series={data.series} type="pie" height={350} />
// //         <Modal
// //           title="Attendance Details"
// //           open={isModalVisible}
// //           onCancel={handleCloseDetails}
// //           footer={[
// //             <button
// //               key="close"
// //               className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
// //               onClick={handleCloseDetails}
// //             >
// //               Close
// //             </button>,
// //           ]}
// //         >
// //           <Table
// //             columns={columns}
// //             dataSource={data.details}
// //             pagination={false}
// //             rowKey="key"
// //             className="dark:bg-gray-800 dark:text-white"
// //           />
// //         </Modal>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Attendancechartstudent;


// import React, { useState, useEffect } from 'react';
// import { Table, Modal } from 'antd';
// import ReactApexChart from 'react-apexcharts';
// import { toast, ToastContainer } from 'react-toastify';
// import mockApi from './MockApi';

// type AttendanceData = {
//   series: number[];
//   details: { key: string; date: string; status: string }[];
// };

// const Attendancechartstudent = () => {
//   const [data, setData] = useState<AttendanceData | null>(null);
//   const [isModalVisible, setIsModalVisible] = useState(false);

//   const fetchData = (): Promise<AttendanceData> => {
//     return new Promise((resolve, reject) => {
//       try {
//         resolve(mockApi.attendance as AttendanceData);
//       } catch (error) {
//         reject(error);
//       }
//     });
//   };

//   useEffect(() => {
//     toast.promise(fetchData(), {
//       pending: 'Fetching attendance data...',
//       success: 'Attendance data loaded!',
//       error: 'Failed to load attendance data.',
//     })
//       .then((response) => setData(response))
//       .catch((error) => console.error(error));
//   }, []);

//   const handleShowDetails = () => {
//     setIsModalVisible(true);
//     toast('Showing attendance details');
//   };

//   const handleCloseDetails = () => {
//     setIsModalVisible(false);
//     toast('Closed attendance details');
//   };

//   const calculateAttendancePercentage = () => {
//     const present = data?.details.filter((entry) => entry.status === 'Present').length || 0;
//     const total = data?.details.length || 0;
//     return total === 0 ? 0 : ((present / total) * 100).toFixed(2);
//   };

//   if (!data) return <div className="text-center dark:text-white">Loading...</div>;

//   const chartOptions = {
//     chart: {
//       type: "pie" as const,
//       events: { dataPointSelection: handleShowDetails },
//     },
//     labels: ['Present', 'Absent', 'Late'],
//     colors: ['#00E396', '#FF4560', '#FEB019'],
//     responsive: [{ breakpoint: 480, options: { chart: { width: 200 }, legend: { position: 'bottom' } } }],
//   };

//   const columns = [
//     { title: 'Date', dataIndex: 'date', key: 'date' },
//     { title: 'Status', dataIndex: 'status', key: 'status' },
//   ];

//   return (
//     <div className="card flex-fill">
//       <ToastContainer position="top-right" autoClose={3000} />
//       <div className="card-header">
//         <h5 className="dark:text-white">Attendance</h5>
//       </div>
//       <div className="card-body">
//         <div className="mb-4 text-lg font-semibold dark:text-white">
//           Overall Attendance: {calculateAttendancePercentage()}%
//         </div>
//         <ReactApexChart options={chartOptions} series={data.series} type="pie" height={350} />
//         <Modal
//           title="Attendance Details"
//           open={isModalVisible}
//           onCancel={handleCloseDetails}
//           footer={[
//             <button
//               key="close"
//               className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
//               onClick={handleCloseDetails}
//             >
//               Close
//             </button>,
//           ]}
//         >
//           <Table
//             columns={columns}
//             dataSource={data.details}
//             pagination={false}
//             rowKey="key"
//             className="dark:bg-gray-800 dark:text-white"
//           />
//         </Modal>
//       </div>
//     </div>
//   );
// };

// export default Attendancechartstudent;
import React, { useState, useEffect } from 'react';
import { Table, Modal, Button } from 'antd';
import ReactApexChart from 'react-apexcharts';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getAttendanceLeavesByStudentId, IAttendance } from '../../../../../services/student/StudentAllApi';

type AttendanceData = {
  series: number[];
  details: { key: string; date: string; status: string; lesson: string; subject: string }[];
};

const Attendancechartstudent = () => {
  const [data, setData] = useState<AttendanceData | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const studentId = localStorage.getItem("studentId"); 
    toast.promise(
      getAttendanceLeavesByStudentId(studentId as string)
        .then((response) => {
          if (response.data.success) {
            const details = response.data.attendance.map((entry: IAttendance) => ({
              key: entry.id,
              date: new Date(entry.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              }),
              status: entry.present ? 'Present' : 'Absent', 
              lesson: entry.lesson.name,
              subject: entry.lesson.subject.name,
            }));
            const present = details.filter((d) => d.status === 'Present').length;
            const absent = details.filter((d) => d.status === 'Absent').length;
            const late = 0; 
            const series = [present, absent, late];
            return { series, details };
          }
          throw new Error('API response unsuccessful');
        }),
      {
       // pending: 'Fetching attendance data...',
        success: 'Attendance data loaded!',
        error: 'Failed to load attendance data.',
      }
    )
      .then((transformedData) => setData(transformedData))
      .catch((error) => console.error('Error fetching attendance:', error));
  }, []);

  const handleShowDetails = () => {
    setIsModalVisible(true);
    toast.success('Showing attendance details');
  };

  const handleCloseDetails = () => {
    setIsModalVisible(false);
   // toast.info('Closed attendance details');
  };

  const calculateAttendancePercentage = () => {
    const present = data?.details.filter((entry) => entry.status === 'Present').length || 0;
    const total = data?.details.length || 0;
    return total === 0 ? '0.00' : ((present / total) * 100).toFixed(2);
  };

  if (!data) return <div className="text-center text-gray-500 dark:text-gray-300 py-8">Loading...</div>;

  const chartOptions = {
    chart: {
      type: 'pie' as const,
      toolbar: { show: false },
      events: { dataPointSelection: handleShowDetails },
    },
    labels: ['Present', 'Absent', 'Late'],
    colors: ['#00E396', '#FF4560', '#FEB019'],
    legend: {
      position: 'bottom' as const,
      fontSize: '14px',
      labels: { colors: ['#1F2937', '#F3F4F6'] }, 
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${val.toFixed(1)}%`,
      style: { colors: ['#1F2937', '#F3F4F6'] },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: { width: 200 },
          legend: { position: 'bottom' as const },
        },
      },
    ],
  };

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      sorter: (a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    },
    { title: 'Status', dataIndex: 'status', key: 'status' },
    { title: 'Lesson', dataIndex: 'lesson', key: 'lesson' },
    { title: 'Subject', dataIndex: 'subject', key: 'subject' },
  ];

  return (
    <div className="card flex-fill p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md">
      <ToastContainer position="top-center" autoClose={3000} theme="colored" />
      <div className="card-header mb-6">
        <h5 className="text-2xl font-semibold text-gray-800 dark:text-white">Attendance</h5>
      </div>
      <div className="card-body">
        <div className="flex flex-col items-center md:items-start md:flex-row md:justify-between mb-6">
          <div className="text-lg font-semibold text-gray-700 dark:text-gray-200">
            Overall Attendance: <span className="text-blue-500 dark:text-blue-400">{calculateAttendancePercentage()}%</span>
          </div>
          <Button
            type="primary"
            onClick={handleShowDetails}
            className="mt-4 md:mt-0 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            View Details
          </Button>
        </div>
        <div className="flex justify-center">
          <ReactApexChart options={chartOptions} series={data.series} type="pie" height={350} width="100%" />
        </div>
        <Modal
          title="Attendance Details"
          open={isModalVisible}
          onCancel={handleCloseDetails}
          footer={[
            <Button
              key="close"
              onClick={handleCloseDetails}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
            >
              Close
            </Button>,
          ]}
          width={800}
          className="dark:bg-gray-800"
        >
          <Table
            columns={columns}
            dataSource={data.details}
            pagination={{ pageSize: 5 }}
            rowKey="key"
            className="dark:bg-gray-800 dark:text-white"
            scroll={{ x: 'max-content' }}
          />
        </Modal>
      </div>
    </div>
  );
};

export default Attendancechartstudent;