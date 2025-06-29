// // // // // import React, { useState, useEffect } from 'react';
// // // // // import { Table } from 'antd';

// // // // // import mockApi from './MockApi';
// // // // // import { toast } from 'react-toastify';
// // // // // import { ToastContainer } from 'react-toastify';

// // // // // type AcademicResourceCategory = 'Assignment' | 'PYQ' | 'Homework';

// // // // // type AcademicResourceItem = {
// // // // //   id: number | string;
// // // // //   title: string;
// // // // //   dueDate?: string;
// // // // //   link?: string;
// // // // //   key?: string | number;
// // // // // };

// // // // // type AcademicResourcesData = {
// // // // //   [key in AcademicResourceCategory]: AcademicResourceItem[];
// // // // // };

// // // // // const AcademicResources = () => {
// // // // //   const [data, setData] = useState<AcademicResourcesData | null>(null);
// // // // //   const [openCategory, setOpenCategory] = useState<AcademicResourceCategory | null>(null);

// // // // //   const fetchData = (): Promise<AcademicResourcesData> => {
// // // // //     return new Promise((resolve, reject) => {
// // // // //       try {
// // // // //         resolve(mockApi.academicResources);
// // // // //       } catch (error) {
// // // // //         reject(error);
// // // // //       }
// // // // //     });
// // // // //   };

// // // // //   useEffect(() => {
// // // // //     toast.promise(fetchData(), {
// // // // //       pending: 'Fetching academic resources...',
// // // // //       success: 'Academic resources loaded!',
// // // // //       error: 'Failed to load academic resources.',
// // // // //     })
// // // // //       .then((response) => setData(response))
// // // // //       .catch((error) => console.error(error));
// // // // //   }, []);

// // // // //   const toggleCategory = (category :any) => {
// // // // //     const newCategory = openCategory === category ? null : category;
// // // // //     setOpenCategory(newCategory);
// // // // //     if (newCategory) {
// // // // //       toast.success(`Showing ${category} data`);
// // // // //     } else {
// // // // //       toast('Closed category view');
// // // // //     }
// // // // //   };

// // // // //   if (!data) return <div className="text-center dark:text-white">Loading...</div>;

// // // // //   interface ColumnType {
// // // // //     title: string;
// // // // //     dataIndex: string;
// // // // //     key: string;
// // // // //     render?: (value: any, record?: AcademicResourceItem, index?: number) => React.ReactNode;
// // // // //   }

// // // // //   const columns: ColumnType[] = openCategory === 'PYQ' ? [
// // // // //     { title: 'ID', dataIndex: 'id', key: 'id' },
// // // // //     { title: 'Title', dataIndex: 'title', key: 'title' },
// // // // //     {
// // // // //       title: 'Link',
// // // // //       dataIndex: 'link',
// // // // //       key: 'link',
// // // // //       render: (link: string) => (
// // // // //         <a href={link} className="text-blue-500 hover:underline dark:text-blue-400">Download</a>
// // // // //       ),
// // // // //     },
// // // // //   ] : [
// // // // //     { title: 'ID', dataIndex: 'id', key: 'id' },
// // // // //     { title: 'Title', dataIndex: 'title', key: 'title' },
// // // // //     { title: 'Due Date', dataIndex: 'dueDate', key: 'dueDate' },
// // // // //   ];

// // // // //   return (
// // // // //     <div className="card flex-fill">
// // // // //           <ToastContainer position="top-right" autoClose={3000} />
// // // // //       <div className="card-header">
// // // // //         <h5 className="dark:text-white">Academic Resources</h5>
// // // // //       </div>
// // // // //       <div className="card-body">
// // // // //         <div className="flex flex-wrap gap-2 mb-4">
// // // // //           {['Assignment', 'PYQ', 'Homework'].map((category) => (
// // // // //             <button
// // // // //               key={category}
// // // // //               className={`px-4 py-2 rounded ${
// // // // //                 openCategory === category
// // // // //                   ? 'bg-blue-500 text-white'
// // // // //                   : 'bg-gray-200 dark:bg-gray-700 dark:text-white'
// // // // //               } hover:bg-blue-600 hover:text-white`}
// // // // //               onClick={() => toggleCategory(category)}
// // // // //             >
// // // // //               {category}
// // // // //             </button>
// // // // //           ))}
// // // // //         </div>
// // // // //         {openCategory && (
// // // // //           <Table
// // // // //             columns={columns}
// // // // //             dataSource={data[openCategory]}
// // // // //             pagination={false}
// // // // //             rowKey="key"
// // // // //             className="dark:bg-gray-800 dark:text-white"
// // // // //           />
// // // // //         )}
// // // // //       </div>
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // export default AcademicResources;


// // // // import React, { useState, useEffect } from 'react';
// // // // import { Table } from 'antd';
// // // // import { toast, ToastContainer } from 'react-toastify';
// // // // import 'react-toastify/dist/ReactToastify.css';
// // // // import { getResourcesByStudentId, IAssignment, IHomework } from '../../../../../services/student/StudentAllApi';


// // // // type AcademicResourceCategory = 'Assignment' | 'PYQ' | 'Homework';


// // // // type AcademicResourceItem = {
// // // //   key: string;
// // // //   id: string;
// // // //   title: string;
// // // //   description: string;
// // // //   dueDate?: string;
// // // //   attachment?: string | null;
// // // //   status?: string;
// // // //   subject?: string;
// // // // };

// // // // type AcademicResourcesData = {
// // // //   Assignment: AcademicResourceItem[];
// // // //   Homework: AcademicResourceItem[];
// // // //   PYQ: AcademicResourceItem[];
// // // // };

// // // // const AcademicResources = () => {
// // // //   const [data, setData] = useState<AcademicResourcesData | null>(null);
// // // //   const [openCategory, setOpenCategory] = useState<AcademicResourceCategory | null>(null);

// // // //   useEffect(() => {
// // // //     const studentId = localStorage.getItem("studentId");
// // // //     toast.promise(
// // // //       getResourcesByStudentId(studentId as string)
// // // //         .then((response) => {
// // // //           if (response.data.success) {
        
// // // //             const assignments: AcademicResourceItem[] = response.data.assignments.map((item: IAssignment) => ({
// // // //               key: item.id,
// // // //               id: item.id,
// // // //               title: item.title,
// // // //               description: item.description,
// // // //               dueDate: item.dueDate,
// // // //               attachment: item.attachment,
// // // //               status: item.status,
// // // //               subject: item.subject.name,
// // // //             }));
// // // //             const homeworks: AcademicResourceItem[] = response.data.homeworks.map((item: IHomework) => ({
// // // //               key: item.id,
// // // //               id: item.id,
// // // //               title: item.title,
// // // //               description: item.description,
// // // //               dueDate: item.dueDate,
// // // //               attachment: item.attachment,
// // // //               status: item.status,
// // // //               subject: item.subject.name,
// // // //             }));
// // // //             const pyqs: AcademicResourceItem[] = response.data.pyqs.map((item: IPyq) => ({
// // // //               key: item.id,
// // // //               id: item.id,
// // // //               title: item.subject + ' - ' + item.topic, 
// // // //               description: 'Previous Year Question',
// // // //               dueDate: undefined,
// // // //               attachment: item.question, 
// // // //               status: undefined,
// // // //               subject: item.subject,
// // // //             }));
// // // //             return { Assignment: assignments, Homework: homeworks, PYQ: pyqs };
// // // //           }
// // // //           throw new Error('try again');
// // // //         }),
// // // //       {
// // // //         pending: 'Fetching academic resources...',
// // // //         success: 'Academic resources loaded!',
// // // //         error: 'Failed to load academic resources.',
// // // //       }
// // // //     )
// // // //       .then((transformedData) => setData(transformedData))
// // // //       .catch((error) => console.error('Error fetching resources:', error));
// // // //   }, []);

// // // //   const toggleCategory = (category: AcademicResourceCategory) => {
// // // //     const newCategory = openCategory === category ? null : category;
// // // //     setOpenCategory(newCategory);
// // // //     if (newCategory) {
// // // //       toast.success(`Showing ${category} data`);
// // // //     } else {
// // // //       toast.info('Closed category view');
// // // //     }
// // // //   };

