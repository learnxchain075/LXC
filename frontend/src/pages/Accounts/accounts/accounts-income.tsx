// import React, { useEffect } from "react";
// import { Link } from "react-router-dom";

// import { TableData } from "../../../core/data/interface";
// import PredefinedDateRanges from "../../../core/common/datePicker";
// import CommonSelect from "../../../core/common/commonSelect";
// import {
//   incomeName,
//   invoiceNumber,
//   paymentMethod,
//   source,
// } from "../../../core/common/selectoption/selectoption";
// import { DatePicker } from "antd";
// import { all_routes } from "../../../router/all_routes";
// import TooltipOption from "../../../core/common/tooltipOption";
// import ImageWithBasePath from "../../../core/common/imageWithBasePath";
// import BaseApi from "../../../services/BaseApi";
// import { getSchoolIncomes } from "../../../services/accounts/schoolIncomeApi";

// const AccountsIncome = () => {
//   const routes = all_routes;
//   // const data = accounts_income_data;
// useEffect(()=>{
//   const fetch=async ()=>{
//     const response = await getSchoolIncomes(localStorage.getItem("schoolId")?? "");
//     console.log("response",response);

//   }
//   fetch();
// },[])
//   const columns = [
//     {
//       title: "ID",
//       dataIndex: "id",
//       render: (text: any) => (
//         <Link
//           to="#"
//           className="link-primary"
//           data-bs-toggle="modal"
//           data-bs-target="#view_invoice"
//         >
//           {text}
//         </Link>
//       ),
//       sorter: (a: TableData, b: TableData) => a.id.length - b.id.length,
//     },
//     {
//       title: "Income Name",
//       dataIndex: "incomeName",
//       sorter: (a: TableData, b: TableData) =>
//         a.incomeName.length - b.incomeName.length,
//     },
//     {
//       title: "Description",
//       dataIndex: "description",
//       sorter: (a: TableData, b: TableData) =>
//         a.description.length - b.description.length,
//     },
//     {
//       title: "Source",
//       dataIndex: "source",
//       sorter: (a: TableData, b: TableData) => a.source.length - b.source.length,
//     },
//     {
//       title: "Date",
//       dataIndex: "date",
//       sorter: (a: TableData, b: TableData) => a.date.length - b.date.length,
//     },
//     {
//       title: "Amount",
//       dataIndex: "amount",
//       sorter: (a: TableData, b: TableData) => a.amount.length - b.amount.length,
//     },
//     {
//       title: "Invoice No",
//       dataIndex: "invoiceNo",
//       sorter: (a: TableData, b: TableData) =>
//         a.invoiceNo.length - b.invoiceNo.length,
//       render: (text: any) => (
//         <Link
//           to="#"
//           className="link-primary"
//           data-bs-toggle="modal"
//           data-bs-target="#view_invoice"
//         >
//           {text}
//         </Link>
//       ),
//     },
//     {
//       title: "Payment Method",
//       dataIndex: "paymentMethod",
//       sorter: (a: TableData, b: TableData) =>
//         a.paymentMethod.length - b.paymentMethod.length,
//     },
//     {
//       title: "Action",
//       dataIndex: "action",
//       render: (_: any, record: any) => (
//         <>
//           <div className="dropdown">
//             <Link
//               to="#"
//               className="btn btn-white btn-icon btn-sm d-flex align-items-center justify-content-center rounded-circle p-0"
//               data-bs-toggle="dropdown"
//               aria-expanded="false"
//             >
//               <i className="ti ti-dots-vertical fs-14" />
//             </Link>
//             <ul className="dropdown-menu dropdown-menu-right p-3">
//               <li>
//                 <Link
//                   className="dropdown-item rounded-1"
//                   to="#"
//                   data-bs-toggle="modal"
//                   data-bs-target="#edit_income"
//                 >
//                   <i className="ti ti-edit-circle me-2" />
//                   Edit
//                 </Link>
//               </li>
//               <li>
//                 <Link
//                   className="dropdown-item rounded-1"
//                   to="#"
//                   data-bs-toggle="modal"
//                   data-bs-target="#delete-modal"
//                 >
//                   <i className="ti ti-trash-x me-2" />
//                   Delete
//                 </Link>
//               </li>
//             </ul>
//           </div>
//         </>
//       ),
//     },
//   ];

