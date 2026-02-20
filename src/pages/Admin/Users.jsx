import { useMemo, useState } from "react";
import { Search, MoreVertical } from "lucide-react";


const Users = () => {
  return (
    <div className="mt-8">
      <UserManagement />
    </div>
  )
}

export default Users



 function UserManagement() {
  const [activeTab, setActiveTab] = useState("Drivers");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const users = [
    {
      id: "D002",
      name: "Jane Wilson",
      phone: "+923423215548",
      shift: "Evening",
      vehicle: "Fork",
      status: "Off Duty",
    },
    {
      id: "D003",
      name: "Sarah Jones",
      phone: "+923423215548",
      shift: "Morning",
      vehicle: "Fork",
      status: "Off Duty",
    },
    {
      id: "D001",
      name: "Lisa Wang",
      phone: "+923423215548",
      shift: "Night",
      vehicle: "Flap",
      status: "On Duty",
    },
    {
      id: "D004",
      name: "Emma Wilson",
      phone: "+923423215548",
      shift: "Morning",
      vehicle: "MT",
      status: "On Duty",
    },
  ];

  const allUsers = useMemo(() => [...users, ...users, ...users], [users]);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return allUsers;

    return allUsers.filter((user) =>
      [user.id, user.name, user.phone, user.shift, user.vehicle, user.status]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [allUsers, search]);

  const totalItems = filteredUsers.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
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

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setCurrentPage(1);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-2">
      <div className="bg-white rounded-3xl shadow-sm">

        {/* ================= HEADER ================= */}
        <div className="flex justify-between p-5 items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            User Management
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
              + Add User
            </button>
          </div>
        </div>

        {/* ================= TOGGLE ================= */}
        <div className=" px-6 pb-4">
          <div className="bg-gray-200  rounded-full flex shadow-md  w-80 h-12">
            {["Drivers", "Supervisors"].map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`flex-1 py-2 text-sm font-semibold rounded-full transition ${
                  activeTab === tab
                    ? "bg-white shadow text-gray-800"
                    : "text-gray-800"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* ================= TABLE ================= */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 text-left border-b border-gray-300">
                <th className="py-3 px-6">ID</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Shift</th>
                <th>
                  {activeTab === "Drivers" ? "Vehicle" : "Operations"}
                </th>
                <th>Status</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {paginatedUsers.map((user, index) => (
                <tr
                  key={`${user.id}-${startIndex + index}`}
                  className="border-b border-gray-300 odd:bg-gray-100 even:bg-white hover:bg-gray-200 transition"
                >
                  <td className="py-4 px-6 font-medium text-gray-700">
                    {user.id}
                  </td>

                  {/* Name */}
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gray-300"></div>
                      <span className="font-medium text-gray-700">
                        {user.name}
                      </span>
                    </div>
                  </td>

                  <td>{user.phone}</td>
                  <td>{user.shift}</td>
                  <td>{user.vehicle}</td>

                  {/* Status */}
                  <td>
                    <span
                      className={`px-4 py-1 rounded-lg text-xs font-medium border ${
                        user.status === "On Duty"
                          ? "border-green-500 text-green-600 bg-green-50"
                          : "border-red-500 text-red-500 bg-red-50"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="text-center">
                    <button className="p-2 hover:bg-gray-200 rounded-lg">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ================= FOOTER ================= */}
        <div className="flex justify-between items-center p-6 text-sm text-gray-600">
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