// // // //   if (!data) return <div className="text-center dark:text-white">Loading...</div>;


// // // //   const columns = [
// // // //  //   { title: 'ID', dataIndex: 'id', key: 'id' },
// // // //     { title: 'Title', dataIndex: 'title', key: 'title' },
// // // //     { title: 'Description', dataIndex: 'description', key: 'description' },
// // // //     { title: 'Subject', dataIndex: 'subject', key: 'subject' },
// // // //     ...(openCategory === 'PYQ'
// // // //       ? [
// // // //           {
// // // //             title: 'Question',
// // // //             dataIndex: 'attachment',
// // // //             key: 'attachment',
// // // //             render: (link: string | null) =>
// // // //               link ? (
// // // //                 <a href={link} className="text-blue-500 hover:underline dark:text-blue-400" target="_blank" rel="noopener noreferrer">
// // // //                   Download Question
// // // //                 </a>
// // // //               ) : (
// // // //                 'N/A'
// // // //               ),
// // // //           },
// // // //         ]
// // // //       : [
// // // //           { title: 'Due Date', dataIndex: 'dueDate', key: 'dueDate' },
// // // //           { title: 'Status', dataIndex: 'status', key: 'status' },
// // // //           {
// // // //             title: 'Attachment',
// // // //             dataIndex: 'attachment',
// // // //             key: 'attachment',
// // // //             render: (link: string | null) =>
// // // //               link ? (
// // // //                 <a href={link} className="text-blue-500 hover:underline dark:text-blue-400" target="_blank" rel="noopener noreferrer">
// // // //                   Download
// // // //                 </a>
// // // //               ) : (
// // // //                 'N/A'
// // // //               ),
// // // //           },
// // // //         ]),
// // // //   ];

// // // //   return (
// // // //     <div className="card flex-fill p-4 dark:bg-gray-900">
// // // //       <ToastContainer position="top-right" autoClose={3000} theme="colored" />
// // // //       <div className="card-header mb-4">
// // // //         <h5 className="dark:text-white text-xl font-semibold">Academic Resources</h5>
// // // //       </div>
// // // //       <div className="card-body">
// // // //         <div className="flex flex-wrap gap-2 mb-4">
// // // //           {(['Assignment', 'PYQ', 'Homework'] as AcademicResourceCategory[]).map((category) => (
// // // //             <button
// // // //               key={category}
// // // //               className={`px-4 py-2 rounded transition-colors ${
// // // //                 openCategory === category
// // // //                   ? 'bg-blue-500 text-white'
// // // //                   : 'bg-gray-200 dark:bg-gray-700 dark:text-white hover:bg-blue-600 hover:text-white'
// // // //               }`}
// // // //               onClick={() => toggleCategory(category)}
// // // //             >
// // // //               {category}
// // // //             </button>
// // // //           ))}
// // // //         </div>
// // // //         {openCategory ? (
// // // //           <Table
// // // //             columns={columns}
// // // //             dataSource={data[openCategory]}
// // // //             pagination={{ pageSize: 5 }}
// // // //             rowKey="key"
// // // //             className="dark:bg-gray-800 dark:text-white"
// // // //             scroll={{ x: 'max-content' }}
// // // //           />
// // // //         ) : (
// // // //           <div className="text-center dark:text-white text-gray-500">
// // // //             Select a category to view resources
// // // //           </div>
// // // //         )}
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // };

// // // // export default AcademicResources;


// // // import React, { useState, useEffect } from 'react';
// // // import { Table, Modal, Button, Upload, UploadFile } from 'antd';
// // // import { UploadOutlined } from '@ant-design/icons';
// // // import { toast, ToastContainer } from 'react-toastify';
// // // import 'react-toastify/dist/ReactToastify.css';
// // // import { AxiosResponse } from 'axios';
// // // import {
// // //   getResourcesByStudentId,
// // //   IAssignment,
// // //   IHomework,
// // //   submitHomework,
// // //   ISubmitHomeworkRequest,
// // //   ISubmitHomeworkResponse,
// // //   submitAssignment,
// // //   ISubmitAssignmentRequest,
// // //   ISubmitAssignmentResponse,
// // // } from '../../../../../services/student/StudentAllApi';
// // // import { closeModal } from '../../../../Common/modalclose';

// // // type AcademicResourceCategory = 'Assignment' | 'PYQ' | 'Homework';

// // // type AcademicResourceItem = {
// // //   key: string;
// // //   id: string;
// // //   title: string;
// // //   description: string;
// // //   dueDate?: string;
// // //   attachment?: string | null;
// // //   status?: string;
// // //   subject?: string;
// // // };

// // // type AcademicResourcesData = {
// // //   Assignment: AcademicResourceItem[];
// // //   Homework: AcademicResourceItem[];
// // //   PYQ: AcademicResourceItem[];
// // // };

// // // const AcademicResources: React.FC = () => {
// // //   const [data, setData] = useState<AcademicResourcesData | null>(null);
// // //   const [openCategory, setOpenCategory] = useState<AcademicResourceCategory | null>(null);
// // //   const [isModalOpen, setIsModalOpen] = useState(false);
// // //   const [selectedItem, setSelectedItem] = useState<AcademicResourceItem | null>(null);
// // //   const [selectedCategory, setSelectedCategory] = useState<AcademicResourceCategory | null>(null);
// // //   const [fileList, setFileList] = useState<UploadFile[]>([]);
// // //   const [uploading, setUploading] = useState(false);

// // //   useEffect(() => {
// // //     const studentId = localStorage.getItem('studentId');
// // //     if (!studentId) {
// // //       toast.error('Student ID not found. Please log in.');
// // //       return;
// // //     }

// // //     const fetchResources = async () => {
// // //       try {
// // //         const response = await getResourcesByStudentId(studentId);
// // //         if (response.data.success) {
// // //           const assignments: AcademicResourceItem[] = response.data.assignments.map((item: IAssignment) => ({
// // //             key: item.id,
// // //             id: item.id,
// // //             title: item.title,
// // //             description: item.description,
// // //             dueDate: item.dueDate,
// // //             attachment: item.attachment,
// // //             status: item.status,
// // //             subject: item.subject.name,
// // //           }));
// // //           const homeworks: AcademicResourceItem[] = response.data.homeworks.map((item: IHomework) => ({
// // //             key: item.id,
// // //             id: item.id,
// // //             title: item.title,
// // //             description: item.description,
// // //             dueDate: item.dueDate,
// // //             attachment: item.attachment,
// // //             status: item.status,
// // //             subject: item.subject.name,
// // //           }));
// // //           const pyqs: AcademicResourceItem[] = response.data.pyqs.map((item: any) => ({
// // //             key: item.id,
// // //             id: item.id,
// // //             title: `${item.subject} - ${item.topic}`,
// // //             description: 'Previous Year Question',
// // //             dueDate: undefined,
// // //             attachment: item.question,
// // //             status: undefined,
// // //             subject: item.subject,
// // //           }));
// // //           setData({ Assignment: assignments, Homework: homeworks, PYQ: pyqs });
// // //         } else {
// // //           throw new Error(response.data.message || 'Failed to fetch resources');
// // //         }
// // //       } catch (error) {
// // //         console.error('Error fetching resources:', error);
// // //         toast.error('Failed to load academic resources.');
// // //       }
// // //     };

// // //     // toast.promise(fetchResources(), {
// // //     //   pending: 'Fetching academic resources...',
// // //     //   success: 'Academic resources loaded!',
// // //     //   error: 'Failed to load academic resources.',
// // //     // });
// // //   }, []);

// // //   const toggleCategory = (category: AcademicResourceCategory) => {
// // //     const newCategory = openCategory === category ? null : category;
// // //     setOpenCategory(newCategory);
// // //     if (newCategory) {
// // //       toast.success(`Showing ${category} data`);
// // //     } else {
// // //       toast.info('Closed category view');
// // //     }
// // //   };

// // //   const showUploadModal = (item: AcademicResourceItem, category: AcademicResourceCategory) => {
// // //     setSelectedItem(item);
// // //     setSelectedCategory(category);
// // //     setIsModalOpen(true);
// // //     setFileList([]);
// // //   };

// // //   const handleModalCancel = () => {
// // //     setIsModalOpen(false);
// // //     setSelectedItem(null);
// // //     setSelectedCategory(null);
// // //     setFileList([]);
// // //   };