//   return (
//     <div>
//       {" "}
//       {/* Page Wrapper */}
//       <div className="page-wrapper">
//         <div className="content">
//           {/* Page Header */}
//           <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
//             <div className="my-auto mb-2">
//               <h3 className="page-title mb-1">Income</h3>
//               <nav>
//                 <ol className="breadcrumb mb-0">
//                   <li className="breadcrumb-item">
//                     <Link to={routes.adminDashboard}>Dashboard</Link>
//                   </li>
//                   <li className="breadcrumb-item">
//                     <Link to="#">Finance &amp; Accounts</Link>
//                   </li>
//                   <li className="breadcrumb-item active" aria-current="page">
//                     Income
//                   </li>
//                 </ol>
//               </nav>
//             </div>
//             <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
//               <TooltipOption />
//               <div className="mb-2">
//                 <Link
//                   to="#"
//                   className="btn btn-primary d-flex align-items-center"
//                   data-bs-toggle="modal"
//                   data-bs-target="#add_income"
//                 >
//                   <i className="ti ti-square-rounded-plus me-2" />
//                   Add Income
//                 </Link>
//               </div>
//             </div>
//           </div>
//           {/* /Page Header */}
//           <div className="card">
//             <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
//               <h4 className="mb-3">Income List</h4>
//               <div className="d-flex align-items-center flex-wrap">
//                 <div className="input-icon-start mb-3 me-2 position-relative">
//                   <PredefinedDateRanges />
//                 </div>
//                 <div className="dropdown mb-3 me-2">
//                   <Link
//                     to="#"
//                     className="btn btn-outline-light bg-white dropdown-toggle"
//                     data-bs-toggle="dropdown"
//                     data-bs-auto-close="outside"
//                   >
//                     <i className="ti ti-filter me-2" />
//                     Filter
//                   </Link>
//                   <div className="dropdown-menu drop-width">
//                     <form>
//                       <div className="d-flex align-items-center border-bottom p-3">
//                         <h4>Filter</h4>
//                       </div>
//                       <div className="p-3 pb-0 border-bottom">
//                         <div className="row">
//                           <div className="col-md-6">
//                             <div className="mb-3">
//                               <label className="form-label">Income Name</label>
//                               <CommonSelect
//                                 className="select"
//                                 options={incomeName}
//                                 defaultValue={incomeName[0]}
//                               />
//                             </div>
//                           </div>
//                           <div className="col-md-6">
//                             <div className="mb-3">
//                               <label className="form-label">Source</label>
//                               <CommonSelect
//                                 className="select"
//                                 options={source}
//                                 defaultValue={source[0]}
//                               />
//                             </div>
//                           </div>
//                           <div className="col-md-12">
//                             <div className="mb-3">
//                               <label className="form-label">
//                                 Invoice Number
//                               </label>
//                               <CommonSelect
//                                 className="select"
//                                 options={invoiceNumber}
//                                 defaultValue={invoiceNumber[0]}
//                               />
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                       <div className="p-3 d-flex align-items-center justify-content-end">
//                         <Link to="#" className="btn btn-light me-3">
//                           Reset
//                         </Link>
//                         <button type="submit" className="btn btn-primary">
//                           Apply
//                         </button>
//                       </div>
//                     </form>
//                   </div>
//                 </div>
//                 <div className="dropdown mb-3">
//                   <Link
//                     to="#"
//                     className="btn btn-outline-light bg-white dropdown-toggle"
//                     data-bs-toggle="dropdown"
//                   >
//                     <i className="ti ti-sort-ascending-2 me-2" />
//                     Sort by A-Z
//                   </Link>
//                   <ul className="dropdown-menu p-3">
//                     <li>
//                       <Link to="#" className="dropdown-item rounded-1 active">
//                         Ascending
//                       </Link>
//                     </li>
//                     <li>
//                       <Link to="#" className="dropdown-item rounded-1">
//                         Descending
//                       </Link>
//                     </li>
//                     <li>
//                       <Link to="#" className="dropdown-item rounded-1">
//                         Recently Viewed
//                       </Link>
//                     </li>
//                     <li>
//                       <Link to="#" className="dropdown-item rounded-1">
//                         Recently Added
//                       </Link>
//                     </li>
//                   </ul>
//                 </div>
//               </div>
//             </div>
//             <div className="card-body p-0 py-3">
//               {/* Income List */}
//               {/* <Table dataSource={data} columns={columns} Selection={true} /> */}
//               {/* /Income List */}
//             </div>
//           </div>
//         </div>
//       </div>
//       {/* /Page Wrapper */}
//       {/* Add Income */}
//       <div className="modal fade" id="add_income">
//         <div className="modal-dialog modal-dialog-centered">
//           <div className="modal-content">
//             <div className="modal-header">
//               <h4 className="modal-title">Add Income</h4>
//               <button
//                 type="button"
//                 className="btn-close custom-btn-close"
//                 data-bs-dismiss="modal"
//                 aria-label="Close"
//               >
//                 <i className="ti ti-x" />
//               </button>
//             </div>
//             <form>
//               <div className="modal-body">
//                 <div className="row">
//                   <div className="col-md-12">
//                     <div className="mb-3">
//                       <label className="form-label">Income Name</label>
//                       <input type="text" className="form-control" />
//                     </div>
//                   </div>
//                   <div className="col-md-12">
//                     <div className="mb-3">
//                       <label className="form-label">Source</label>
//                       <input type="text" className="form-control" />
//                     </div>
//                   </div>
//                   <div className="col-md-6">
//                     <div className="mb-3">
//                       <label className="form-label">Date of Birth</label>
//                       <div className="input-icon position-relative">
//                         <span className="input-icon-addon">
//                           <i className="ti ti-calendar" />
//                         </span>
//                         <DatePicker
//                           className="form-control datetimepicker"
//                           placeholder="Select Date"
//                         />
//                       </div>
//                     </div>
//                   </div>
//                   <div className="col-md-6">
//                     <div className="mb-3">
//                       <label className="form-label">Amount</label>
//                       <input type="text" className="form-control" />
//                     </div>
//                   </div>
//                   <div className="col-md-6">
//                     <div className="mb-3">
//                       <label className="form-label">Invoice No</label>
//                       <input type="text" className="form-control" />
//                     </div>
//                   </div>
//                   <div className="col-md-6">
//                     <div className="mb-3">
//                       <label className="form-label">Payment Method</label>
//                       <CommonSelect
//                         className="select"
//                         options={paymentMethod}
//                         defaultValue={paymentMethod[0]}
//                       />
//                     </div>
//                   </div>
//                   <div className="col-md-12">
//                     <div className="mb-0">
//                       <label className="form-label">Description</label>
//                       <textarea
//                         rows={4}
//                         className="form-control"
//                         defaultValue={""}
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <div className="modal-footer">
//                 <Link
//                   to="#"
//                   className="btn btn-light me-2"
//                   data-bs-dismiss="modal"
//                 >
//                   Cancel
//                 </Link>
//                 <button type="submit" className="btn btn-primary">
//                   Add Income
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//       {/* /Add Income */}
//       {/* Edit Income */}
//       <div className="modal fade" id="edit_income">
//         <div className="modal-dialog modal-dialog-centered">
//           <div className="modal-content">
//             <div className="modal-header">
//               <h4 className="modal-title">Edit Income</h4>
//               <button
//                 type="button"
//                 className="btn-close custom-btn-close"
//                 data-bs-dismiss="modal"
//                 aria-label="Close"
//               >
//                 <i className="ti ti-x" />
//               </button>
//             </div>
//             <form>
//               <div className="modal-body">
//                 <div className="row">
//                   <div className="col-md-12">
//                     <div className="mb-3">
//                       <label className="form-label">Income Name</label>
//                       <input
//                         type="text"
//                         className="form-control"
//                         placeholder="Enter Income Name"
//                         defaultValue="April Month Fees"
//                       />
//                     </div>
//                   </div>
//                   <div className="col-md-12">
//                     <div className="mb-3">
//                       <label className="form-label">Source</label>
//                       <input
//                         type="text"
//                         className="form-control"
//                         placeholder="Enter Source"
//                         defaultValue="Tuition Fees"
//                       />
//                     </div>
//                   </div>
//                   <div className="col-md-6">
//                     <div className="mb-3">
//                       <label className="form-label">Date of Birth</label>
//                       <DatePicker
//                         className="form-control datetimepicker"
//                         placeholder="Select Date"
//                       />
//                     </div>
//                   </div>
//                   <div className="col-md-6">
//                     <div className="mb-3">
//                       <label className="form-label">Amount</label>
//                       <input
//                         type="text"
//                         className="form-control"
//                         placeholder="Enter Amount"
//                         defaultValue="$15,000"
//                       />
//                     </div>
//                   </div>
//                   <div className="col-md-6">
//                     <div className="mb-3">
//                       <label className="form-label">Invoice No</label>
//                       <input
//                         type="text"
//                         className="form-control"
//                         placeholder="Enter Invoice No"
//                         defaultValue="INV681537"
//                       />
//                     </div>
//                   </div>
//                   <div className="col-md-6">
//                     <div className="mb-3">
//                       <label className="form-label">Payment Method</label>
//                       <CommonSelect
//                         className="select"
//                         options={paymentMethod}
//                         defaultValue={paymentMethod[0]}
//                       />
//                     </div>
//                   </div>
//                   <div className="col-md-12">
//                     <div className="mb-0">
//                       <label className="form-label">Description</label>
//                       <textarea
//                         rows={4}
//                         className="form-control"
//                         placeholder="text"
//                         defaultValue={"Tuition for Term 1, Class II"}
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <div className="modal-footer">
//                 <Link
//                   to="#"
//                   className="btn btn-light me-2"
//                   data-bs-dismiss="modal"
//                 >
//                   Cancel
//                 </Link>
//                 <button type="submit" className="btn btn-primary">
//                   Save Changes
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//       {/* /Edit Income */}
//       {/* Delete Modal */}
//       <div className="modal fade" id="delete-modal">
//         <div className="modal-dialog modal-dialog-centered">
//           <div className="modal-content">
//             <form>
//               <div className="modal-body text-center">
//                 <span className="delete-icon">
//                   <i className="ti ti-trash-x" />
//                 </span>
//                 <h4>Confirm Deletion</h4>
//                 <p>
//                   You want to delete all the marked items, this cant be undone
//                   once you delete.
//                 </p>
//                 <div className="d-flex justify-content-center">
//                   <Link
//                     to="#"
//                     className="btn btn-light me-3"
//                     data-bs-dismiss="modal"
//                   >
//                     Cancel
//                   </Link>
//                   <button type="submit" className="btn btn-danger">
//                     Yes, Delete
//                   </button>
//                 </div>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//       {/* /Delete Modal */}
//       {/* View Modal */}
//       <div className="modal fade" id="view_invoice">
//         <div className="modal-dialog modal-dialog-centered  modal-xl invoice-modal">
//           <div className="modal-content">
//             <div className="modal-wrapper">
//               <div className="invoice-popup-head d-flex align-items-center justify-content-between mb-4">
//                 <span>
//                   <ImageWithBasePath src="assets/img/logo3.png" alt="Img" />
//                 </span>
//                 <div className="popup-title">
//                   <h2>UNIVERSITY NAME</h2>
//                   <p>Original For Recipient</p>
//                 </div>
//               </div>
//               <div className="tax-info mb-2">
//                 <div className="mb-4 text-center">
//                   <h1>Tax Invoice</h1>
//                 </div>
//                 <div className="row">
//                   <div className="col-lg-4">
//                     <div className="tax-invoice-info d-flex align-items-center justify-content-between">
//                       <h5>Student Name :</h5>
//                       <h6>Walter Roberson</h6>
//                     </div>
//                   </div>
//                   <div className="col-lg-4">
//                     <div className="tax-invoice-info d-flex align-items-center justify-content-between">
//                       <h5>Student ID :</h5>
//                       <h6>DD465123</h6>
//                     </div>
//                   </div>
//                   <div className="col-lg-4">
//                     <div className="tax-invoice-info d-flex align-items-center justify-content-between">
//                       <h5>Term :</h5>
//                       <h6>Term 1</h6>
//                     </div>
//                   </div>
//                   <div className="col-lg-4">
//                     <div className="tax-invoice-info d-flex align-items-center justify-content-between">
//                       <h5>Invoice No :</h5>
//                       <h6>INV681531</h6>
//                     </div>
//                   </div>
//                   <div className="col-lg-4">
//                     <div className="tax-invoice-info d-flex align-items-center justify-content-between">
//                       <h5>Invoice Date :</h5>
//                       <h6>24 Apr 2024</h6>
//                     </div>
//                   </div>
//                   <div className="col-lg-4">
//                     <div className="tax-invoice-info d-flex align-items-center justify-content-between">
//                       <h5>Due Date :</h5>
//                       <h6>30 Apr 2024</h6>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="mb-4">
//                   <h6 className="mb-1">Bill To :</h6>
//                   <p>
//                     <span className="text-dark">Walter Roberson</span> <br />
//                     299 Star Trek Drive, Panama City, Florida, 32405, USA.{" "}
//                     <br />
//                     walter@gmail.com <br />
//                     +45 5421 4523
//                   </p>
//                 </div>
//                 <div className="invoice-product-table">
//                   <div className="table-responsive invoice-table">
//                     <table className="table">
//                       <thead>
//                         <tr>
//                           <th>Description</th>
//                           <th>Due Date</th>
//                           <th>Amount</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         <tr>
//                           <td>Semester Fees</td>
//                           <td>25 Apr 2024</td>
//                           <td>$5,000</td>
//                         </tr>
//                         <tr>
//                           <td>Exam Fees</td>
//                           <td>25 Apr 2024</td>
//                           <td>$1000</td>
//                         </tr>
//                         <tr>
//                           <td>Transport Fees</td>
//                           <td>25 Apr 2024</td>
//                           <td>$4,000</td>
//                         </tr>
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//                 <div className="row">
//                   <div className="col-lg-6">
//                     <div className="mb-3">
//                       <h5 className="mb-1">Important Note: </h5>
//                       <p className="text-dark mb-0">
//                         Delivery dates are not guaranteed and Seller has
//                       </p>
//                       <p className="text-dark">
//                         no liability for damages that may be incurred due to any
//                         delay. has
//                       </p>
//                     </div>
//                     <div>
//                       <h5 className="mb-1">Total amount ( in words):</h5>
//                       <p className="text-dark fw-medium">
//                         USD Ten Thousand One Hundred Sixty Five Only
//                       </p>
//                     </div>
//                   </div>
//                   <div className="col-lg-6">
//                     <div className="total-amount-tax">
//                       <ul>
//                         <li className="fw-medium text-dark">Subtotal</li>
//                         <li className="fw-medium text-dark">Discount 0%</li>
//                         <li className="fw-medium text-dark">IGST 18.0%</li>
//                       </ul>
//                       <ul>
//                         <li>$10,000.00</li>
//                         <li>+ $0.00</li>
//                         <li>$10,000.00</li>
//                       </ul>
//                     </div>
//                     <div className="total-amount-tax mb-3">
//                       <ul className="total-amount">
//                         <li className="text-dark">Amount Payable</li>
//                       </ul>
//                       <ul className="total-amount">
//                         <li className="text-dark">$10,165.00</li>
//                       </ul>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="payment-info">
//                   <div className="row align-items-center">
//                     <div className="col-lg-6 mb-4 pt-4">
//                       <h5 className="mb-2">Payment Info:</h5>
//                       <p className="mb-1">
//                         Debit Card :{" "}
//                         <span className="fw-medium text-dark">
//                           465 *************645
//                         </span>
//                       </p>
//                       <p className="mb-0">
//                         Amount :{" "}
//                         <span className="fw-medium text-dark">$10,165</span>
//                       </p>
//                     </div>
//                     <div className="col-lg-6 text-end mb-4 pt-4 ">
//                       <h6 className="mb-2">For Dreamguys</h6>
//                       <ImageWithBasePath
//                         src="assets/img/icons/signature.svg"
//                         alt="Img"
//                       />
//                     </div>
//                   </div>
//                 </div>
//                 <div className="border-bottom text-center pt-4 pb-4">
//                   <span className="text-dark fw-medium">
//                     Terms &amp; Conditions :{" "}
//                   </span>
//                   <p>
//                     Here we can write a additional notes for the client to get a
//                     better understanding of this invoice.
//                   </p>
//                 </div>
//                 <p className="text-center pt-3">Thanks for your Business</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       {/* /View Modal */}
//     </div>
//   );
// };

