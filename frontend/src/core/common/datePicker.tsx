// // // converted the js  into typescript and react bootstrap by using ai 
// // import React, { useState } from "react";
// // import DatePicker from "react-datepicker";
// // import "react-datepicker/dist/react-datepicker.css";
// // import { OverlayTrigger, Popover, Button, Form } from "react-bootstrap";
// // import dayjs from "dayjs";

// // /**
// //  * A date range picker component that allows selecting start and end dates
// //  * with predefined ranges and custom date selection.
// //  */
// // const PredefinedDateRanges: React.FC = () => {
// //   // Current date reference
// //   const today = new Date();
  
// //   // State for managing selected dates
// //   const [startDate, setStartDate] = useState<Date | null>(today);
// //   const [endDate, setEndDate] = useState<Date | null>(today);

// //   /**
// //    * Handles start date selection
// //    * @param date - Selected start date
// //    */
// //   const handleStartDateChange = (date: Date | null) => {
// //     setStartDate(date);
// //     // Ensure end date is not before start date
// //     if (date && endDate && date > endDate) {
// //       setEndDate(date);
// //     }
// //   };

// //   /**
// //    * Handles end date selection
// //    * @param date - Selected end date
// //    */
// //   const handleEndDateChange = (date: Date | null) => {
// //     setEndDate(date);
// //     // Ensure start date is not after end date
// //     if (date && startDate && date < startDate) {
// //       setStartDate(date);
// //     }
// //   };

// //   // Popover content for start date picker
// //   const startDatePopover = (
// //     <Popover id="start-date-popover">
// //       <Popover.Body className="p-0">
// //         <DatePicker
// //           selected={startDate}
// //           onChange={handleStartDateChange}
// //           selectsStart
// //           startDate={startDate}
// //           endDate={endDate}
// //           minDate={new Date(2000, 0, 1)} // Minimum selectable date
// //           maxDate={endDate || today}     // Can't select after end date or today
// //           inline                         // Always show calendar
// //         />
// //       </Popover.Body>
// //     </Popover>
// //   );

// //   // Popover content for end date picker
// //   const endDatePopover = (
// //     <Popover id="end-date-popover">
// //       <Popover.Body className="p-0">
// //         <DatePicker
// //           selected={endDate}
// //           onChange={handleEndDateChange}
// //           selectsEnd
// //           startDate={startDate}
// //           endDate={endDate}
// //           minDate={startDate || new Date(2000, 0, 1)} // Can't select before start date
// //           maxDate={today}                            // Can't select after today
// //           inline
// //         />
// //       </Popover.Body>
// //     </Popover>
// //   );

// //   return (
// //     // Main container with white background
// //     <div className="bg-white rounded d-inline-block" style={{ padding: "6px 12px" }}>
// //       <Form.Group className="d-flex align-items-center gap-2 m-0">
// //         {/* Calendar icon */}
// //         <i className="bi bi-calendar text-muted" style={{ fontSize: "1rem" }} />

// //         {/* Start date picker trigger */}
// //         <OverlayTrigger
// //           trigger="click"
// //           placement="bottom-start"
// //           overlay={startDatePopover}
// //           rootClose // Close when clicking outside
// //         >
// //           <Button
// //             variant="link"
// //             className="d-flex align-items-center py-1 px-2 text-dark"
// //             style={{ 
// //               minWidth: "100px", 
// //               justifyContent: "center",
// //               fontSize: "0.875rem",
// //               textDecoration: "none",
// //               backgroundColor: "transparent"
// //             }}
// //           >
// //             {dayjs(startDate).format("DD/MM/YYYY")}
// //           </Button>
// //         </OverlayTrigger>

// //         {/* Date range separator */}
// //         <span className="fw-bold text-muted" style={{ fontSize: "0.875rem" }}>-</span>

// //         {/* End date picker trigger */}
// //         <OverlayTrigger
// //           trigger="click"
// //           placement="bottom-end"
// //           overlay={endDatePopover}
// //           rootClose
// //         >
// //           <Button
// //             variant="link"
// //             className="d-flex align-items-center py-1 px-2 text-dark"
// //             style={{ 
// //               minWidth: "100px", 
// //               justifyContent: "center",
// //               fontSize: "0.875rem",
// //               textDecoration: "none",
// //               backgroundColor: "transparent"
// //             }}
// //           >
// //             {dayjs(endDate).format("DD/MM/YYYY")}
// //           </Button>
// //         </OverlayTrigger>
// //       </Form.Group>
// //     </div>
// //   );
// // };

// // export default PredefinedDateRanges;

// import React, { useState, useRef } from "react";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import { OverlayTrigger, Popover, Button, Form } from "react-bootstrap";
// import dayjs from "dayjs";

// /**
//  * A date range picker component that allows selecting start and end dates
//  * with predefined ranges and custom date selection.
//  */
// const PredefinedDateRanges: React.FC = () => {
//   const today = new Date();
//   const [startDate, setStartDate] = useState<Date | null>(today);
//   const [endDate, setEndDate] = useState<Date | null>(today);
//   const startPickerRef = useRef<OverlayTrigger>(null);
//   const endPickerRef = useRef<OverlayTrigger>(null);

//   /**
//    * Handles start date selection and closes the popover
//    */
//   const handleStartDateChange = (date: Date | null) => {
//     setStartDate(date);
//     if (date && endDate && date > endDate) {
//       setEndDate(date);
//     }
//     startPickerRef.current?.hide();
//   };

//   /**
//    * Handles end date selection and closes the popover
//    */
//   const handleEndDateChange = (date: Date | null) => {
//     setEndDate(date);
//     if (date && startDate && date < startDate) {
//       setStartDate(date);
//     }
//     endPickerRef.current?.hide();
//   };

