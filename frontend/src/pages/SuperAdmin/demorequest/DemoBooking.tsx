import React, { useEffect, useState } from "react";
import moment from "moment";
import { getAllDemoRequest } from "../../../services/superadmin/demoRequestApi";
import { IDemoBooking } from "../../../services/types/superAdmin/demoRequest";
import { Input, DatePicker, Select } from "antd";
import dayjs from "dayjs";
import "./DemoBookingList.css"; 
import CustomLoader from "../../../components/Loader";

const { Search } = Input;
const { RangePicker } = DatePicker;
const { Option } = Select;

const DemoBookingList: React.FC = () => {
  const [bookings, setBookings] = useState<IDemoBooking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<IDemoBooking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [dateRange, setDateRange] = useState<[moment.Moment | null, moment.Moment | null] | null>(null);

  useEffect(() => {
    fetchDemoBookings();
  }, []);

  const fetchDemoBookings = () => {
    setLoading(true);
    getAllDemoRequest()
      .then((res) => {
        const data = res.data;

        if (data && Array.isArray(data.bookings)) {
          const sorted = sortBookings(data.bookings, "newest");
          setBookings(sorted);
          setFilteredBookings(sorted);
        } else {
          console.error("Unexpected response shape:", data);
        }
      })
      .catch((err) => {
        console.error("Error fetching demo bookings:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const sortBookings = (data: IDemoBooking[], order: "newest" | "oldest") => {
    return [...data].sort((a, b) =>
      order === "newest"
        ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  };

  const applyFilters = () => {
    let result = [...bookings];

    if (searchText.trim() !== "") {
      result = result.filter((booking) =>
        `${booking.name} ${booking.email} ${booking.school}`.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (dateRange && dateRange[0] && dateRange[1]) {
      const [start, end] = dateRange;
      result = result.filter((booking) =>
        dayjs(booking.createdAt).isBetween(start, end, "day", "[]")
      );
    }

    result = sortBookings(result, sortOrder);
    setFilteredBookings(result);
  };

  useEffect(() => {
    applyFilters();
  }, [searchText, dateRange, sortOrder, bookings]);

  return (
    <div className="page-wrapper">
      <div className="container-fluid py-4">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
          <h2 className="fw-bold mb-0">📅 All Demo Bookings</h2>
          <div className="d-flex flex-wrap gap-2 align-items-center">
            <Search
              placeholder="Search by name, email, or school"
              onChange={(e) => setSearchText(e.target.value)}
              value={searchText}
              allowClear
              style={{ width: 250 }}
            />
            <RangePicker
              onChange={(dates) => setDateRange(dates)}
              style={{ width: 250 }}
              value={dateRange as any}
              allowClear
            />
            <Select
              value={sortOrder}
              style={{ width: 160 }}
              onChange={(value) => setSortOrder(value)}
            >
              <Option value="newest">Sort by Newest</Option>
              <Option value="oldest">Sort by Oldest</Option>
            </Select>
          </div>
        </div>

        {loading ? (
       <CustomLoader variant="dots" color="#3067e3"  />
        ) : filteredBookings.length === 0 ? (
          <div className="alert alert-warning text-center">No demo bookings found.</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered table-striped demo-table">
              <thead className="table-dark sticky-header">
                <tr>
                  <th style={{ minWidth: "60px" }}>Sr No.</th>
                  <th style={{ minWidth: "150px" }}>Name</th>
                  <th style={{ minWidth: "200px" }}>School</th>
                  <th style={{ minWidth: "220px" }}>Email</th>
                  <th style={{ minWidth: "250px" }}>Booking Date & Time</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking, index) => (
                  <tr key={booking.id}>
                    <td>{index + 1}</td>
                    <td>{booking.name}</td>
                    <td>{booking.school}</td>
                    <td className="text-break">{booking.email}</td>
                    <td>{moment(booking.dateTime).format("dddd, MMMM Do YYYY, h:mm A")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DemoBookingList;
