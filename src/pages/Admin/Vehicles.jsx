import { useMemo, useState } from "react";
import { Search, MoreVertical, Shield } from "lucide-react";

const Vehicles = () => {
  return (
    <div className="mt-8 ">
      <VehicleManagement />
    </div>
  );
};

export default Vehicles;

const vehiclesData = [
  {
    id: "FK-002",
    type: "Fork",
    driver: "Jane Wilson",
    driverCode: "D001",
    supervisor: "Ali Khan",
    supervisorCode: "S001",
    shift: "Evening",
    trips: 12,
    status: "Inactive",
  },
  {
    id: "FK-003",
    type: "Fork",
    driver: "Sarah Jones",
    driverCode: "D002",
    supervisor: "Ali Khan",
    supervisorCode: "S001",
    shift: "Morning",
    trips: 20,
    status: "Inactive",
  },
  {
    id: "FL-001",
    type: "Flap",
    driver: "Lisa Wang",
    driverCode: "D003",
    supervisor: "Usman Tariq",
    supervisorCode: "S003",
    shift: "Night",
    trips: 0,
    status: "Active",
  },
  {
    id: "MT-001",
    type: "MT",
    driver: "Ahmed Raza",
    driverCode: "D004",
    supervisor: "Bilal Ahmed",
    supervisorCode: "S004",
    shift: "Evening",
    trips: 3,
    status: "Active",
  },

  {
    id: "FK-004",
    type: "Fork",
    driver: "John Smith",
    driverCode: "D005",
    supervisor: "Ali Khan",
    supervisorCode: "S001",
    shift: "Morning",
    trips: 15,
    status: "Active",
  },
  {
    id: "FL-002",
    type: "Flap",
    driver: "Emily Brown",
    driverCode: "D006",
    supervisor: "Usman Tariq",
    supervisorCode: "S003",
    shift: "Evening",
    trips: 9,
    status: "Inactive",
  },
  {
    id: "MT-002",
    type: "MT",
    driver: "David Lee",
    driverCode: "D007",
    supervisor: "Bilal Ahmed",
    supervisorCode: "S004",
    shift: "Night",
    trips: 18,
    status: "Active",
  },
  {
    id: "FK-005",
    type: "Fork",
    driver: "Michael Scott",
    driverCode: "D008",
    supervisor: "Ali Khan",
    supervisorCode: "S001",
    shift: "Morning",
    trips: 22,
    status: "Active",
  },
  {
    id: "FL-003",
    type: "Flap",
    driver: "Olivia Davis",
    driverCode: "D009",
    supervisor: "Usman Tariq",
    supervisorCode: "S003",
    shift: "Evening",
    trips: 6,
    status: "Inactive",
  },
  {
    id: "MT-003",
    type: "MT",
    driver: "Daniel Kim",
    driverCode: "D010",
    supervisor: "Bilal Ahmed",
    supervisorCode: "S004",
    shift: "Night",
    trips: 11,
    status: "Active",
  },

  {
    id: "FK-006",
    type: "Fork",
    driver: "Sophia Miller",
    driverCode: "D011",
    supervisor: "Ali Khan",
    supervisorCode: "S001",
    shift: "Morning",
    trips: 7,
    status: "Inactive",
  },
  {
    id: "FL-004",
    type: "Flap",
    driver: "James Wilson",
    driverCode: "D012",
    supervisor: "Usman Tariq",
    supervisorCode: "S003",
    shift: "Evening",
    trips: 14,
    status: "Active",
  },
  {
    id: "MT-004",
    type: "MT",
    driver: "Isabella Moore",
    driverCode: "D013",
    supervisor: "Bilal Ahmed",
    supervisorCode: "S004",
    shift: "Night",
    trips: 5,
    status: "Inactive",
  },
  {
    id: "FK-007",
    type: "Fork",
    driver: "Ethan Clark",
    driverCode: "D014",
    supervisor: "Ali Khan",
    supervisorCode: "S001",
    shift: "Morning",
    trips: 19,
    status: "Active",
  },
  {
    id: "FL-005",
    type: "Flap",
    driver: "Mia Taylor",
    driverCode: "D015",
    supervisor: "Usman Tariq",
    supervisorCode: "S003",
    shift: "Evening",
    trips: 8,
    status: "Active",
  },
  {
    id: "MT-005",
    type: "MT",
    driver: "Noah Martinez",
    driverCode: "D016",
    supervisor: "Bilal Ahmed",
    supervisorCode: "S004",
    shift: "Night",
    trips: 2,
    status: "Inactive",
  },

  {
    id: "FK-008",
    type: "Fork",
    driver: "Ava Anderson",
    driverCode: "D017",
    supervisor: "Ali Khan",
    supervisorCode: "S001",
    shift: "Morning",
    trips: 25,
    status: "Active",
  },
  {
    id: "FL-006",
    type: "Flap",
    driver: "William Thomas",
    driverCode: "D018",
    supervisor: "Usman Tariq",
    supervisorCode: "S003",
    shift: "Evening",
    trips: 4,
    status: "Inactive",
  },
  {
    id: "MT-006",
    type: "MT",
    driver: "Charlotte Jackson",
    driverCode: "D019",
    supervisor: "Bilal Ahmed",
    supervisorCode: "S004",
    shift: "Night",
    trips: 16,
    status: "Active",
  },
  {
    id: "FK-009",
    type: "Fork",
    driver: "Benjamin White",
    driverCode: "D020",
    supervisor: "Ali Khan",
    supervisorCode: "S001",
    shift: "Morning",
    trips: 13,
    status: "Active",
  },
  {
    id: "FL-007",
    type: "Flap",
    driver: "Amelia Harris",
    driverCode: "D021",
    supervisor: "Usman Tariq",
    supervisorCode: "S003",
    shift: "Evening",
    trips: 10,
    status: "Inactive",
  },
  {
    id: "MT-007",
    type: "MT",
    driver: "Lucas Martin",
    driverCode: "D022",
    supervisor: "Bilal Ahmed",
    supervisorCode: "S004",
    shift: "Night",
    trips: 21,
    status: "Active",
  },

  {
    id: "FK-010",
    type: "Fork",
    driver: "Harper Thompson",
    driverCode: "D023",
    supervisor: "Ali Khan",
    supervisorCode: "S001",
    shift: "Morning",
    trips: 17,
    status: "Inactive",
  },
  {
    id: "FL-008",
    type: "Flap",
    driver: "Elijah Garcia",
    driverCode: "D024",
    supervisor: "Usman Tariq",
    supervisorCode: "S003",
    shift: "Evening",
    trips: 9,
    status: "Active",
  },
  {
    id: "MT-008",
    type: "MT",
    driver: "Evelyn Martinez",
    driverCode: "D025",
    supervisor: "Bilal Ahmed",
    supervisorCode: "S004",
    shift: "Night",
    trips: 1,
    status: "Inactive",
  },
  {
    id: "FK-011",
    type: "Fork",
    driver: "Henry Robinson",
    driverCode: "D026",
    supervisor: "Ali Khan",
    supervisorCode: "S001",
    shift: "Morning",
    trips: 23,
    status: "Active",
  },
  {
    id: "FL-009",
    type: "Flap",
    driver: "Abigail Lewis",
    driverCode: "D027",
    supervisor: "Usman Tariq",
    supervisorCode: "S003",
    shift: "Evening",
    trips: 6,
    status: "Active",
  },
  {
    id: "MT-009",
    type: "MT",
    driver: "Alexander Walker",
    driverCode: "D028",
    supervisor: "Bilal Ahmed",
    supervisorCode: "S004",
    shift: "Night",
    trips: 12,
    status: "Inactive",
  },
  {
    id: "FK-012",
    type: "Fork",
    driver: "Scarlett Hall",
    driverCode: "D029",
    supervisor: "Ali Khan",
    supervisorCode: "S001",
    shift: "Morning",
    trips: 18,
    status: "Active",
  },
  {
    id: "FL-010",
    type: "Flap",
    driver: "Jack Allen",
    driverCode: "D030",
    supervisor: "Usman Tariq",
    supervisorCode: "S003",
    shift: "Evening",
    trips: 7,
    status: "Inactive",
  },
  {
    id: "FK-010",
    type: "Fork",
    driver: "Harper Thompson",
    driverCode: "D023",
    supervisor: "Ali Khan",
    supervisorCode: "S001",
    shift: "Morning",
    trips: 17,
    status: "Inactive",
  },
  {
    id: "FL-008",
    type: "Flap",
    driver: "Elijah Garcia",
    driverCode: "D024",
    supervisor: "Usman Tariq",
    supervisorCode: "S003",
    shift: "Evening",
    trips: 9,
    status: "Active",
  },
  {
    id: "MT-008",
    type: "MT",
    driver: "Evelyn Martinez",
    driverCode: "D025",
    supervisor: "Bilal Ahmed",
    supervisorCode: "S004",
    shift: "Night",
    trips: 1,
    status: "Inactive",
  },
  {
    id: "FK-011",
    type: "Fork",
    driver: "Henry Robinson",
    driverCode: "D026",
    supervisor: "Ali Khan",
    supervisorCode: "S001",
    shift: "Morning",
    trips: 23,
    status: "Active",
  },
  {
    id: "FL-009",
    type: "Flap",
    driver: "Abigail Lewis",
    driverCode: "D027",
    supervisor: "Usman Tariq",
    supervisorCode: "S003",
    shift: "Evening",
    trips: 6,
    status: "Active",
  },
  {
    id: "MT-009",
    type: "MT",
    driver: "Alexander Walker",
    driverCode: "D028",
    supervisor: "Bilal Ahmed",
    supervisorCode: "S004",
    shift: "Night",
    trips: 12,
    status: "Inactive",
  },
  {
    id: "FK-012",
    type: "Fork",
    driver: "Scarlett Hall",
    driverCode: "D029",
    supervisor: "Ali Khan",
    supervisorCode: "S001",
    shift: "Morning",
    trips: 18,
    status: "Active",
  },
  {
    id: "FL-010",
    type: "Flap",
    driver: "Jack Allen",
    driverCode: "D030",
    supervisor: "Usman Tariq",
    supervisorCode: "S003",
    shift: "Evening",
    trips: 7,
    status: "Inactive",
  },
  {
    id: "FK-010",
    type: "Fork",
    driver: "Harper Thompson",
    driverCode: "D023",
    supervisor: "Ali Khan",
    supervisorCode: "S001",
    shift: "Morning",
    trips: 17,
    status: "Inactive",
  },
  {
    id: "FL-008",
    type: "Flap",
    driver: "Elijah Garcia",
    driverCode: "D024",
    supervisor: "Usman Tariq",
    supervisorCode: "S003",
    shift: "Evening",
    trips: 9,
    status: "Active",
  },
  {
    id: "MT-008",
    type: "MT",
    driver: "Evelyn Martinez",
    driverCode: "D025",
    supervisor: "Bilal Ahmed",
    supervisorCode: "S004",
    shift: "Night",
    trips: 1,
    status: "Inactive",
  },
  {
    id: "FK-011",
    type: "Fork",
    driver: "Henry Robinson",
    driverCode: "D026",
    supervisor: "Ali Khan",
    supervisorCode: "S001",
    shift: "Morning",
    trips: 23,
    status: "Active",
  },
  {
    id: "FL-009",
    type: "Flap",
    driver: "Abigail Lewis",
    driverCode: "D027",
    supervisor: "Usman Tariq",
    supervisorCode: "S003",
    shift: "Evening",
    trips: 6,
    status: "Active",
  },
  {
    id: "MT-009",
    type: "MT",
    driver: "Alexander Walker",
    driverCode: "D028",
    supervisor: "Bilal Ahmed",
    supervisorCode: "S004",
    shift: "Night",
    trips: 12,
    status: "Inactive",
  },
  {
    id: "FK-012",
    type: "Fork",
    driver: "Scarlett Hall",
    driverCode: "D029",
    supervisor: "Ali Khan",
    supervisorCode: "S001",
    shift: "Morning",
    trips: 18,
    status: "Active",
  },
  {
    id: "FL-010",
    type: "Flap",
    driver: "Jack Allen",
    driverCode: "D030",
    supervisor: "Usman Tariq",
    supervisorCode: "S003",
    shift: "Evening",
    trips: 7,
    status: "Inactive",
  },
];