// // //   const handleUpload = async () => {
// // //     if (!fileList.length || !selectedItem || !selectedCategory) {
// // //       toast.error('Please select a file to upload.');
// // //       return;
// // //     }
// // //     const studentId = localStorage.getItem('studentId');
// // //     if (!studentId) {
// // //       toast.error('Student ID not found. Please log in.');
// // //       return;
// // //     }

// // //     setUploading(true);
// // //     try {
// // //       const file = fileList[0].originFileObj as File;
// // //       const formData = new FormData();
// // //       formData.append('studentId', studentId);
// // //       if (selectedCategory === 'Homework') {
// // //         formData.append('homeworkId', selectedItem.id);
// // //       } else {
// // //         formData.append('assignmentId', selectedItem.id);
// // //       }
// // //       formData.append('file', file);

// // //       let response: AxiosResponse<ISubmitHomeworkResponse | ISubmitAssignmentResponse>;
// // //       if (selectedCategory === 'Homework') {
// // //         response = await submitHomework(formData);
// // //       } else {
// // //         response = await submitAssignment(formData);
// // //       }
// // // console.log("object",response);
// // //       if (response.data.success) {
// // //         toast.success(response.data.message);
// // //         setData((prev) => {
// // //           if (!prev) return prev;
// // //           const updatedCategory = prev[selectedCategory].map((item) =>
// // //             item.id === selectedItem.id ? { ...item, status: 'Submitted' } : item
// // //           );
// // //           return { ...prev, [selectedCategory]: updatedCategory };
// // //         });
// // //         closeModal("")  ///to off modal write modal nsame 
// // //       } else {
// // //         toast.error(response.data.message);
// // //       }
// // //     } catch (error) {
// // //       toast.error('Failed to submit. Please try again.');
// // //       console.error('Upload error:', error);
// // //     } finally {
// // //       setUploading(false);
// // //     }
// // //   };

// // //   const uploadProps = {
// // //     onRemove: (file: UploadFile) => {
// // //       setFileList((prev) => prev.filter((item) => item.uid !== file.uid));
// // //     },
// // //     beforeUpload: (file: File) => {
// // //       const isValidType = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'application/pdf';
// // //       if (!isValidType) {
// // //         toast.error('You can only upload JPG, PNG, or PDF files!');
// // //         return false;
// // //       }
// // //       setFileList([{
// // //         uid: '-0',
// // //         name: file.name,
// // //         status: 'done',
       
// // //       }]);
// // //       return false; // Prevent auto-upload
// // //     },
// // //     fileList,
// // //   };

// // //   if (!data) return <div className="text-center dark:text-white">Loading...</div>;

// // //   const columns = [
// // //     { title: 'Title', dataIndex: 'title', key: 'title' },
// // //     { title: 'Description', dataIndex: 'description', key: 'description' },
// // //     { title: 'Subject', dataIndex: 'subject', key: 'subject' },
// // //     ...(openCategory === 'PYQ'
// // //       ? [
// // //           {
// // //             title: 'Question',
// // //             dataIndex: 'attachment',
// // //             key: 'attachment',
// // //             render: (link: string | null) =>
// // //               link ? (
// // //                 <a href={link} className="text-blue-500 hover:underline dark:text-blue-400" target="_blank" rel="noopener noreferrer">
// // //                   Download Question
// // //                 </a>
// // //               ) : (
// // //                 'N/A'
// // //               ),
// // //           },
// // //         ]
// // //       : [
// // //           { title: 'Due Date', dataIndex: 'dueDate', key: 'dueDate' },
// // //           { title: 'Status', dataIndex: 'status', key: 'status' },
// // //           {
// // //             title: 'Attachment',
// // //             dataIndex: 'attachment',
// // //             key: 'attachment',
// // //             render: (link: string | null) =>
// // //               link ? (
// // //                 <a href={link} className="text-blue-500 hover:underline dark:text-blue-400" target="_blank" rel="noopener noreferrer">
// // //                   Download
// // //                 </a>
// // //               ) : (
// // //                 'N/A'
// // //               ),
// // //           },
// // //           {
// // //             title: 'Action',
// // //             key: 'action',
// // //             render: (_: any, record: AcademicResourceItem) =>
// // //               record.status !== 'Submitted' ? (
// // //                 <Button
// // //                   type="primary"
// // //                   icon={<UploadOutlined />}
// // //                   onClick={() => showUploadModal(record, openCategory!)}
// // //                   className="bg-blue-500 hover:bg-blue-600 text-white"
// // //                 >
// // //                   Upload
// // //                 </Button>
// // //               ) : (
// // //                 <span className="text-green-500 font-medium">Submitted</span>
// // //               ),
// // //           },
// // //         ]),
// // //   ];

// // //   return (
// // //     <div className="card flex-fill p-4 dark:bg-gray-900">
// // //       <ToastContainer position="top-right" autoClose={3000} theme="colored" />
// // //       <div className="card-header mb-4">
// // //         <h5 className="dark:text-white text-xl font-semibold">Academic Resources</h5>
// // //       </div>
// // //       <div className="card-body">
// // //         <div className="flex flex-wrap gap-2 mb-4">
// // //           {(['Assignment', 'PYQ', 'Homework'] as AcademicResourceCategory[]).map((category) => (
// // //             <button
// // //               key={category}
// // //               className={`px-4 py-2 rounded transition-colors ${
// // //                 openCategory === category
// // //                   ? 'bg-blue-500 text-white'
// // //                   : 'bg-gray-200 dark:bg-gray-700 dark:text-white hover:bg-blue-600 hover:text-white'
// // //               }`}
// // //               onClick={() => toggleCategory(category)}
// // //             >
// // //               {category}
// // //             </button>
// // //           ))}
// // //         </div>
// // //         {openCategory ? (
// // //           <Table
// // //             columns={columns}
// // //             dataSource={data[openCategory]}
// // //             pagination={{ pageSize: 5 }}
// // //             rowKey="key"
// // //             className="dark:bg-gray-800 dark:text-white"
// // //             scroll={{ x: 'max-content' }}
// // //           />
// // //         ) : (
// // //           <div className="text-center dark:text-white text-gray-500">
// // //             Select a category to view resources
// // //           </div>
// // //         )}
// // //       </div>
// // //       <Modal
// // //         title={`Upload ${selectedCategory} - ${selectedItem?.title}`}
// // //         open={isModalOpen}
// // //         onOk={handleUpload}
// // //         onCancel={handleModalCancel}
// // //         okText={uploading ? 'Uploading...' : 'Submit'}
// // //         okButtonProps={{ disabled: uploading || !fileList.length, className: 'bg-blue-500 hover:bg-blue-600 text-white' }}
// // //         cancelButtonProps={{ className: 'border-gray-300 hover:border-gray-400 text-gray-700 dark:text-gray-300' }}
// // //         className="dark:bg-gray-800"
// // //         styles={{
// // //           header: { background: 'bg-gray-100 dark:bg-gray-700', color: 'text-black dark:text-white' },
// // //           body: { background: 'bg-white dark:bg-gray-800', color: 'text-black dark:text-white', padding: '24px' },
// // //           footer: { background: 'bg-gray-100 dark:bg-gray-700', padding: '16px' },
// // //         }}
// // //       >
// // //         <div className="mb-4">
// // //           <p className="text-gray-600 dark:text-gray-300 mb-2">Please upload your {selectedCategory?.toLowerCase()} file (JPG, PNG, or PDF):</p>
// // //           <Upload {...uploadProps} className="w-full">
// // //             <Button icon={<UploadOutlined />} className="w-full text-left border-gray-300 hover:border-blue-500">
// // //               Select File
// // //             </Button>
// // //           </Upload>
// // //         </div>
// // //       </Modal>
// // //     </div>
// // //   );
// // // };

// // // export default AcademicResources;