//   // Popover content for start date picker
//   const startDatePopover = (
//     <Popover id="start-date-popover">
//       <Popover.Body className="p-0">
//         <DatePicker
//           selected={startDate}
//           onChange={handleStartDateChange}
//           selectsStart
//           startDate={startDate}
//           endDate={endDate}
//           minDate={new Date(2000, 0, 1)}
//           maxDate={endDate || today}
//           inline
//         />
//       </Popover.Body>
//     </Popover>
//   );

//   // Popover content for end date picker
//   const endDatePopover = (
//     <Popover id="end-date-popover">
//       <Popover.Body className="p-0">
//         <DatePicker
//           selected={endDate}
//           onChange={handleEndDateChange}
//           selectsEnd
//           startDate={startDate}
//           endDate={endDate}
//           minDate={startDate || new Date(2000, 0, 1)}
//           maxDate={today}
//           inline
//         />
//       </Popover.Body>
//     </Popover>
//   );

//   return (
//     <div className="bg-white rounded d-inline-block" style={{ padding: "6px 12px" }}>
//       <Form.Group className="d-flex align-items-center gap-2 m-0">
//         <i className="bi bi-calendar text-muted" style={{ fontSize: "1rem" }} />

//         <OverlayTrigger
//           ref={startPickerRef}
//           trigger="click"
//           placement="bottom-start"
//           overlay={startDatePopover}
//           rootClose
//         >
//           <Button
//             variant="link"
//             className="d-flex align-items-center py-1 px-2 text-dark"
//             style={{ 
//               minWidth: "100px", 
//               justifyContent: "center",
//               fontSize: "0.875rem",
//               textDecoration: "none",
//               backgroundColor: "transparent"
//             }}
//           >
//             {dayjs(startDate).format("DD/MM/YYYY")}
//           </Button>
//         </OverlayTrigger>

//         <span className="fw-bold text-muted" style={{ fontSize: "0.875rem" }}>-</span>

//         <OverlayTrigger
//           ref={endPickerRef}
//           trigger="click"
//           placement="bottom-end"
//           overlay={endDatePopover}
//           rootClose
//         >
//           <Button
//             variant="link"
//             className="d-flex align-items-center py-1 px-2 text-dark"
//             style={{ 
//               minWidth: "100px", 
//               justifyContent: "center",
//               fontSize: "0.875rem",
//               textDecoration: "none",
//               backgroundColor: "transparent"
//             }}
//           >
//             {dayjs(endDate).format("DD/MM/YYYY")}
//           </Button>
//         </OverlayTrigger>
//       </Form.Group>
//     </div>
//   );
// };

// export default PredefinedDateRanges;

import React, { useState, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { OverlayTrigger, Popover, Button, Form } from "react-bootstrap";
import dayjs from "dayjs";

const PredefinedDateRanges: React.FC = () => {
  const today = new Date();
  const [startDate, setStartDate] = useState<Date | null>(today);
  const [endDate, setEndDate] = useState<Date | null>(today);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const handleStartDateChange = (date: Date | null) => {
    setStartDate(date);
    if (date && endDate && date > endDate) {
      setEndDate(date);
    }
    setShowStartPicker(false); // Close the calendar after selection
  };

  const handleEndDateChange = (date: Date | null) => {
    setEndDate(date);
    if (date && startDate && date < startDate) {
      setStartDate(date);
    }
    setShowEndPicker(false); // Close the calendar after selection
  };

  return (
    <div className="bg-white rounded d-inline-block" style={{ padding: "6px 12px" }}>
      <Form.Group className="d-flex align-items-center gap-2 m-0">
        <i className="bi bi-calendar text-muted" style={{ fontSize: "1rem" }} />

        {/* Start Date Picker */}
        <div className="position-relative">
          <Button
            variant="link"
            className="d-flex align-items-center py-1 px-2 text-dark"
            style={{ 
              minWidth: "100px", 
              justifyContent: "center",
              fontSize: "0.875rem",
              textDecoration: "none",
              backgroundColor: "transparent"
            }}
            onClick={() => {
              setShowStartPicker(!showStartPicker);
              setShowEndPicker(false);
            }}
          >
            {dayjs(startDate).format("DD/MM/YYYY")}
          </Button>
          
          {showStartPicker && (
            <div className="position-absolute bg-white p-2 border rounded shadow mt-1" style={{ zIndex: 1050 }}>
              <DatePicker
                selected={startDate}
                onChange={handleStartDateChange}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                minDate={new Date(2000, 0, 1)}
                maxDate={endDate || today}
                inline
              />
            </div>
          )}
        </div>

        <span className="fw-bold text-muted" style={{ fontSize: "0.875rem" }}>-</span>

        {/* End Date Picker */}
        <div className="position-relative">
          <Button
            variant="link"
            className="d-flex align-items-center py-1 px-2 text-dark"
            style={{ 
              minWidth: "100px", 
              justifyContent: "center",
              fontSize: "0.875rem",
              textDecoration: "none",
              backgroundColor: "transparent"
            }}
            onClick={() => {
              setShowEndPicker(!showEndPicker);
              setShowStartPicker(false);
            }}
          >
            {dayjs(endDate).format("DD/MM/YYYY")}
          </Button>
          
          {showEndPicker && (
            <div className="position-absolute bg-white p-2 border rounded shadow mt-1" style={{ zIndex: 1050 }}>
              <DatePicker
                selected={endDate}
                onChange={handleEndDateChange}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate || new Date(2000, 0, 1)}
                maxDate={today}
                inline
              />
            </div>
          )}
        </div>
      </Form.Group>
    </div>
  );
};

export default PredefinedDateRanges;