// export default AccountsIncome;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Table, DatePicker } from 'antd';

import { all_routes } from '../../../router/all_routes';
import PredefinedDateRanges from '../../../core/common/datePicker';
import CommonSelect from '../../../core/common/commonSelect';
import {
  incomeName,
  invoiceNumber,
  paymentMethod,
  source,
} from '../../../core/common/selectoption/selectoption';
import TooltipOption from '../../../core/common/tooltipOption';
import ImageWithBasePath from '../../../core/common/imageWithBasePath';

import { createSchoolIncome, deleteSchoolIncome, getAllSchoolIncomes, getSchoolIncomes, updateSchoolIncome } from '../../../services/accounts/schoolIncomeApi';
import { ICreateSchoolIncome, ISchoolIncome, IUpdateSchoolIncome } from '../../../services/types/accounts/schoolIncomeServices';
import { toast, ToastContainer } from 'react-toastify';

const AccountsIncome: React.FC = () => {
  const routes = all_routes;
  const [incomes, setIncomes] = useState<ISchoolIncome[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [formData, setFormData] = useState<ICreateSchoolIncome>({
    source: '',
    date: new Date(),
    amount: 0,
    description: '',
    invoiceNumber: '',
    paymentMethod: 'CASH',
    schoolId:localStorage.getItem("schoolId")??""
  });
  const [editFormData, setEditFormData] = useState<IUpdateSchoolIncome | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const closeModal = (modalId: string) => {
    try {
      const modalElement = document.getElementById(modalId);
      if (modalElement) {
        const modal = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
        modal.hide();
        // console.log(`${modalId} modal closed and disposed`);

        // Delayed backdrop cleanup to ensure animation completes
        setTimeout(() => {
          const backdrops = document.querySelectorAll('.modal-backdrop');
          backdrops.forEach((backdrop) => backdrop.remove());
          document.body.classList.remove('modal-open');
          document.body.style.overflow = '';
          document.body.style.paddingRight = '';
          //console.log(`Removed ${backdrops.length} modal backdrops for ${modalId}`);
        }, 300); // Match Bootstrap's modal transition duration
      } else {
       // console.warn(`Modal with ID ${modalId} not found`);
      }
    } catch (error) {
     // console.error(`Error closing modal ${modalId}:`, error);
    }
  };

  // Fallback to force clear backdrops
  const forceClearBackdrops = () => {
    const backdrops = document.querySelectorAll('.modal-backdrop');
    backdrops.forEach((backdrop) => backdrop.remove());
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
   // console.log('Force cleared backdrops');
  };
  // Fetch all incomes
  const fetchIncomes = async () => {
    try {
      setLoading(true);
     const response = await getSchoolIncomes(localStorage.getItem("schoolId") ??"");
     //const response = await  getAllSchoolIncomes();
    // console.log("response in incomes ",response);
      setIncomes(response.data);
    } catch (error) {
      console.error('Error fetching incomes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncomes();
  }, []);

  // Handle form submission for creating income
  const handleCreateIncome = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
   await createSchoolIncome(formData as any);
   toast.success("sucessfully income is added");
      setFormData({
        source: '',
        date: '',
        amount: 0,
        description: '',
        invoiceNumber: '',
        paymentMethod: 'CASH',
        schoolId:localStorage.getItem("schoolId"),
      });
      fetchIncomes();
      closeModal('add_income');
      forceClearBackdrops();
      // document.getElementById('add_income')?.classList.remove('show');
    } catch (error) {
      console.error('Error creating income:', error);
      closeModal('add_income');
      forceClearBackdrops();
    }
  };

  // Handle form submission for updating income
  const handleUpdateIncome = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editId || !editFormData) return;
    try {
      await updateSchoolIncome(editId,editFormData as any);
      toast.success("sucessfully income is updated");
      setEditFormData(null);
      setEditId(null);
      fetchIncomes();
      closeModal('edit_income');
      forceClearBackdrops();
     // document.getElementById('edit_income')?.classList.remove('show');
    } catch (error) {
      console.error('Error updating income:', error);
      closeModal('edit_income');
      forceClearBackdrops();
    }
  };

  // Handle delete income
  const handleDeleteIncome = async (id: string) => {
    try {
      await deleteSchoolIncome(id);
      toast.success("sucessfully deleted");
      fetchIncomes();
      closeModal('delete-modal');
      forceClearBackdrops();
      //document.getElementById('delete-modal')?.classList.remove('show');
    } catch (error) {
      console.error('Error deleting income:', error);
      closeModal('delete-modal');
      forceClearBackdrops();
    }
  };