// // import React, { useState, useEffect } from 'react';
// // import { Table, Modal, Button, Upload, UploadFile } from 'antd';
// // import { UploadOutlined } from '@ant-design/icons';
// // import { toast, ToastContainer } from 'react-toastify';
// // import 'react-toastify/dist/ReactToastify.css';
// // import { AxiosResponse } from 'axios';
// // import {
// //   getResourcesByStudentId,
// //   IAssignment,
// //   IHomework,
// //   submitHomework,
// //   ISubmitHomeworkResponse,
// //   submitAssignment,
// //   ISubmitAssignmentResponse,
// // } from '../../../../../services/student/StudentAllApi';
// // import { closeModal } from '../../../../Common/modalclose';

// // type AcademicResourceCategory = 'Assignment' | 'PYQ' | 'Homework';

// // type AcademicResourceItem = {
// //   key: string;
// //   id: string;
// //   title: string;
// //   description: string;
// //   dueDate?: string;
// //   submissionDate?: string | null;
// //   attachment?: string | null;
// //   status?: string;
// //   subject?: string;
// // };

// // type AcademicResourcesData = {
// //   Assignment: AcademicResourceItem[];
// //   Homework: AcademicResourceItem[];
// //   PYQ: AcademicResourceItem[];
// // };

// // const formatDate = (dateString?: string): string => {
// //   if (!dateString) return 'N/A';
// //   const date = new Date(dateString);
// //   if (isNaN(date.getTime())) return 'N/A';
// //   const options: Intl.DateTimeFormatOptions = {
// //     day: 'numeric',
// //     month: 'long',
// //     year: 'numeric',
// //   };
// //   return date.toLocaleDateString('en-GB', options);
// // };

// // const AcademicResources: React.FC = () => {
// //   const [data, setData] = useState<AcademicResourcesData | null>(null);
// //   const [openCategory, setOpenCategory] = useState<AcademicResourceCategory | null>(null);
// //   const [isModalOpen, setIsModalOpen] = useState(false);
// //   const [selectedItem, setSelectedItem] = useState<AcademicResourceItem | null>(null);
// //   const [selectedCategory, setSelectedCategory] = useState<AcademicResourceCategory | null>(null);
// //   const [fileList, setFileList] = useState<UploadFile[]>([]);
// //   const [uploading, setUploading] = useState(false);

// //   useEffect(() => {
// //     const studentId = localStorage.getItem('studentId');
// //     if (!studentId) {
// //       toast.error('Student ID not found. Please log in.', { autoClose: 3000 });
// //       return;
// //     }

// //     const fetchResources = async () => {
// //       try {
// //         const response = await getResourcesByStudentId(studentId);
// //         if (response.data.success) {
// //           const assignments: AcademicResourceItem[] = response.data.assignments.map((item: IAssignment) => ({
// //             key: item.id,
// //             id: item.id,
// //             title: item.title,
// //             description: item.description,
// //             dueDate: item.dueDate,
// //             submissionDate: null,
// //             attachment: item.attachment,
// //             status: item.status,
// //             subject: item.subject.name,
// //           }));
// //           const homeworks: AcademicResourceItem[] = response.data.homeworks.map((item: IHomework) => ({
// //             key: item.id,
// //             id: item.id,
// //             title: item.title,
// //             description: item.description,
// //             dueDate: item.dueDate,
// //             submissionDate: item.HomeworkSubmission?.[0]?.submittedAt || null,
// //             attachment: item.attachment,
// //             status: item.status,
// //             subject: item.subject.name,
// //           }));
// //           const pyqs: AcademicResourceItem[] = response.data.pyqs.map((item: any) => ({
// //             key: item.id,
// //             id: item.id,
// //             title: `${item.subject} - ${item.topic}`,
// //             description: 'Previous Year Question',
// //             dueDate: undefined,
// //             submissionDate: null,
// //             attachment: item.question,
// //             status: undefined,
// //             subject: item.subject,
// //           }));
// //           setData({ Assignment: assignments, Homework: homeworks, PYQ: pyqs });
// //           toast.success('Academic resources loaded!', { autoClose: 3000 });
// //         } else {
// //           throw new Error('Try Again');
// //         }
// //       } catch (error) {
// //         console.error('Error fetching resources:', error);
// //         toast.error('Failed to load academic resources.', { autoClose: 3000 });
// //       }
// //     };

// //     fetchResources();
// //   }, []);

// //   const toggleCategory = (category: AcademicResourceCategory) => {
// //     const newCategory = openCategory === category ? null : category;
// //     setOpenCategory(newCategory);
// //     if (newCategory) {
// //       toast.success(`Showing ${category} data`, { autoClose: 3000 });
// //     } else {
// //       toast.info('Closed category view', { autoClose: 3000 });
// //     }
// //   };

// //   const showUploadModal = (item: AcademicResourceItem, category: AcademicResourceCategory) => {
// //     setSelectedItem(item);
// //     setSelectedCategory(category);
// //     setIsModalOpen(true);
// //     setFileList([]);
// //   };

// //   const handleModalCancel = () => {
// //     setIsModalOpen(false);
// //     setSelectedItem(null);
// //     setSelectedCategory(null);
// //     setFileList([]);
// //   };

// //   const handleUpload = async () => {
// //     if (!fileList.length || !selectedItem || !selectedCategory) {
// //       toast.error('Please select a file to upload.', { autoClose: 3000 });
// //       return;
// //     }
// //     const studentId = localStorage.getItem('studentId');
// //     if (!studentId) {
// //       toast.error('Student ID not found. Please log in.', { autoClose: 3000 });
// //       return;
// //     }

// //     setUploading(true);
// //     try {
// //       const file = fileList[0].originFileObj;
// //       if (!file) {
// //         throw new Error('No file selected for upload');
// //       }
// //       const formData = new FormData();
// //       formData.append('studentId', studentId);
// //       if (selectedCategory === 'Homework') {
// //         formData.append('homeworkId', selectedItem.id);
// //       } else {
// //         formData.append('assignmentId', selectedItem.id);
// //       }
// //       formData.append('file', file);

// //       let response: AxiosResponse<ISubmitHomeworkResponse | ISubmitAssignmentResponse>;
// //       if (selectedCategory === 'Homework') {
// //         response = await submitHomework(formData);
// //       } else {
// //         response = await submitAssignment(formData);
// //       }

// //       if (response.status >= 200 && response.status < 300) {
// //         toast.success(response.data.message, { autoClose: 3000 });
// //         setData((prev) => {
// //           if (!prev) return prev;
// //           const updatedCategory = prev[selectedCategory].map((item) =>
// //             item.id === selectedItem.id
// //               ? { ...item, status: 'Submitted', submissionDate: new Date().toISOString() }
// //               : item
// //           );
// //           return { ...prev, [selectedCategory]: updatedCategory };
// //         });
// //         closeModal('uploadModal');
// //         handleModalCancel();
// //       } else {
// //         toast.error(response.data.message, { autoClose: 3000 });
// //       }
// //     } catch (error: any) {
// //       const errorMessage =
// //         error.response?.status === 409
// //           ? 'Item already submitted. Re-upload may not be allowed.'
// //           : error.message || 'Failed to submit. Please try again.';
// //       toast.error(errorMessage, { autoClose: 3000 });
// //       console.error('Upload error:', error);
// //     } finally {
// //       setUploading(false);
// //     }
// //   };

// //   const uploadProps = {
// //     onRemove: (file: UploadFile) => {
// //       setFileList((prev) => prev.filter((item) => item.uid !== file.uid));
// //     },
// //     beforeUpload: (file: File) => {
// //       const isValidType = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'application/pdf';
// //       if (!isValidType) {
// //         toast.error('You can only upload JPG, PNG, or PDF files!', { autoClose: 3000 });
// //         return false;
// //       }
// //       setFileList([
// //         {
// //           uid: `-${Date.now()}`,
// //           name: file.name,
// //           status: 'done',
// //           originFileObj: file,
// //         },
// //       ]);
// //       return false;
// //     },
// //     fileList,
// //   };

// //   if (!data) return <div className="text-center dark:text-white">Loading...</div>;

