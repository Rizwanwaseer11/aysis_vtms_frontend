import React, { useMemo, useState } from "react";
import {
  Search,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Check
} from "lucide-react";


// Data used
const data = {
  Drivers: [
    { id: "D001", name: "John Doe", vehicle: "FK-001", date: "2025-11-19", checkIn: "06:00 AM", checkOut: "02:00 PM", status: "Present" },
    { id: "D002", name: "David Miller", vehicle: "FK-002", date: "2025-11-19", checkIn: "06:15 AM", checkOut: "02:10 PM", status: "Present" },
    { id: "D003", name: "Robert Brown", vehicle: "FK-003", date: "2025-11-19", checkIn: "-", checkOut: "-", status: "Absent" },
    { id: "D004", name: "Alice Davis", vehicle: "FL-002", date: "2025-11-19", checkIn: "-", checkOut: "-", status: "Absent" },
    { id: "D005", name: "Chris Wilson", vehicle: "FL-003", date: "2025-11-19", checkIn: "02:00 PM", checkOut: "-", status: "Present" },
    { id: "D006", name: "Daniel Lee", vehicle: "CR-001", date: "2025-11-19", checkIn: "06:05 AM", checkOut: "02:00 PM", status: "Present" },
    { id: "D007", name: "James Taylor", vehicle: "CR-002", date: "2025-11-19", checkIn: "-", checkOut: "-", status: "Absent" },
    { id: "D008", name: "Henry Moore", vehicle: "CR-003", date: "2025-11-19", checkIn: "02:05 PM", checkOut: "-", status: "Present" },
    { id: "D009", name: "William Clark", vehicle: "TR-001", date: "2025-11-19", checkIn: "06:00 AM", checkOut: "02:00 PM", status: "Present" },
    { id: "D010", name: "Joseph Hall", vehicle: "TR-002", date: "2025-11-19", checkIn: "-", checkOut: "-", status: "Absent" },
    { id: "D011", name: "Thomas Allen", vehicle: "TR-003", date: "2025-11-19", checkIn: "02:00 PM", checkOut: "-", status: "Present" },
    { id: "D012", name: "Mark Young", vehicle: "EX-001", date: "2025-11-19", checkIn: "06:20 AM", checkOut: "02:15 PM", status: "Present" },
    { id: "D013", name: "Paul Hernandez", vehicle: "EX-002", date: "2025-11-19", checkIn: "-", checkOut: "-", status: "Absent" },
    { id: "D014", name: "Kevin King", vehicle: "EX-003", date: "2025-11-19", checkIn: "02:10 PM", checkOut: "-", status: "Present" },
    { id: "D015", name: "Jason Wright", vehicle: "HD-001", date: "2025-11-19", checkIn: "06:00 AM", checkOut: "02:00 PM", status: "Present" },
  ],

  Supervisors: [
    { id: "S001", name: "Mike Smith", operation: "Fork", date: "2025-11-19", checkIn: "06:00 AM", checkOut: "02:00 PM", status: "Present" },
    { id: "S002", name: "Sarah Jones", operation: "Flap", date: "2025-11-19", checkIn: "02:00 PM", checkOut: "-", status: "Present" },
    { id: "S003", name: "Brian Scott", operation: "Crane", date: "2025-11-19", checkIn: "-", checkOut: "-", status: "Absent" },
    { id: "S004", name: "Nancy Adams", operation: "Transport", date: "2025-11-19", checkIn: "06:10 AM", checkOut: "02:00 PM", status: "Present" },
    { id: "S005", name: "Steven Baker", operation: "Excavator", date: "2025-11-19", checkIn: "02:00 PM", checkOut: "-", status: "Present" },
    { id: "S006", name: "Karen Nelson", operation: "Fork", date: "2025-11-19", checkIn: "-", checkOut: "-", status: "Absent" },
    { id: "S007", name: "George Carter", operation: "Crane", date: "2025-11-19", checkIn: "06:00 AM", checkOut: "02:00 PM", status: "Present" },
    { id: "S008", name: "Betty Mitchell", operation: "Transport", date: "2025-11-19", checkIn: "02:05 PM", checkOut: "-", status: "Present" },
    { id: "S009", name: "Edward Perez", operation: "Flap", date: "2025-11-19", checkIn: "-", checkOut: "-", status: "Absent" },
    { id: "S010", name: "Donna Roberts", operation: "Excavator", date: "2025-11-19", checkIn: "06:15 AM", checkOut: "02:00 PM", status: "Present" },
  ],

  Laborers: [
    { id: "L001", name: "Ali Khan", AssignedTo: "Fork", date: "2025-11-19", checkIn: "06:00 AM", checkOut: "02:00 PM", status: "Present" },
    { id: "L002", name: "Usman Shah", AssignedTo: "Crane", date: "2025-11-19", checkIn: "-", checkOut: "-", status: "Absent" },
    { id: "L003", name: "Ahmed Raza", AssignedTo: "Transport", date: "2025-11-19", checkIn: "02:00 PM", checkOut: "-", status: "Present" },
    { id: "L004", name: "Bilal Hussain", AssignedTo: "Flap", date: "2025-11-19", checkIn: "06:05 AM", checkOut: "02:00 PM", status: "Present" },
    { id: "L005", name: "Hassan Ali", AssignedTo: "Excavator", date: "2025-11-19", checkIn: "-", checkOut: "-", status: "Absent" },
    { id: "L006", name: "Zain Malik", AssignedTo: "Fork", date: "2025-11-19", checkIn: "02:00 PM", checkOut: "-", status: "Present" },
    { id: "L007", name: "Tariq Mehmood", AssignedTo: "Crane", date: "2025-11-19", checkIn: "06:00 AM", checkOut: "02:00 PM", status: "Present" },
    { id: "L008", name: "Imran Qureshi", AssignedTo: "Transport", date: "2025-11-19", checkIn: "-", checkOut: "-", status: "Absent" },
    { id: "L009", name: "Saad Ahmed", AssignedTo: "Flap", date: "2025-11-19", checkIn: "02:10 PM", checkOut: "-", status: "Present" },
    { id: "L010", name: "Fahad Iqbal", AssignedTo: "Excavator", date: "2025-11-19", checkIn: "06:00 AM", checkOut: "02:00 PM", status: "Present" },
    { id: "L011", name: "Shahbaz Ali", AssignedTo: "Fork", date: "2025-11-19", checkIn: "-", checkOut: "-", status: "Absent" },
    { id: "L012", name: "Rizwan Khan", AssignedTo: "Crane", date: "2025-11-19", checkIn: "02:00 PM", checkOut: "-", status: "Present" },
    { id: "L013", name: "Noman Tariq", AssignedTo: "Transport", date: "2025-11-19", checkIn: "06:00 AM", checkOut: "02:00 PM", status: "Present" },
    { id: "L014", name: "Yasir Mahmood", AssignedTo: "Flap", date: "2025-11-19", checkIn: "-", checkOut: "-", status: "Absent" },
    { id: "L015", name: "Hamza Siddiqui", AssignedTo: "Excavator", date: "2025-11-19", checkIn: "02:00 PM", checkOut: "-", status: "Present" },
  ],
};