function VehicleManagement() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredVehicles = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return vehiclesData;

    return vehiclesData.filter((vehicle) =>
      [
        vehicle.id,
        vehicle.type,
        vehicle.driver,
        vehicle.driverCode,
        vehicle.supervisor,
        vehicle.supervisorCode,
        vehicle.shift,
        vehicle.status,
        String(vehicle.trips),
      ]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [search]);

  const totalItems = filteredVehicles.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedVehicles = filteredVehicles.slice(startIndex, endIndex);
  const showingFrom = totalItems > 0 ? startIndex + 1 : 0;
  const showingTo = totalItems > 0 ? Math.min(endIndex, totalItems) : 0;

  const visiblePages = useMemo(() => {
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

    return Array.from(
      { length: visibleEndPage - visibleStartPage + 1 },
      (_, index) => visibleStartPage + index,
    );
  }, [safeCurrentPage, totalPages]);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen">
      <div className="bg-white rounded-3xl shadow-sm ">
        {/* Header */}
        <div className="flex justify-between p-6 items-center mb-3">
          <h2 className="text-xl font-semibold text-gray-800">
            Vehicle Management
          </h2>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={handleSearchChange}
                className="pl-9 pr-4 py-2 rounded-xl bg-gray-100 text-sm focus:outline-none"
              />
            </div>

            {/* Add Button */}
            <button className="bg-black text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-800 transition">
              + Add Vehicle
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto  ">
          <table className="w-full  text-sm">
            <thead>
              <tr className="text-gray-500 text-left   ">
                <th className="py-3 px-4">Vehicles ID</th>
                <th>Type</th>
                <th className="px-8">Driver</th>
                <th>Supervisor</th>
                <th>Shift</th>
                <th>Today’s Trips</th>
                <th>Status</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {paginatedVehicles.map((vehicle, index) => (
                <tr
                  key={index}
                  className={`
          transition
        ${index % 2 === 0 ? "bg-gray-100" : "bg-white"}
        hover:bg-gray-200
      `}
                >
                  <td className="py-5 px-4 font-medium text-gray-700">
                    {vehicle.id}
                  </td>

                  <td>{vehicle.type}</td>

                  {/* Driver */}
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gray-200"></div>
                      <div>
                        <p className="font-medium text-gray-700">
                          {vehicle.driver}
                        </p>
                        <p className="text-xs text-gray-400">
                          {vehicle.driverCode}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Supervisor */}
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gray-200"></div>
                      <div>
                        <p className="font-medium text-gray-700">
                          {vehicle.supervisor}
                        </p>
                        <p className="text-xs text-gray-400">
                          {vehicle.supervisorCode}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td>{vehicle.shift}</td>
                  <td>{vehicle.trips}</td>

                  {/* Status */}
                  <td>
                    <span
                      className={`px-4 py-1 rounded-lg text-xs font-medium border ${
                        vehicle.status === "Active"
                          ? "border-green-500 text-green-600 bg-green-50"
                          : "border-red-500 text-red-500 bg-red-50"
                      }`}
                    >
                      {vehicle.status}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="text-center">
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* ================= FOOTER ================= */}
        <div className="flex justify-between items-center p-6 mt-6 text-sm text-gray-600">
          <p>
            Showing {showingFrom}-{showingTo} from {totalItems} data
          </p>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => handlePageChange(safeCurrentPage - 1)}
              disabled={safeCurrentPage === 1}
              className="w-8 h-8 rounded-full border border-gray-300 disabled:opacity-50"
            >
              &lt;
            </button>

            {visiblePages.map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => handlePageChange(page)}
                className={`w-8 h-8 rounded-lg border ${
                  safeCurrentPage === page
                    ? "bg-blue-600 text-white border-blue-600"
                    : "border-gray-300"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              onClick={() => handlePageChange(safeCurrentPage + 1)}
              disabled={safeCurrentPage === totalPages}
              className="w-8 h-8 rounded-full border border-gray-300 disabled:opacity-50"
            >
              &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