// //   const columns = [
// //     { title: 'Title', dataIndex: 'title', key: 'title' },
// //     { title: 'Description', dataIndex: 'description', key: 'description' },
// //     { title: 'Subject', dataIndex: 'subject', key: 'subject' },
// //     ...(openCategory === 'PYQ'
// //       ? [
// //           {
// //             title: 'Question',
// //             dataIndex: 'attachment',
// //             key: 'attachment',
// //             render: (link: string | null) =>
// //               link ? (
// //                 <a href={link} className="text-blue-500 hover:underline dark:text-blue-400" target="_blank" rel="noopener noreferrer">
// //                   Download Question
// //                 </a>
// //               ) : (
// //                 'N/A'
// //               ),
// //           },
// //         ]
// //       : [
// //           {
// //             title: 'Due Date',
// //             dataIndex: 'dueDate',
// //             key: 'dueDate',
// //             render: (dueDate: string | undefined) => formatDate(dueDate),
// //           },
// //           {
// //             title: 'Submission Date',
// //             dataIndex: 'submissionDate',
// //             key: 'submissionDate',
// //             render: (submissionDate: string | null) => formatDate(submissionDate),
// //           },
// //           {
// //             title: 'Status',
// //             dataIndex: 'status',
// //             key: 'status',
// //             render: (status: string | undefined) =>
// //               status ? (
// //                 <span
// //                   className={`font-medium ${
// //                     status.toLowerCase() === 'pending' ? 'text-red-500' : 'text-green-500'
// //                   }`}
// //                 >
// //                   {status}
// //                 </span>
// //               ) : (
// //                 'N/A'
// //               ),
// //           },
// //           {
// //             title: 'Attachment',
// //             dataIndex: 'attachment',
// //             key: 'attachment',
// //             render: (link: string | null) =>
// //               link ? (
// //                 <a href={link} className="text-blue-500 hover:underline dark:text-blue-400" target="_blank" rel="noopener noreferrer">
// //                   Download
// //                 </a>
// //               ) : (
// //                 'N/A'
// //               ),
// //           },
// //           {
// //             title: 'Action',
// //             key: 'action',
// //             render: (_: any, record: AcademicResourceItem) => (
// //               <Button
// //                 type="primary"
// //                 icon={<UploadOutlined />}
// //                 onClick={() => showUploadModal(record, openCategory!)}
// //                 className="bg-blue-500 hover:bg-blue-600 text-white"
// //               >
// //                 {record.status === 'Submitted' ? 'Re-upload' : 'Upload'}
// //               </Button>
// //             ),
// //           },
// //         ]),
// //   ];

// //   return (
// //     <div className="card flex-fill p-4 dark:bg-gray-900">
// //       <ToastContainer position="top-right" autoClose={3000} theme="colored" />
// //       <div className="card-header mb-4">
// //         <h5 className="dark:text-white text-xl font-semibold">Academic Resources</h5>
// //       </div>
// //       <div className="card-body">
// //         <div className="flex flex-wrap gap-2 mb-4">
// //           {(['Assignment', 'PYQ', 'Homework'] as AcademicResourceCategory[]).map((category) => (
// //             <button
// //               key={category}
// //               className={`px-4 py-2 rounded transition-colors ${
// //                 openCategory === category
// //                   ? 'bg-blue-500 text-white'
// //                   : 'bg-gray-200 dark:bg-gray-700 dark:text-white hover:bg-blue-600 hover:text-white'
// //               }`}
// //               onClick={() => toggleCategory(category)}
// //             >
// //               {category}
// //             </button>
// //           ))}
// //         </div>
// //         {openCategory ? (
// //           <Table
// //             columns={columns}
// //             dataSource={data[openCategory]}
// //             pagination={{ pageSize: 5 }}
// //             rowKey="key"
// //             className="dark:bg-gray-800 dark:text-white"
// //             scroll={{ x: 'max-content' }}
// //           />
// //         ) : (
// //           <div className="text-center dark:text-white text-gray-500">
// //             Select a category to view resources
// //           </div>
// //         )}
// //       </div>
// //       <Modal
// //         title={`Upload ${selectedCategory} - ${selectedItem?.title}`}
// //         open={isModalOpen}
// //         onOk={handleUpload}
// //         onCancel={handleModalCancel}
// //         okText={uploading ? 'Uploading...' : 'Submit'}
// //         okButtonProps={{ disabled: uploading || !fileList.length, className: 'bg-blue-500 hover:bg-blue-600 text-white' }}
// //         cancelButtonProps={{ className='border-gray-300 hover:border-gray-400 text-gray-700 dark:text-gray-300'}}
// //         className="dark:bg-gray-800"
// //         styles={{
// //           header: { background: 'bg-gray-100 dark:bg-gray-700', color: 'text-black dark:text-white' },
// //           body: { background: 'bg-white dark:bg-gray-800', color: 'text-black dark:text-white', padding: '24px' },
// //           footer: { background: 'bg-gray-100 dark:bg-gray-700', padding: '16px' },
// //         }}
// //       >
// //         <div className="mb-4">
// //           <p className="text-gray-600 dark:text-gray-300 mb-2">Please upload your {selectedCategory?.toLowerCase()} file (JPG, PNG, or PDF):</p>
// //           <Upload {...uploadProps} className="w-full">
// //             <Button icon={<UploadOutlined />} className="w-full text-left border-gray-300 hover:border-blue-500">
// //               Select File
// //             </Button>
// //           </Upload>
// //         </div>
// //       </Modal>
// //     </div>
// //   );
// // };

// // export default AcademicResources;

// import React, { useState, useEffect } from 'react';
// import { Table, Modal, Button, Upload, UploadFile } from 'antd';
// import { UploadOutlined } from '@ant-design/icons';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { AxiosResponse } from 'axios';
// import {
//   getResourcesByStudentId,
//   IAssignment,
//   IHomework,
//   submitHomework,
//   ISubmitHomeworkResponse,
//   submitAssignment,
//   ISubmitAssignmentResponse,
// } from '../../../../../services/student/StudentAllApi';
// import { closeModal } from '../../../../Common/modalclose';

// type AcademicResourceCategory = 'Assignment' | 'PYQ' | 'Homework';

// type AcademicResourceItem = {
//   key: string;
//   id: string;
//   title: string;
//   description: string;
//   dueDate?: string;
//   submissionDate?: string | null;
//   attachment?: string | null;
//   status?: string;
//   subject?: string;
// };

// type AcademicResourcesData = {
//   Assignment: AcademicResourceItem[];
//   Homework: AcademicResourceItem[];
//   PYQ: AcademicResourceItem[];
// };

// const formatDate = (dateString?: string): string => {
//   if (!dateString) return 'N/A';
//   const date = new Date(dateString);
//   if (isNaN(date.getTime())) return 'N/A';
//   const options: Intl.DateTimeFormatOptions = {
//     day: 'numeric',
//     month: 'long',
//     year: 'numeric',
//   };
//   return date.toLocaleDateString('en-GB', options);
// };

// const AcademicResources: React.FC = () => {
//   const [data, setData] = useState<AcademicResourcesData | null>(null);
//   const [openCategory, setOpenCategory] = useState<AcademicResourceCategory | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedItem, setSelectedItem] = useState<AcademicResourceItem | null>(null);
//   const [selectedCategory, setSelectedCategory] = useState<AcademicResourceCategory | null>(null);
//   const [fileList, setFileList] = useState<UploadFile[]>([]);
//   const [uploading, setUploading] = useState(false);

//   useEffect(() => {
//     const studentId = localStorage.getItem('studentId');
//     if (!studentId) {
//       toast.error('Student ID not found. Please log in.', { autoClose: 3000 });
//       return;
//     }

//     const fetchResources = async () => {
//       try {
//         const response = await getResourcesByStudentId(studentId);
//         if (response.data.success) {
//           const assignments: AcademicResourceItem[] = response.data.assignments.map((item: IAssignment) => ({
//             key: item.id,
//             id: item.id,
//             title: item.title,
//             description: item.description,
//             dueDate: item.dueDate,
//             submissionDate: item.AssignmentSubmission?.[0]?.submittedAt || null,
//             attachment: item.attachment,
//             status: item.status,
//             subject: item.subject.name,
//           }));
//           const homeworks: AcademicResourceItem[] = response.data.homeworks.map((item: IHomework) => ({
//             key: item.id,
//             id: item.id,
//             title: item.title,
//             description: item.description,
//             dueDate: item.dueDate,
//             submissionDate: item.HomeworkSubmission?.[0]?.submittedAt || null,
//             attachment: item.attachment,
//             status: item.status,
//             subject: item.subject.name,
//           }));
//           const pyqs: AcademicResourceItem[] = response.data.pyqs.map((item: any) => ({
//             key: item.id,
//             id: item.id,
//             title: `${item.subject} - ${item.topic}`,
//             description: 'Previous Year Question',
//             dueDate: undefined,
//             submissionDate: null,
//             attachment: item.question,
//             status: undefined,
//             subject: item.subject,
//           }));
//           setData({ Assignment: assignments, Homework: homeworks, PYQ: pyqs });
//           toast.success('Academic resources loaded!', { autoClose: 3000 });
//         } else {
//           throw new Error('Try Again');
//         }
//       } catch (error) {
//         console.error('Error fetching resources:', error);
//         toast.error('Failed to load academic resources.', { autoClose: 3000 });
//       }
//     };