const attendanceData = [
  {
    id: 1,
    title: "Driver Presents",
    present: 3,
    total: 4,
    color: "bg-orange-500",
  },
  {
    id: 2,
    title: "Supervisors Presents",
    present: 3,
    total: 4,
    color: "bg-blue-600",
  },
  {
    id: 3,
    title: "Laborers Presents",
    present: 3,
    total: 4,
    color: "bg-green-600",
  },
];



const Attendance = () => {
  return (
    <div className="mt-8">
    
      <AttendanceSummary />
      <AttendanceRecord />

    </div>
  );
};

export default Attendance;

//////////



const AttendanceRecord = () => {
  const [activeTab, setActiveTab] = useState("Drivers");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const attendanceData = data[activeTab];
  const filteredData = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return attendanceData;

    return attendanceData.filter((item) =>
      [
        item.id,
        item.name,
        item.vehicle,
        item.operation,
        item.AssignedTo,
        item.date,
        item.checkIn,
        item.checkOut,
        item.status,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [attendanceData, searchTerm]);

  const totalItems = filteredData.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);
  const showingFrom = totalItems > 0 ? startIndex + 1 : 0;
  const showingTo = totalItems > 0 ? Math.min(endIndex, totalItems) : 0;

  const maxVisiblePages = 4;
  const visibleStartPage = Math.max(
    1,
    Math.min(
      safeCurrentPage - Math.floor(maxVisiblePages / 2),
      totalPages - maxVisiblePages + 1,
    ),
  );
  const visibleEndPage = Math.min(
    totalPages,
    visibleStartPage + maxVisiblePages - 1,
  );
  const visiblePages = Array.from(
    { length: visibleEndPage - visibleStartPage + 1 },
    (_, index) => visibleStartPage + index,
  );

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="bg-gray-100 min-h-screen mt-6">
      <div className="bg-white rounded-2xl shadow-md">
        {/* Header */}
        <div className="flex justify-between p-6 items-center">
          <h2 className="text-xl font-semibold">Attendance Record</h2>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search
                className="absolute  left-3 top-2.5 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-9 pr-4 py-1 rounded-xl border bg-gray-100 border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <select className="px-4 py-2 rounded-lg border border-gray-200 ">
              <option>All Shifts</option>
              <option>Morning</option>
              <option>Evening</option>
              <option>Night</option>
            </select>
          </div>
        </div>

        {/* Tabs */}
        <div className="mx-6 mb-6">
          <div className="flex bg-gray-200 rounded-full p-1 w-full">
            {["Drivers", "Supervisors", "Laborers"].map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`flex-1 py-2 rounded-full text-sm font-medium transition-all ${
                  activeTab === tab
                    ? "bg-white shadow text-black"
                    : "text-gray-600"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className=" text-gray-600">
                <th className="py-4 px-6">ID</th>
                <th>Name</th>
                <th>{activeTab === "Drivers" ? "Vehicle" : "Assigned To"}</th>
                <th>Date</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {paginatedData.map((item, index) => (
                <tr
                  key={index}
                  // className="border-b border-gray-200 hover:bg-gray-50 transition"
                  className="border-b border-gray-300 odd:bg-gray-100 even:bg-white hover:bg-gray-200 transition"
                >
                  <td className="py-5 px-6 text-gray-600 font-medium">
                    {item.id}
                  </td>

                  <td>{item.name}</td>

                  {/* Vehicle / Operation Pill */}
                  <td>
                    <span className="px-3 py-1 bg-gray-100 border border-gray-300 rounded-full text-xs">
                      {item.vehicle || item.operation || item.AssignedTo}
                    </span>
                  </td>

                  <td className="text-gray-600">{item.date}</td>

                  {/* Check In */}
                  <td>
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-gray-400" />
                      {item.checkIn}
                    </div>
                  </td>

                  {/* Check Out */}
                  <td>
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-gray-400" />
                      {item.checkOut}
                    </div>
                  </td>

                  {/* Status */}
                  <td>
                    {item.status === "Present" ? (
                      <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium w-fit">
                        <CheckCircle2 size={14} />
                        Present
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 text-red-600 text-xs font-medium w-fit">
                        <XCircle size={14} />
                        Absent
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-6">
          <p className="text-sm text-gray-500">
            Showing <span className="font-semibold">{showingFrom}-{showingTo}</span>{" "}
            from <span className="font-semibold">{totalItems}</span> data
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handlePageChange(safeCurrentPage - 1)}
              disabled={safeCurrentPage === 1}
              className="p-2 rounded-xl border border-gray-300 disabled:opacity-50"
            >
              <ChevronLeft size={16} />
            </button>

            {visiblePages.map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => handlePageChange(page)}
                className={`w-9 h-9 rounded-2xl text-sm ${
                  safeCurrentPage === page
                    ? "bg-blue-600 text-white"
                    : "border border-gray-300 text-gray-600"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              onClick={() => handlePageChange(safeCurrentPage + 1)}
              disabled={safeCurrentPage === totalPages}
              className="p-2 rounded-xl border border-gray-300 disabled:opacity-50"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


/////////////


const AttendanceCard = ({ title, present, total, color }) => {
  const percentage = Math.round((present / total) * 100);

  return (
    <div className="bg-white rounded-2xl p-6  flex items-center justify-between w-80 shadow-md hover:shadow-lg ">
      {/* Left Side */}
      <div>
        <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
        <p className="text-xl font-semibold text-gray-800 mt-1">
          {present}/{total}
        </p>
        <p className="text-green-500 text-sm mt-1">
          {percentage}% Attendance
        </p>
      </div>

      {/* Right Icon */}
      <div className={`w-12 h-12 flex items-center justify-center rounded-xl ${color}`}>
        <Check className="text-white w-6 h-6" />
      </div>
    </div>
  );
};

 function AttendanceSummary() {
  return (
    <div className="flex  gap-4  flex-wrap">
      {attendanceData.map((item) => (
        <AttendanceCard
          key={item.id}
          title={item.title}
          present={item.present}
          total={item.total}
          color={item.color}
        />
      ))}
    </div>
  );
}