//pending...........😢
  const handleEditClick = (income: ISchoolIncome) => {
    setEditId(income.id);
    setEditFormData({
      source: income.source,
      date: income.date,
      amount: income.amount,
      description: income.description,
      invoiceNumber: income.invoiceNumber,
      paymentMethod: income.paymentMethod,
      
    });
  };

  const columns = [
    // {
    //   title: 'ID',
    //   dataIndex: 'id',
    //   render: (text: string) => (
    //     <Link to="#" className="link-primary" data-bs-toggle="modal" data-bs-target="#view_invoice">
    //       {text}
    //     </Link>
    //   ),
    //   sorter: (a: ISchoolIncome, b: ISchoolIncome) => a.id.length - b.id.length,
    // },
    // {
    //   title: 'Income Name',
    //   dataIndex: 'source',
    //   sorter: (a: ISchoolIncome, b: ISchoolIncome) => a.source.length - b.source.length,
    // },
    {
      title: 'Source',
      dataIndex: 'source',
      sorter: (a: ISchoolIncome, b: ISchoolIncome) => a.source.length - b.source.length,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      sorter: (a: ISchoolIncome, b: ISchoolIncome) =>
        (a.description?.length || 0) - (b.description?.length || 0),
    },
    
    {
      title: 'Date',
      dataIndex: 'date',
      render: (date: Date) => new Date(date).toLocaleDateString(),
      sorter: (a: ISchoolIncome, b: ISchoolIncome) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      render: (amount: number) => `${amount.toFixed(2)}`,
      sorter: (a: ISchoolIncome, b: ISchoolIncome) => a.amount - b.amount,
    },
    {
      title: 'Invoice No',
      dataIndex: 'invoiceNumber',
      render: (text: string) => (
        <Link to="#" className="link-primary" data-bs-toggle="modal" data-bs-target="#view_invoice">
          {text || 'N/A'}
        </Link>
      ),
      sorter: (a: ISchoolIncome, b: ISchoolIncome) =>
        (a.invoiceNumber?.length || 0) - (b.invoiceNumber?.length || 0),
    },
    {
      title: 'Payment Method',
      dataIndex: 'paymentMethod',
      sorter: (a: ISchoolIncome, b: ISchoolIncome) => a.paymentMethod.length - b.paymentMethod.length,
    },
    {
      title: 'Action',
      render: (_: any, record: ISchoolIncome) => (
        <div className="dropdown">
          <Link
            to="#"
            className="btn btn-white btn-icon btn-sm d-flex align-items-center justify-content-center rounded-circle p-0"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i className="ti ti-dots-vertical fs-14" />
          </Link>
          <ul className="dropdown-menu dropdown-menu-right p-3">
            <li>
              <Link
                className="dropdown-item rounded-1"
                to="#"
                data-bs-toggle="modal"
                data-bs-target="#edit_income"
                onClick={() => handleEditClick(record)}
              >
                <i className="ti ti-edit-circle me-2" />
                Edit
              </Link>
            </li>
            <li>
              <Link
                className="dropdown-item rounded-1"
                to="#"
                data-bs-toggle="modal"
                data-bs-target="#delete-modal"
                onClick={() => setEditId(record.id)}
              >
                <i className="ti ti-trash-x me-2" />
                Delete
              </Link>
            </li>
          </ul>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="page-wrapper">
      <ToastContainer position="top-right" autoClose={3000} />
        <div className="content">
          <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Income</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="#">Finance & Accounts</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Income
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <TooltipOption />
              <div className="mb-2">
                <Link
                  to="#"
                  className="btn btn-primary d-flex align-items-center"
                  data-bs-toggle="modal"
                  data-bs-target="#add_income"
                >
                  <i className="ti ti-square-rounded-plus me-2" />
                 
                  Add Income
                </Link>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
              <h4 className="mb-3">Income List</h4>
              <div className="d-flex align-items-center flex-wrap">
                <div className="input-icon-start mb-3 me-2 position-relative">
                  <PredefinedDateRanges />
                </div>
                <div className="dropdown mb-3 me-2">
                  <Link
                    to="#"
                    className="btn btn-outline-light bg-white dropdown-toggle"
                    data-bs-toggle="dropdown"
                    data-bs-auto-close="outside"
                  >
                    <i className="ti ti-filter me-2" />
                    Filter
                  </Link>
                  <div className="dropdown-menu drop-width">
                    <form>
                      <div className="d-flex align-items-center border-bottom p-3">
                        <h4>Filter</h4>
                      </div>
                      <div className="p-3 pb-0 border-bottom">
                        <div className="row">
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className="form-label">Income Name</label>
                              <CommonSelect
                                className="select"
                                options={incomeName}
                                defaultValue={incomeName[0]}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className="form-label">Source</label>
                              <CommonSelect
                                className="select"
                                options={source}
                                defaultValue={source[0]}
                              />
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="mb-3">
                              <label className="form-label">Invoice Number</label>
                              <CommonSelect
                                className="select"
                                options={invoiceNumber}
                                defaultValue={invoiceNumber[0]}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="p-3 d-flex align-items-center justify-content-end">
                        <Link to="#" className="btn btn-light me-3">
                          Reset
                        </Link>
                        <button type="submit" className="btn btn-primary">
                          Apply
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
                <div className="dropdown mb-3">
                  <Link
                    to="#"
                    className="btn btn-outline-light bg-white dropdown-toggle"
                    data-bs-toggle="dropdown"
                  >
                    <i className="ti ti-sort-ascending-2 me-2" />
                    Sort by A-Z
                  </Link>
                  <ul className="dropdown-menu p-3">
                    <li>
                      <Link to="#" className="dropdown-item rounded-1 active">
                        Ascending
                      </Link>
                    </li>
                    <li>
                      <Link to="#" className="dropdown-item rounded-1">
                        Descending
                      </Link>
                    </li>
                    <li>
                      <Link to="#" className="dropdown-item rounded-1">
                        Recently Viewed
                      </Link>
                    </li>
                    <li>
                      <Link to="#" className="dropdown-item rounded-1">
                        Recently Added
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="card-body p-0 py-3">
              {loading ? (
               <div>loading...</div>
              ) : (
                <Table dataSource={incomes} columns={columns} rowKey="id" />
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Add Income Modal */}
      <div className="modal fade" id="add_income">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Add Income</h4>
              <button
                type="button"
                className="btn-close custom-btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="ti ti-x" />
              </button>
            </div>
            <form onSubmit={handleCreateIncome}>
              <div className="modal-body">
                <div className="row">
                  {/* <div className="col-md-12">
                    <div className="mb-3">
                      <label className="form-label">Income Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.source}
                        onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                        required
                      />
                    </div>
                  </div> */}
                  <div className="col-md-12">
                    <div className="mb-3">
                      <label className="form-label">Source</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.source}
                        onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Date</label>
                      <DatePicker
                        className="form-control datetimepicker"
                        onChange={(date, dateString) =>
                          setFormData({ ...formData, date: Array.isArray(dateString) ? dateString[0] : dateString })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Amount</label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.amount}
                        onChange={(e) =>
                          setFormData({ ...formData, amount: parseFloat(e.target.value) })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Invoice No</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.invoiceNumber || ''}
                        onChange={(e) =>
                          setFormData({ ...formData, invoiceNumber: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    {/* <div className="mb-3">
                      <label className="form-label">Payment Method</label>
                      <CommonSelect
                        className="select"
                        options={paymentMethod}
                        defaultValue={paymentMethod.find((p) => p.value === formData.paymentMethod)}
                        onChange={(value) =>
                          setFormData({ ...formData, paymentMethod: value as any })
                        }
                      />
                    </div> */}
                    <div className="mb-3">
  <label className="form-label">Payment Method</label>
  <select
    className="form-select"
    value={formData.paymentMethod}
    onChange={(e) =>
      setFormData({ ...formData, paymentMethod: e.target.value as typeof formData.paymentMethod })
    }
  >
    <option value="">Select Payment Method</option>
    <option value="CASH">Cash</option>
    <option value="CHEQUE">Cheque</option>
    <option value="BANK_TRANSFER">Bank Transfer</option>
    <option value="UPI">UPI</option>
    <option value="ONLINE">Online</option>
    <option value="CREDIT_CARD">Credit Card</option>
    <option value="DEBIT_CARD">Debit Card</option>
  </select>
</div>

                  </div>
                  <div className="col-md-12">
                    <div className="mb-0">
                      <label className="form-label">Description</label>
                      <textarea
                        rows={4}
                        className="form-control"
                        value={formData.description || ''}
                        onChange={(e) =>
                          setFormData({ ...formData, description: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <Link to="#" className="btn btn-light me-2" data-bs-dismiss="modal" 
                onClick={() => setFormData({
                  source: '',
                  date: '',
                  amount: 0,
                  description: '',
                  invoiceNumber: '',
                  paymentMethod: 'CASH',
                  schoolId:""
                })
              }
                >
                  Cancel
                </Link>
                <button type="submit" className="btn btn-primary">
                {loading ? "Adding" :"Add"} Income
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* Edit Income Modal */}
      <div className="modal fade" id="edit_income">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Edit Income</h4>
              <button
                type="button"
                className="btn-close custom-btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="ti ti-x" />
              </button>
            </div>
            {editFormData && (
              <form onSubmit={handleUpdateIncome}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="mb-3">
                        <label className="form-label">Income Name</label>
                        <input
                          type="text"
                          className="form-control"
                          value={editFormData.source}
                          onChange={(e) =>
                            setEditFormData({ ...editFormData, source: e.target.value })
                          }
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="mb-3">
                        <label className="form-label">Source</label>
                        <input
                          type="text"
                          className="form-control"
                          value={editFormData.source}
                          onChange={(e) =>
                            setEditFormData({ ...editFormData, source: e.target.value })
                          }
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Date</label>
                        <DatePicker
                          className="form-control datetimepicker"
                          value={editFormData.date ? new Date(editFormData.date) : null}
                          onChange={(date, dateString) =>
                            setEditFormData({ ...editFormData, date: dateString })
                          }
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Amount</label>
                        <input
                          type="number"
                          className="form-control"
                          value={editFormData.amount}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              amount: parseFloat(e.target.value),
                            })
                          }
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Invoice No</label>
                        <input
                          type="text"
                          className="form-control"
                          value={editFormData.invoiceNumber || ''}
                          onChange={(e) =>
                            setEditFormData({ ...editFormData, invoiceNumber: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Payment Method</label>
                        <CommonSelect
                          className="select"
                          options={paymentMethod}
                          defaultValue={paymentMethod.find(
                            (p) => p.value === editFormData.paymentMethod
                          )}
                          onChange={(value) =>
                            setEditFormData({ ...editFormData, paymentMethod: value as any })
                          }
                        />
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="mb-0">
                        <label className="form-label">Description</label>
                        <textarea
                          rows={4}
                          className="form-control"
                          value={editFormData.description || ''}
                          onChange={(e) =>
                            setEditFormData({ ...editFormData, description: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <Link to="#" className="btn btn-light me-2" data-bs-dismiss="modal">
                    Cancel
                  </Link>
                  <button type="submit" className="btn btn-primary">
                    Save Changes
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
      {/* Delete Modal */}
      <div className="modal fade" id="delete-modal">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <form onSubmit={() => editId && handleDeleteIncome(editId)}>
              <div className="modal-body text-center">
                <span className="delete-icon">
                  <i className="ti ti-trash-x" />
                </span>
                <h4>Confirm Deletion</h4>
                <p>
                  You want to delete this income record. This action cannot be undone.
                </p>
                <div className="d-flex justify-content-center">
                  <Link to="#" className="btn btn-light me-3" data-bs-dismiss="modal">
                    Cancel
                  </Link>
                  <button type="submit" className="btn btn-danger">
                    Yes, Delete
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* View Modal (unchanged from your code) */}
      <div className="modal fade" id="view_invoice">
        <div className="modal-dialog modal-dialog-centered modal-xl invoice-modal">
          <div className="modal-content">
            <div className="modal-wrapper">
              <div className="invoice-popup-head d-flex align-items-center justify-content-between mb-4">
                <span>
                  <ImageWithBasePath src="assets/img/logo3.png" alt="Img" />
                </span>
                <div className="popup-title">
                  <h2>UNIVERSITY NAME</h2>
                  <p>Original For Recipient</p>
                </div>
              </div>
              <div className="tax-info mb-2">
                <div className="mb-4 text-center">
                  <h1>Tax Invoice</h1>
                </div>
                <div className="row">
                  <div className="col-lg-4">
                    <div className="tax-invoice-info d-flex align-items-center justify-content-between">
                      <h5>Student Name :</h5>
                      <h6>Walter Roberson</h6>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="tax-invoice-info d-flex align-items-center justify-content-between">
                      <h5>Student ID :</h5>
                      <h6>DD465123</h6>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="tax-invoice-info d-flex align-items-center justify-content-between">
                      <h5>Term :</h5>
                      <h6>Term 1</h6>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="tax-invoice-info d-flex align-items-center justify-content-between">
                      <h5>Invoice No :</h5>
                      <h6>INV681531</h6>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="tax-invoice-info d-flex align-items-center justify-content-between">
                      <h5>Invoice Date :</h5>
                      <h6>24 Apr 2024</h6>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="tax-invoice-info d-flex align-items-center justify-content-between">
                      <h5>Due Date :</h5>
                      <h6>30 Apr 2024</h6>
                    </div>
                  </div>
                </div>
                <div className="mb-4">
                  <h6 className="mb-1">Bill To :</h6>
                  <p>
                    <span className="text-dark">Walter Roberson</span> <br />
                    299 Star Trek Drive, Panama City, Florida, 32405, USA. <br />
                    walter@gmail.com <br />
                    +45 5421 4523
                  </p>
                </div>
                <div className="invoice-product-table">
                  <div className="table-responsive invoice-table">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Description</th>
                          <th>Due Date</th>
                          <th>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Semester Fees</td>
                          <td>25 Apr 2024</td>
                          <td>$5,000</td>
                        </tr>
                        <tr>
                          <td>Exam Fees</td>
                          <td>25 Apr 2024</td>
                          <td>$1000</td>
                        </tr>
                        <tr>
                          <td>Transport Fees</td>
                          <td>25 Apr 2024</td>
                          <td>$4,000</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <h5 className="mb-1">Important Note: </h5>
                      <p className="text-dark mb-0">
                        Delivery dates are not guaranteed and Seller has
                      </p>
                      <p className="text-dark">
                        no liability for damages that may be incurred due to any delay.
                      </p>
                    </div>
                    <div>
                      <h5 className="mb-1">Total amount (in words):</h5>
                      <p className="text-dark fw-medium">
                        USD Ten Thousand One Hundred Sixty Five Only
                      </p>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="total-amount-tax">
                      <ul>
                        <li className="fw-medium text-dark">Subtotal</li>
                        <li className="fw-medium text-dark">Discount 0%</li>
                        <li className="fw-medium text-dark">IGST 18.0%</li>
                      </ul>
                      <ul>
                        <li>$10,000.00</li>
                        <li>+ $0.00</li>
                        <li>$10,000.00</li>
                      </ul>
                    </div>
                    <div className="total-amount-tax mb-3">
                      <ul className="total-amount">
                        <li className="text-dark">Amount Payable</li>
                      </ul>
                      <ul className="total-amount">
                        <li className="text-dark">$10,165.00</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="payment-info">
                  <div className="row align-items-center">
                    <div className="col-lg-6 mb-4 pt-4">
                      <h5 className="mb-2">Payment Info:</h5>
                      <p className="mb-1">
                        Debit Card : <span className="fw-medium text-dark">465 *************645</span>
                      </p>
                      <p className="mb-0">
                        Amount : <span className="fw-medium text-dark">$10,165</span>
                      </p>
                    </div>
                    <div className="col-lg-6 text-end mb-4 pt-4">
                      <h6 className="mb-2">For Dreamguys</h6>
                      <ImageWithBasePath src="assets/img/icons/signature.svg" alt="Img" />
                    </div>
                  </div>
                </div>
                <div className="border-bottom text-center pt-4 pb-4">
                  <span className="text-dark fw-medium">Terms & Conditions :</span>
                  <p>
                    Here we can write additional notes for the client to get a better understanding of this invoice.
                  </p>
                </div>
                <p className="text-center pt-3">Thanks for your Business</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountsIncome;