import React from "react";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import { Link } from "react-router-dom";

const TicketsSidebar = () => {
  return (
    // <div className="col-xl-4 col-xxl-3 theiaStickySidebar">
    //   <div className="stickybar">
    //     <div className="card">
    //       <div className="card-header p-3">
    //         <h4>Ticket Categories</h4>
    //       </div>
    //       <div className="card-body p-0">
    //         <div className="d-flex flex-column">
    //           <div className="d-flex align-items-center justify-content-between border-bottom p-3">
    //             <Link to="#">Internet Issue</Link>
    //             <div className="d-flex align-items-center">
    //               <span className="badge badge-soft-danger me-2">2</span>
    //               <span className="badge bg-primary-transparent">0</span>
    //             </div>
    //           </div>
    //           <div className="d-flex align-items-center justify-content-between border-bottom p-3">
    //             <Link to="#">Computer</Link>
    //             <div className="d-flex align-items-center">
    //               <span className="badge badge-soft-danger me-2">2</span>
    //               <span className="badge bg-primary-transparent">1</span>
    //             </div>
    //           </div>
    //           <div className="d-flex align-items-center justify-content-between border-bottom p-3">
    //             <Link to="#">Redistribute</Link>
    //             <div className="d-flex align-items-center">
    //               <span className="badge bg-primary-transparent">1</span>
    //             </div>
    //           </div>
    //           <div className="d-flex align-items-center justify-content-between border-bottom p-3">
    //             <Link to="#">Payment</Link>
    //             <div className="d-flex align-items-center">
    //               <span className="badge bg-primary-transparent">2</span>
    //             </div>
    //           </div>
    //           <div className="d-flex align-items-center justify-content-between p-3">
    //             <Link to="#">Complaint</Link>
    //             <div className="d-flex align-items-center">
    //               <span className="badge badge-soft-danger me-2">3</span>
    //               <span className="badge bg-primary-transparent">1</span>
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //     <div className="card mb-0">
    //       <div className="card-header p-3">
    //         <h4>Support Agents</h4>
    //       </div>
    //       <div className="card-body p-0">
    //         <div className="d-flex flex-column">
    //           <div className="d-flex align-items-center justify-content-between border-bottom p-3">
    //             <span className="d-flex align-items-center">
    //               <ImageWithBasePath
    //                 src="assets/img/teachers/teacher-03.jpg"
    //                 className="avatar avatar-xs rounded-circle me-2"
    //                 alt="img"
    //               />
    //               Hellana
    //             </span>
    //             <div className="d-flex align-items-center">
    //               <span className="badge badge-soft-danger me-2">2</span>
    //               <span className="badge bg-primary-transparent">0</span>
    //             </div>
    //           </div>
    //           <div className="d-flex align-items-center justify-content-between border-bottom p-3">
    //             <span className="d-flex align-items-center">
    //               <ImageWithBasePath
    //                 src="assets/img/teachers/teacher-01.jpg"
    //                 className="avatar avatar-xs rounded-circle me-2"
    //                 alt="img"
    //               />
    //               Teresa
    //             </span>
    //             <div className="d-flex align-items-center">
    //               <span className="badge badge-soft-danger me-2">2</span>
    //               <span className="badge bg-primary-transparent">1</span>
    //             </div>
    //           </div>
    //           <div className="d-flex align-items-center justify-content-between border-bottom p-3">
    //             <span className="d-flex align-items-center">
    //               <ImageWithBasePath
    //                 src="assets/img/teachers/teacher-02.jpg"
    //                 className="avatar avatar-xs rounded-circle me-2"
    //                 alt="img"
    //               />
    //               Daniel
    //             </span>
    //             <div className="d-flex align-items-center">
    //               <span className="badge bg-primary-transparent">1</span>
    //             </div>
    //           </div>
    //           <div className="d-flex align-items-center justify-content-between p-3">
    //             <span className="d-flex align-items-center">
    //               <ImageWithBasePath
    //                 src="assets/img/teachers/teacher-07.jpg"
    //                 className="avatar avatar-xs rounded-circle me-2"
    //                 alt="img"
    //               />
    //               Willie
    //             </span>
    //             <div className="d-flex align-items-center">
    //               <span className="badge bg-primary-transparent">2</span>
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>
    <div className="col-xl-4 col-xxl-3 theiaStickySidebar">
  <div className="stickybar">

    {/* Ticket Categories */}
    <div className="card mb-4 shadow-sm">
      <div className="card-header p-3 bg-light border-bottom">
        <h5 className="mb-0 text-primary">🎫 Ticket Categories</h5>
      </div>
      <div className="card-body p-0">
        <div className="d-flex flex-column">
          {[
            { name: "Internet Issue", urgent: 2, normal: 0 },
            { name: "Computer", urgent: 2, normal: 1 },
            { name: "Redistribute", urgent: 0, normal: 1 },
            { name: "Payment", urgent: 0, normal: 2 },
            { name: "Complaint", urgent: 3, normal: 1 },
          ].map((cat, i) => (
            <div
              key={i}
              className="d-flex align-items-center justify-content-between border-bottom p-3 hover-bg"
            >
              <Link to="#" className="text-dark fw-medium">
                {cat.name}
              </Link>
              <div className="d-flex align-items-center">
                {cat.urgent > 0 && (
                  <span className="badge bg-danger-subtle text-danger fw-semibold me-2">
                    {cat.urgent}
                  </span>
                )}
                {cat.normal > 0 && (
                  <span className="badge bg-primary-subtle text-primary fw-semibold">
                    {cat.normal}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Support Agents */}
    <div className="card mb-0 shadow-sm">
      <div className="card-header p-3 bg-light border-bottom">
        <h5 className="mb-0 text-primary">👩‍💻 Support Agents</h5>
      </div>
      <div className="card-body p-0">
        <div className="d-flex flex-column">
          {[
            { name: "Hellana", img: "teacher-03.jpg", urgent: 2, normal: 0 },
            { name: "Teresa", img: "teacher-01.jpg", urgent: 2, normal: 1 },
            { name: "Daniel", img: "teacher-02.jpg", urgent: 0, normal: 1 },
            { name: "Willie", img: "teacher-07.jpg", urgent: 0, normal: 2 },
          ].map((agent, i) => (
            <div
              key={i}
              className={`d-flex align-items-center justify-content-between border-bottom p-3 ${
                i === 3 ? "border-bottom-0" : ""
              }`}
            >
              <span className="d-flex align-items-center">
                <ImageWithBasePath
                  src={`assets/img/teachers/${agent.img}`}
                  className="avatar avatar-xs rounded-circle me-2"
                  alt={agent.name}
                />
                <span className="fw-semibold">{agent.name}</span>
              </span>
              <div className="d-flex align-items-center">
                {agent.urgent > 0 && (
                  <span className="badge bg-danger-subtle text-danger fw-semibold me-2">
                    {agent.urgent}
                  </span>
                )}
                {agent.normal > 0 && (
                  <span className="badge bg-primary-subtle text-primary fw-semibold">
                    {agent.normal}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

  </div>
</div>

  );
};

export default TicketsSidebar;