//     fetchResources();
//   }, []);

//   const toggleCategory = (category: AcademicResourceCategory) => {
//     const newCategory = openCategory === category ? null : category;
//     setOpenCategory(newCategory);
//     if (newCategory) {
//       toast.success(`Showing ${category} data`, { autoClose: 3000 });
//     } else {
//       toast.info('Closed category view', { autoClose: 3000 });
//     }
//   };

//   const showUploadModal = (item: AcademicResourceItem, category: AcademicResourceCategory) => {
//     setSelectedItem(item);
//     setSelectedCategory(category);
//     setIsModalOpen(true);
//     setFileList([]);
//   };

//   const handleModalCancel = () => {
//     setIsModalOpen(false);
//     setSelectedItem(null);
//     setSelectedCategory(null);
//     setFileList([]);
//   };

//   const handleUpload = async () => {
//     if (!fileList.length || !selectedItem || !selectedCategory) {
//       toast.error('Please select a file to upload.', { autoClose: 3000 });
//       return;
//     }
//     const studentId = localStorage.getItem('studentId');
//     if (!studentId) {
//       toast.error('Student ID not found. Please log in.', { autoClose: 3000 });
//       return;
//     }

//     setUploading(true);
//     try {
//       const file = fileList[0].originFileObj;
//       if (!file) {
//         throw new Error('No file selected for upload');
//       }
//       const formData = new FormData();
//       formData.append('studentId', studentId);
//       if (selectedCategory === 'Homework') {
//         formData.append('homeworkId', selectedItem.id);
//       } else {
//         formData.append('assignmentId', selectedItem.id);
//       }
//       formData.append('file', file);

//       let response: AxiosResponse<ISubmitHomeworkResponse | ISubmitAssignmentResponse>;
//       if (selectedCategory === 'Homework') {
//         response = await submitHomework(formData);
//       } else {
//         response = await submitAssignment(formData);
//       }

//       if (response.status>=200) {
//         toast.success(response.data.message, { autoClose: 3000 });
//         setData((prev) => {
//           if (!prev) return prev;
//           const updatedCategory = prev[selectedCategory].map((item) =>
//             item.id === selectedItem.id
//               ? { ...item, status: 'Submitted', submissionDate: new Date().toISOString() }
//               : item
//           );
//           return { ...prev, [selectedCategory]: updatedCategory };
//         });
//         // closeModal('uploadModal');
//         handleModalCancel();
//       } else {
     
//         toast.error(response.data.message, { autoClose: 3000 });
//          handleModalCancel();
//       }
//     } catch (error: any) {
//       const errorMessage =
//         error.response?.status === 409
//           ? 'Item already submitted. Re-upload may not be allowed.'
//           : error.response?.data?.message || 'Failed to submit. Please try again.';
//       toast.error(errorMessage, { autoClose: 3000 });
//        handleModalCancel();
//       console.error('Upload error:', error);
//     } finally {
//       setUploading(false);
//     }
//   };

//   const uploadProps = {
//     onRemove: (file: UploadFile) => {
//       setFileList((prev) => prev.filter((item) => item.uid !== file.uid));
//     },
//     beforeUpload: (file: File) => {
//       const isValidType = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'application/pdf';
//       if (!isValidType) {
//         toast.error('You can only upload JPG, PNG, or PDF files!', { autoClose: 3000 });
//         return false;
//       }
//       setFileList([
//         {
//           uid: `-${Date.now()}`,
//           name: file.name,
//           status: 'done',
//           originFileObj: file,
//         },
//       ]);
//       return false;
//     },
//     fileList,
//   };

//   if (!data) return <div className="text-center dark:text-white">Loading...</div>;

//   const columns = [
//     { title: 'Title', dataIndex: 'title', key: 'title' },
//     { title: 'Description', dataIndex: 'description', key: 'description' },
//     { title: 'Subject', dataIndex: 'subject', key: 'subject' },
//     ...(openCategory === 'PYQ'
//       ? [
//           {
//             title: 'Question',
//             dataIndex: 'attachment',
//             key: 'attachment',
//             render: (link: string | null) =>
//               link ? (
//                 <a href={link} className="text-blue-500 hover:underline dark:text-blue-400" target="_blank" rel="noopener noreferrer">
//                   Download Question
//                 </a>
//               ) : (
//                 'N/A'
//               ),
//           },
//         ]
//       : [
//           {
//             title: 'Due Date',
//             dataIndex: 'dueDate',
//             key: 'dueDate',
//             render: (dueDate: string | undefined) => formatDate(dueDate),
//           },
//           {
//             title: 'Submission Date',
//             dataIndex: 'submissionDate',
//             key: 'submissionDate',
//             render: (submissionDate: string | null) => formatDate(submissionDate),
//           },
//           {
//             title: 'Status',
//             dataIndex: 'status',
//             key: 'status',
//             render: (status: string | undefined) =>
//               status ? (
//                 <span
//                   className={`font-medium ${
//                     status.toLowerCase() === 'pending' ? 'text-red-500' : 'text-green-500'
//                   }`}
//                 >
//                   {status}
//                 </span>
//               ) : (
//                 'N/A'
//               ),
//           },
//           {
//             title: 'Attachment',
//             dataIndex: 'attachment',
//             key: 'attachment',
//             render: (link: string | null) =>
//               link ? (
//                 <a href={link} className="text-blue-500 hover:underline dark:text-blue-400" target="_blank" rel="noopener noreferrer">
//                   Download
//                 </a>
//               ) : (
//                 'N/A'
//               ),
//           },
//           {
//             title: 'Action',
//             key: 'action',
//             render: (_: any, record: AcademicResourceItem) => (
//               <Button
//                 type="primary"
//                 icon={<UploadOutlined />}
//                 onClick={() => showUploadModal(record, openCategory!)}
//                 className="bg-blue-500 hover:bg-blue-600 text-white"
//               >
//                 {record.status === 'Submitted' ? 'Re-upload' : 'Upload'}
//               </Button>
//             ),
//           },
//         ]),
//   ];

//   return (
//     <div className="card flex-fill p-4 dark:bg-gray-900">
//       <ToastContainer position="top-right" autoClose={3000} theme="colored" />
//       <div className="card-header mb-4">
//         <h5 className="dark:text-white text-xl font-semibold">Academic Resources</h5>
//       </div>
//       <div className="card-body">
//         <div className="flex flex-wrap gap-2 mb-4">
//           {(['Assignment', 'PYQ', 'Homework'] as AcademicResourceCategory[]).map((category) => (
//             <button
//               key={category}
//               className={`px-4 py-2 rounded transition-colors ${
//                 openCategory === category
//                   ? 'bg-blue-500 text-white'
//                   : 'bg-gray-200 dark:bg-gray-700 dark:text-white hover:bg-blue-600 hover:text-white'
//               }`}
//               onClick={() => toggleCategory(category)}
//             >
//               {category}
//             </button>
//           ))}
//         </div>
//         {openCategory ? (
//           <Table
//             columns={columns}
//             dataSource={data[openCategory]}
//             pagination={{ pageSize: 5 }}
//             rowKey="key"
//             className="dark:bg-gray-800 dark:text-white"
//             scroll={{ x: 'max-content' }}
//           />
//         ) : (
//           <div className="text-center dark:text-white text-gray-500">
//             Select a category to view resources
//           </div>
//         )}
//       </div>
//       <Modal
//         title={`Upload ${selectedCategory} - ${selectedItem?.title}`}
//         open={isModalOpen}
//         onOk={handleUpload}
//         onCancel={handleModalCancel}
//         okText={uploading ? 'Uploading...' : 'Submit'}
//         okButtonProps={{ disabled: uploading || !fileList.length, className: 'bg-blue-500 hover:bg-blue-600 text-white' }}
//         cancelButtonProps={{ className: 'border-gray-300 hover:border-gray-400 text-gray-700 dark:text-gray-300' }}
//         className="dark:bg-gray-800"
//         styles={{
//           header: { background: 'bg-gray-100 dark:bg-gray-700', color: 'text-black dark:text-white' },
//           body: { background: 'bg-white dark:bg-gray-800', color: 'text-black dark:text-white', padding: '24px' },
//           footer: { background: 'bg-gray-100 dark:bg-gray-700', padding: '16px' },
//         }}
//       >
//         <div className="mb-4">
//           <p className="text-gray-600 dark:text-gray-300 mb-2">Please upload your {selectedCategory?.toLowerCase()} file (JPG, PNG, or PDF):</p>
//           <Upload {...uploadProps} className="w-full">
//             <Button icon={<UploadOutlined />} className="w-full text-left border-gray-300 hover:border-blue-500">
//               Select File
//             </Button>
//           </Upload>
//         </div>
//       </Modal>
//     </div>
//   );
// };

// export default AcademicResources;


import React, { useState, useEffect } from 'react';
import { Table, Modal, Button, Upload, UploadFile, Tabs } from 'antd';
import { UploadOutlined, EyeOutlined } from '@ant-design/icons';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AxiosResponse } from 'axios';
import {
  getResourcesByStudentId,
  IAssignment,
  IHomework,
  submitHomework,
  ISubmitHomeworkResponse,
  submitAssignment,
  ISubmitAssignmentResponse,
} from '../../../../../services/student/StudentAllApi';

type AcademicResourceCategory = 'Assignment' | 'PYQ' | 'Homework';
type AcademicResourceItem = {
  key: string;
  id: string;
  title: string;
  description: string;
  dueDate?: string;
  submissionDate?: string | null;
  attachment?: string | null;
  status?: string;
  subject?: string;
};
type AcademicResourcesData = {
  Assignment: { pending: AcademicResourceItem[]; submitted: AcademicResourceItem[] };
  Homework: { pending: AcademicResourceItem[]; submitted: AcademicResourceItem[] };
  PYQ: { pending: AcademicResourceItem[]; submitted: AcademicResourceItem[] };
};

const formatDate = (dateString?: string): string => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'N/A';
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  };
  return date.toLocaleDateString('en-GB', options);
};

class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="alert alert-danger m-3">
          <h5>Something went wrong.</h5>
          <p>Please try refreshing the page or contact support.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

