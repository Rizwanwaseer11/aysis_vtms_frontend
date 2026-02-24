import { useEffect, useMemo, useState } from "react";
import {
  Camera,
  TrendingUp,
  MapPin,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// Data
const operationsData = [
  {
    id: 1,
    title: "Gate Operations",
    value: "06",
    icon: Camera,
    color: "bg-orange-500",
  },
  {
    id: 2,
    title: "Flap Operations",
    value: "65",
    icon: TrendingUp,
    color: "bg-blue-600",
  },
  {
    id: 3,
    title: "Fork Operations",
    value: "180",
    icon: TrendingUp,
    color: "bg-purple-600",
  },
  {
    id: 4,
    title: "GTS Operations",
    value: "15",
    icon: MapPin,
    color: "bg-green-600",
  },
  {
    id: 5,
    title: "Arm Roller Operations",
    value: "09",
    icon: TrendingUp,
    color: "bg-orange-500",
  },
  {
    id: 6,
    title: "Bulk Operations",
    value: "24",
    icon: TrendingUp,
    color: "bg-purple-600",
  },
  {
    id: 7,
    title: "GTS-Landfill Operations",
    value: "16",
    icon: TrendingUp,
    color: "bg-blue-600",
  },
];

const binsData = [
  {
    id: "B-001",
    zone: "Zone-01",
    uc: "UC-01",
    ward: "Ward-01",
    checkIn: "10:30 AM",
    checkOut: "09:30 AM",
  },
  {
    id: "B-002",
    zone: "Zone-02",
    uc: "UC-02",
    ward: "Ward-02",
    checkIn: "10:20 PM",
    checkOut: "09:30 PM",
  },
  {
    id: "B-003",
    zone: "Zone-03",
    uc: "UC-03",
    ward: "Ward-01",
    checkIn: "09:30 AM",
    checkOut: "11:00 AM",
  },
  {
    id: "B-004",
    zone: "Zone-04",
    uc: "UC-01",
    ward: "Ward-01",
    checkIn: "09:00 PM",
    checkOut: "09:00 PM",
  },
  {
    id: "B-005",
    zone: "Zone-05",
    uc: "UC-01",
    ward: "Ward-01",
    checkIn: "11:00 AM",
    checkOut: "11:00 AM",
  },
  {
    id: "B-006",
    zone: "Zone-06",
    uc: "UC-01",
    ward: "Ward-03",
    checkIn: "09:00 PM",
    checkOut: "09:00 PM",
  },
  {
    id: "B-007",
    zone: "Zone-07",
    uc: "UC-01",
    ward: "Ward-02",
    checkIn: "11:00 AM",
    checkOut: "11:00 AM",
  },
];

// Main

const Bins = () => {
  return (
    <div className="mt-8 ">
      <OperationsSummary />
      <BinsDetail />
    </div>
  );
};

export default Bins;

// OperationCard

const OperationCard = ({ title, value, icon: Icon, color }) => {
  return (
    <div className="flex items-center gap-4">
      {/* Icon */}
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}
      >
        <Icon className="text-white w-6 h-6" />
      </div>

      {/* Text */}
      <div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <h2 className="text-2xl font-semibold text-gray-800">{value}</h2>
      </div>
    </div>
  );
};

function OperationsSummary() {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-md">
      <div className="grid grid-cols-4 gap-y-10 gap-x-16">
        {operationsData.map((item) => (
          <OperationCard
            key={item.id}
            title={item.title}
            value={item.value}
            icon={item.icon}
            color={item.color}
          />
        ))}
      </div>
    </div>
  );
}

// BinsDetail Table

function BinsDetail() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredData = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return binsData;

    return binsData.filter((item) =>
      [item.id, item.zone, item.uc, item.ward, item.checkIn, item.checkOut]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [search]);

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

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className=" min-h-screen flex items-center justify-center">
      <div className="bg-white w-full max-w-6xl rounded-3xl mt-6 shadow">
        {/* Header */}
        <div className="flex justify-between items-center p-6 mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Bins Detail</h2>

          <div className="flex gap-4 items-center">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                className="pl-9 pr-4 py-2 rounded-xl bg-gray-200 text-sm outline-none"
                value={search}
                onChange={handleSearchChange}
              />
            </div>

            {/* Dropdown */}
            <select className="bg-black text-white px-4 py-2 rounded-xl text-sm">
              <option>Default</option>
              <option>Latest</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className=" text-gray-700">
              <tr>
                <th className="p-4">Bins ID</th>
                <th className="p-4">Zones</th>
                <th className="p-4">Union Councils</th>
                <th className="p-4">Wards</th>
                <th className="p-4">Check-In</th>
                <th className="p-4">Check-Out</th>
              </tr>
            </thead>

            <tbody>
              {paginatedData.map((bin) => (
                <tr
                  key={bin.id}
                  className="even:bg-white odd:bg-gray-100 hover:bg-gray-200"
                >
                  <td className="p-4">{bin.id}</td>
                  <td className="p-4">{bin.zone}</td>
                  <td className="p-4">{bin.uc}</td>
                  <td className="p-4">{bin.ward}</td>

                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                      {bin.checkIn}
                    </div>
                  </td>

                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                      {bin.checkOut}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center mt-6 text-sm p-6 text-gray-600">
          <p>
            Showing <span className="font-semibold">{showingFrom}-{showingTo}</span>{" "}
            from <span className="font-semibold">{totalItems}</span> data
          </p>

          {/* Pagination */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handlePageChange(safeCurrentPage - 1)}
              disabled={safeCurrentPage === 1}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 disabled:opacity-50"
            >
              <ChevronLeft size={16} />
            </button>

            {visiblePages.map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => handlePageChange(page)}
                className={`w-8 h-8 rounded-lg ${
                  safeCurrentPage === page
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              onClick={() => handlePageChange(safeCurrentPage + 1)}
              disabled={safeCurrentPage === totalPages}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 disabled:opacity-50"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