const AcademicResources: React.FC = () => {
  const [data, setData] = useState<AcademicResourcesData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [openCategory, setOpenCategory] = useState<AcademicResourceCategory | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<AcademicResourceItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<AcademicResourceCategory | null>(null);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const studentId = localStorage.getItem('studentId');
    if (!studentId) {
      toast.error('Student ID not found. Please log in.', { autoClose: 3000 });
      setIsLoading(false);
      return;
    }
    const fetchResources = async () => {
      try {
        setIsLoading(true);
        const response = await getResourcesByStudentId(studentId);
        if (response.data.success) {
          const assignments: AcademicResourceItem[] = response.data.assignments.map((item: IAssignment) => ({
            key: item.id,
            id: item.id,
            title: item.title,
            description: item.description,
            dueDate: item.dueDate,
            submissionDate: item.AssignmentSubmission?.[0]?.submittedAt || null,
            attachment: item.attachment,
            status: item.status,
            subject: item.subject.name,
          }));
          const homeworks: AcademicResourceItem[] = response.data.homeworks.map((item: IHomework) => ({
            key: item.id,
            id: item.id,
            title: item.title,
            description: item.description,
            dueDate: item.dueDate,
            submissionDate: item.HomeworkSubmission?.[0]?.submittedAt || null,
            attachment: item.attachment,
            status: item.status,
            subject: item.subject.name,
          }));
          const pyqs: AcademicResourceItem[] = response.data.pyqs.map((item: any) => ({
            key: item.id,
            id: item.id,
            title: `${item.subject} - ${item.topic}`,
            description: 'Previous Year Question',
            dueDate: undefined,
            submissionDate: null,
            attachment: item.question,
            status: undefined,
            subject: item.subject,
          }));
          setData({
            Assignment: {
              pending: assignments.filter(item => item.status !== 'Submitted').sort((a, b) => (b.submissionDate || '').localeCompare(a.submissionDate || '')),
              submitted: assignments.filter(item => item.status === 'Submitted').sort((a, b) => (b.submissionDate || '').localeCompare(a.submissionDate || '')),
            },
            Homework: {
              pending: homeworks.filter(item => item.status !== 'Submitted').sort((a, b) => (b.submissionDate || '').localeCompare(a.submissionDate || '')),
              submitted: homeworks.filter(item => item.status === 'Submitted').sort((a, b) => (b.submissionDate || '').localeCompare(a.submissionDate || '')),
            },
            PYQ: { pending: pyqs, submitted: [] },
          });
          toast.success('Academic resources loaded!', { autoClose: 3000 });
        } else {
          throw new Error('Try Again');
        }
      } catch (error) {
        toast.error('Failed to load academic resources.', { autoClose: 3000 });
      } finally {
        setIsLoading(false);
      }
    };
    fetchResources();
  }, []);

  const toggleCategory = (category: AcademicResourceCategory) => {
    const newCategory = openCategory === category ? null : category;
    setOpenCategory(newCategory);
    if (newCategory) {
      toast.success(`Showing ${category} data`, { autoClose: 3000 });
    } else {
      toast.info('Closed category view', { autoClose: 3000 });
    }
  };

  const showUploadModal = (item: AcademicResourceItem, category: AcademicResourceCategory) => {
    setSelectedItem(item);
    setSelectedCategory(category);
    setIsModalOpen(true);
    setFileList([]);
  };

  const showPreviewModal = (link: string | null) => {
    if (link) {
      setPreviewFile(link);
      setIsPreviewOpen(true);
    }
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
    setSelectedCategory(null);
    setFileList([]);
  };

  const handlePreviewCancel = () => {
    setIsPreviewOpen(false);
    setPreviewFile(null);
  };

  const handleUpload = async () => {
    if (!fileList.length || !selectedItem || !selectedCategory) {
      toast.error('Please select a file to upload.', { autoClose: 3000 });
      return;
    }
    const studentId = localStorage.getItem('studentId');
    if (!studentId) {
      toast.error('Student ID not found. Please log in.', { autoClose: 3000 });
      return;
    }
    setUploading(true);
    try {
      const file = fileList[0].originFileObj;
      if (!file) {
        throw new Error('No file selected for upload');
      }
      const formData = new FormData();
      formData.append('studentId', studentId);
      if (selectedCategory === 'Homework') {
        formData.append('homeworkId', selectedItem.id);
      } else {
        formData.append('assignmentId', selectedItem.id);
      }
      formData.append('file', file);
      let response: AxiosResponse<ISubmitHomeworkResponse | ISubmitAssignmentResponse>;
      if (selectedCategory === 'Homework') {
        response = await submitHomework(formData);
      } else {
        response = await submitAssignment(formData);
      }
      if (response.status >= 200) {
        toast.success(response.data.message, { autoClose: 3000 });
        setData((prev) => {
          if (!prev) return prev;
          const updatedItem = { ...selectedItem, status: 'Submitted', submissionDate: new Date().toISOString() };
          const updatedPending = prev[selectedCategory].pending.filter(item => item.id !== selectedItem.id);
          const updatedSubmitted = [updatedItem, ...prev[selectedCategory].submitted].sort((a, b) => (b.submissionDate || '').localeCompare(a.submissionDate || ''));
          return {
            ...prev,
            [selectedCategory]: { pending: updatedPending, submitted: updatedSubmitted },
          };
        });
        handleModalCancel();
      } else {
        toast.error(response.data.message, { autoClose: 3000 });
        handleModalCancel();
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.status === 409
          ? 'Item already submitted. Re-upload may not be allowed.'
          : error.response?.data?.message || 'Failed to submit. Please try again.';
      toast.error(errorMessage, { autoClose: 3000 });
      handleModalCancel();
    } finally {
      setUploading(false);
    }
  };

  const uploadProps = {
    onRemove: (file: UploadFile) => {
      setFileList((prev) => prev.filter((item) => item.uid !== file.uid));
    },
    beforeUpload: (file: File) => {
      const isValidType = file.type === 'application/pdf' || file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      if (!isValidType) {
        toast.error('You can only upload PDF or DOC files!', { autoClose: 3000 });
        return false;
      }
      setFileList([
        {
          uid: `-${Date.now()}`,
          name: file.name,
          status: 'done',
          originFileObj: file,
        },
      ]);
      return false;
    },
    fileList,
  };

  const columns = [
    { title: 'Title', dataIndex: 'title', key: 'title' },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    { title: 'Subject', dataIndex: 'subject', key: 'subject' },
    ...(openCategory === 'PYQ'
      ? [
          {
            title: 'Question',
            dataIndex: 'attachment',
            key: 'attachment',
            render: (link: string | null) =>
              link ? (
                <div className="flex items-center gap-2">
                  <a href={link} className="text-blue-500 hover:underline dark:text-blue-400" target="_blank" rel="noopener noreferrer">
                    Download
                  </a>
                  <Button
                    icon={<EyeOutlined />}
                    onClick={() => showPreviewModal(link)}
                    className="border-gray-300 hover:border-blue-500"
                  >
                    Preview
                  </Button>
                </div>
              ) : (
                'N/A'
              ),
          },
        ]
      : [
          {
            title: 'Due Date',
            dataIndex: 'dueDate',
            key: 'dueDate',
            render: (dueDate: string | undefined) => {
              const isOverdue = dueDate && new Date(dueDate) < new Date();
              return (
                <span className={`badge ${isOverdue ? 'bg-danger' : 'bg-info'} text-white`}>
                  {formatDate(dueDate)}
                </span>
              );
            },
          },
          {
            title: 'Submission Date',
            dataIndex: 'submissionDate',
            key: 'submissionDate',
            render: (submissionDate: string | null) => formatDate(submissionDate),
          },
          {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string | undefined) =>
              status ? (
                <span
                  className={`font-medium ${
                    status.toLowerCase() === 'pending' ? 'text-red-500' : 'text-green-500'
                  }`}
                >
                  {status}
                </span>
              ) : (
                'N/A'
              ),
          },
          {
            title: 'Attachment',
            dataIndex: 'attachment',
            key: 'attachment',
            render: (link: string | null) =>
              link ? (
                <div className="flex items-center gap-2">
                  <a href={link} className="text-blue-500 hover:underline dark:text-blue-400" target="_blank" rel="noopener noreferrer">
                    Download
                  </a>
                  <Button
                    icon={<EyeOutlined />}
                    onClick={() => showPreviewModal(link)}
                    className="border-gray-300 hover:border-blue-500"
                  >
                    Preview
                  </Button>
                </div>
              ) : (
                'N/A'
              ),
          },
          {
            title: 'Action',
            key: 'action',
            render: (_: any, record: AcademicResourceItem) => (
              <Button
                type="primary"
                icon={<UploadOutlined />}
                onClick={() => showUploadModal(record, openCategory!)}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                {record.status === 'Submitted' ? 'Re-upload' : 'Upload'}
              </Button>
            ),
          },
        ]),
  ];

  const SkeletonPlaceholder = ({ className = "", style = {} }: { className?: string; style?: React.CSSProperties }) => (
    <span className={`placeholder bg-secondary ${className}`} style={style} />
  );

  return (
    <ErrorBoundary>
      <div className="card flex-fill p-4 dark:bg-gray-900">
        <ToastContainer position="top-right" autoClose={3000} theme="colored" />
        {isLoading ? (
          <div className="placeholder-glow">
            <div className="mb-4">
              <SkeletonPlaceholder className="col-4 mb-4" style={{ height: "2rem" }} />
              <div className="flex flex-wrap gap-2 mb-4">
                {[...Array(3)].map((_, index) => (
                  <SkeletonPlaceholder key={index} className="col-2" style={{ height: "2.5rem" }} />
                ))}
              </div>
              <div className="ant-table">
                <div className="ant-table-container">
                  <table className="w-full">
                    <thead>
                      <tr>
                        {[...Array(6)].map((_, index) => (
                          <th key={index}>
                            <SkeletonPlaceholder className="col-12" style={{ height: "1.5rem" }} />
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[...Array(5)].map((_, rowIndex) => (
                        <tr key={rowIndex}>
                          {[...Array(6)].map((_, colIndex) => (
                            <td key={colIndex}>
                              <SkeletonPlaceholder className="col-12" style={{ height: "1rem" }} />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="card-header mb-4">
              <h5 className="dark:text-white text-xl font-semibold">Academic Resources</h5>
            </div>
            <div className="card-body">
              <div className="flex flex-wrap gap-2 mb-4">
                {(['Assignment', 'PYQ', 'Homework'] as AcademicResourceCategory[]).map((category) => (
                  <button
                    key={category}
                    className={`px-4 py-2 rounded transition-colors ${
                      openCategory === category
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 dark:text-white hover:bg-blue-600 hover:text-white'
                    }`}
                    onClick={() => toggleCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
              {openCategory && data ? (
                <Tabs
                  defaultActiveKey="pending"
                  items={[
                    {
                      key: 'pending',
                      label: 'Pending',
                      children: (
                        <Table
                          columns={columns}
                          dataSource={data[openCategory].pending}
                          pagination={{ pageSize: 5 }}
                          rowKey="key"
                          className="dark:bg-gray-800 dark:text-white"
                          scroll={{ x: 'max-content' }}
                        />
                      ),
                    },
                    {
                      key: 'submitted',
                      label: 'Submitted',
                      children: (
                        <Table
                          columns={columns}
                          dataSource={data[openCategory].submitted}
                          pagination={{ pageSize: 5 }}
                          rowKey="key"
                          className="dark:bg-gray-800 dark:text-white"
                          scroll={{ x: 'max-content' }}
                        />
                      ),
                    },
                  ]}
                />
              ) : (
                <div className="text-center dark:text-white text-gray-500">
                  Select a category to view resources
                </div>
              )}
            </div>
          </>
        )}
        <Modal
          title={`Upload ${selectedCategory} - ${selectedItem?.title}`}
          open={isModalOpen}
          onOk={handleUpload}
          onCancel={handleModalCancel}
          okText={uploading ? 'Uploading...' : 'Submit'}
          okButtonProps={{ disabled: uploading || !fileList.length, className: 'bg-blue-500 hover:bg-blue-600 text-white' }}
          cancelButtonProps={{ className: 'border-gray-300 hover:border-gray-400 text-gray-700 dark:text-gray-300' }}
          className="dark:bg-gray-800"
          styles={{
            header: { background: 'bg-gray-100 dark:bg-gray-700', color: 'text-black dark:text-white' },
            body: { background: 'bg-white dark:bg-gray-800', color: 'text-black dark:text-white', padding: '24px' },
            footer: { background: 'bg-gray-100 dark:bg-gray-700', padding: '16px' },
          }}
        >
          <div className="mb-4">
            <p className="text-gray-600 dark:text-gray-300 mb-2">Please upload your {selectedCategory?.toLowerCase()} file (PDF or DOC):</p>
            <Upload {...uploadProps} className="w-full">
              <Button icon={<UploadOutlined />} className="w-full text-left border-gray-300 hover:border-blue-500">
                Select File
              </Button>
            </Upload>
          </div>
        </Modal>
        <Modal
          title="File Preview"
          open={isPreviewOpen}
          footer={null}
          onCancel={handlePreviewCancel}
          className="dark:bg-gray-800"
          styles={{
            header: { background: 'bg-gray-100 dark:bg-gray-700', color: 'text-black dark:text-white' },
            body: { background: 'bg-white dark:bg-gray-800', padding: '24px' },
          }}
        >
          {previewFile && (
            <iframe
              src={previewFile}
              className="w-full h-[60vh]"
              title="File Preview"
            />
          )}
        </Modal>
      </div>
    </ErrorBoundary>
  );
};

export default AcademicResources;