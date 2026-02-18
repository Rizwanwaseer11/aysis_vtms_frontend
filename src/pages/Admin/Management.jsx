import React, { useState } from "react";
import {
  ShieldCheck,
  Users,
  UserCheck,
  Search,
  MoreVertical,
  Shield,
  Trash2,
} from "lucide-react";

const Management = () => {
  return (
    <div>
      <DashboardStats />
      <ManagementUsers />
    </div>
  );
};

export default Management;

const ManagementUsers = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const designations = [
    { title: "Ops Manager", level: "Senior" },
    { title: "Fleet Supervisor", level: "Mid" },
    { title: "HR Manager", level: "Senior" },
    { title: "Data Analyst", level: "Junior" },
  ];

  const users = [
    {
      id: "MG001",
      name: "Jane Wilson",
      email: "jane@vtms.com",
      designation: "Operations Manager",
      permissions: 6,
    },
    {
      id: "MG002",
      name: "Maria Garcia",
      email: "maria@vtms.com",
      designation: "Fleet Supervisor",
      permissions: 3,
    },
    {
      id: "MG003",
      name: "Sarah Jones",
      email: "sarah@vtms.com",
      designation: "HR Manager",
      permissions: 3,
    },
    {
      id: "MG004",
      name: "John Smith",
      email: "john@vtms.com",
      designation: "Driver",
      permissions: 2,
    },
    {
      id: "MG005",
      name: "Emily Davis",
      email: "emily@vtms.com",
      designation: "Dispatcher",
      permissions: 4,
    },
    {
      id: "MG006",
      name: "Michael Brown",
      email: "michael@vtms.com",
      designation: "Mechanic",
      permissions: 3,
    },
    {
      id: "MG007",
      name: "Linda Johnson",
      email: "linda@vtms.com",
      designation: "Accountant",
      permissions: 5,
    },
    {
      id: "MG008",
      name: "Robert Miller",
      email: "robert@vtms.com",
      designation: "Fleet Manager",
      permissions: 6,
    },
    {
      id: "MG009",
      name: "Patricia Wilson",
      email: "patricia@vtms.com",
      designation: "HR Assistant",
      permissions: 2,
    },
    {
      id: "MG010",
      name: "James Taylor",
      email: "james@vtms.com",
      designation: "Driver",
      permissions: 1,
    },
    {
      id: "MG011",
      name: "Barbara Anderson",
      email: "barbara@vtms.com",
      designation: "Dispatcher",
      permissions: 3,
    },
    {
      id: "MG012",
      name: "William Thomas",
      email: "william@vtms.com",
      designation: "Mechanic",
      permissions: 4,
    },
    {
      id: "MG013",
      name: "Elizabeth Jackson",
      email: "elizabeth@vtms.com",
      designation: "Fleet Supervisor",
      permissions: 5,
    },
    {
      id: "MG014",
      name: "Richard White",
      email: "richard@vtms.com",
      designation: "Operations Manager",
      permissions: 6,
    },
    {
      id: "MG015",
      name: "Susan Harris",
      email: "susan@vtms.com",
      designation: "HR Manager",
      permissions: 3,
    },
    {
      id: "MG016",
      name: "Joseph Martin",
      email: "joseph@vtms.com",
      designation: "Driver",
      permissions: 2,
    },
    {
      id: "MG017",
      name: "Margaret Thompson",
      email: "margaret@vtms.com",
      designation: "Dispatcher",
      permissions: 4,
    },
    {
      id: "MG018",
      name: "Charles Garcia",
      email: "charles@vtms.com",
      designation: "Mechanic",
      permissions: 3,
    },
    {
      id: "MG019",
      name: "Karen Martinez",
      email: "karen@vtms.com",
      designation: "Fleet Manager",
      permissions: 6,
    },
    {
      id: "MG020",
      name: "Daniel Robinson",
      email: "daniel@vtms.com",
      designation: "Driver",
      permissions: 1,
    },
    {
      id: "MG021",
      name: "Nancy Clark",
      email: "nancy@vtms.com",
      designation: "HR Assistant",
      permissions: 2,
    },
    {
      id: "MG022",
      name: "Matthew Rodriguez",
      email: "matthew@vtms.com",
      designation: "Dispatcher",
      permissions: 3,
    },
    {
      id: "MG023",
      name: "Lisa Lewis",
      email: "lisa@vtms.com",
      designation: "Mechanic",
      permissions: 4,
    },
    {
      id: "MG024",
      name: "Anthony Lee",
      email: "anthony@vtms.com",
      designation: "Fleet Supervisor",
      permissions: 5,
    },
    {
      id: "MG025",
      name: "Betty Walker",
      email: "betty@vtms.com",
      designation: "Operations Manager",
      permissions: 6,
    },
    {
      id: "MG026",
      name: "Mark Hall",
      email: "mark@vtms.com",
      designation: "HR Manager",
      permissions: 3,
    },
    {
      id: "MG027",
      name: "Sandra Allen",
      email: "sandra@vtms.com",
      designation: "Driver",
      permissions: 2,
    },
    {
      id: "MG028",
      name: "Steven Young",
      email: "steven@vtms.com",
      designation: "Dispatcher",
      permissions: 4,
    },
    {
      id: "MG029",
      name: "Donna Hernandez",
      email: "donna@vtms.com",
      designation: "Mechanic",
      permissions: 3,
    },
    {
      id: "MG030",
      name: "Paul King",
      email: "paul@vtms.com",
      designation: "Fleet Manager",
      permissions: 6,
    },
    {
      id: "MG031",
      name: "Carol Wright",
      email: "carol@vtms.com",
      designation: "HR Assistant",
      permissions: 2,
    },
    {
      id: "MG032",
      name: "Kevin Lopez",
      email: "kevin@vtms.com",
      designation: "Driver",
      permissions: 1,
    },
    {
      id: "MG033",
      name: "Michelle Hill",
      email: "michelle@vtms.com",
      designation: "Dispatcher",
      permissions: 3,
    },
    {
      id: "MG034",
      name: "Brian Scott",
      email: "brian@vtms.com",
      designation: "Mechanic",
      permissions: 4,
    },
    {
      id: "MG035",
      name: "Emily Green",
      email: "emilyg@vtms.com",
      designation: "Fleet Supervisor",
      permissions: 5,
    },
    {
      id: "MG036",
      name: "Jason Adams",
      email: "jason@vtms.com",
      designation: "Operations Manager",
      permissions: 6,
    },
    {
      id: "MG037",
      name: "Laura Baker",
      email: "laura@vtms.com",
      designation: "HR Manager",
      permissions: 3,
    },
    {
      id: "MG038",
      name: "Gary Gonzalez",
      email: "gary@vtms.com",
      designation: "Driver",
      permissions: 2,
    },
    {
      id: "MG039",
      name: "Deborah Nelson",
      email: "deborah@vtms.com",
      designation: "Dispatcher",
      permissions: 4,
    },
    {
      id: "MG040",
      name: "Frank Carter",
      email: "frank@vtms.com",
      designation: "Mechanic",
      permissions: 3,
    },
    {
      id: "MG041",
      name: "Sharon Mitchell",
      email: "sharon@vtms.com",
      designation: "Fleet Manager",
      permissions: 6,
    },
    {
      id: "MG042",
      name: "Justin Perez",
      email: "justin@vtms.com",
      designation: "Driver",
      permissions: 1,
    },
    {
      id: "MG043",
      name: "Rebecca Roberts",
      email: "rebecca@vtms.com",
      designation: "HR Assistant",
      permissions: 2,
    },
    {
      id: "MG044",
      name: "Eric Turner",
      email: "eric@vtms.com",
      designation: "Dispatcher",
      permissions: 3,
    },
    {
      id: "MG045",
      name: "Cynthia Phillips",
      email: "cynthia@vtms.com",
      designation: "Mechanic",
      permissions: 4,
    },
    {
      id: "MG046",
      name: "Patrick Campbell",
      email: "patrick@vtms.com",
      designation: "Fleet Supervisor",
      permissions: 5,
    },
    {
      id: "MG034",
      name: "Brian Scott",
      email: "brian@vtms.com",
      designation: "Mechanic",
      permissions: 4,
    },
    {
      id: "MG035",
      name: "Emily Green",
      email: "emilyg@vtms.com",
      designation: "Fleet Supervisor",
      permissions: 5,
    },
    {
      id: "MG036",
      name: "Jason Adams",
      email: "jason@vtms.com",
      designation: "Operations Manager",
      permissions: 6,
    },
    {
      id: "MG037",
      name: "Laura Baker",
      email: "laura@vtms.com",
      designation: "HR Manager",
      permissions: 3,
    },
    {
      id: "MG038",
      name: "Gary Gonzalez",
      email: "gary@vtms.com",
      designation: "Driver",
      permissions: 2,
    },
    {
      id: "MG039",
      name: "Deborah Nelson",
      email: "deborah@vtms.com",
      designation: "Dispatcher",
      permissions: 4,
    },
    {
      id: "MG040",
      name: "Frank Carter",
      email: "frank@vtms.com",
      designation: "Mechanic",
      permissions: 3,
    },
    {
      id: "MG041",
      name: "Sharon Mitchell",
      email: "sharon@vtms.com",
      designation: "Fleet Manager",
      permissions: 6,
    },
    {
      id: "MG042",
      name: "Justin Perez",
      email: "justin@vtms.com",
      designation: "Driver",
      permissions: 1,
    },
    {
      id: "MG043",
      name: "Rebecca Roberts",
      email: "rebecca@vtms.com",
      designation: "HR Assistant",
      permissions: 2,
    },
    {
      id: "MG044",
      name: "Eric Turner",
      email: "eric@vtms.com",
      designation: "Dispatcher",
      permissions: 3,
    },
    {
      id: "MG045",
      name: "Cynthia Phillips",
      email: "cynthia@vtms.com",
      designation: "Mechanic",
      permissions: 4,
    },
    {
      id: "MG046",
      name: "Patrick Campbell",
      email: "patrick@vtms.com",
      designation: "Fleet Supervisor",
      permissions: 5,
    },
  ];

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredUsers = users.filter((user) => {
    if (!normalizedSearch) return true;
    return (
      user.id.toLowerCase().includes(normalizedSearch) ||
      user.name.toLowerCase().includes(normalizedSearch) ||
      user.email.toLowerCase().includes(normalizedSearch) ||
      user.designation.toLowerCase().includes(normalizedSearch)
    );
  });

  const usersPerPage = 10;
  const totalPages = Math.max(
    1,
    Math.ceil(filteredUsers.length / usersPerPage),
  );
  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = Math.min(startIndex + usersPerPage, filteredUsers.length);
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
  const showingFrom = filteredUsers.length === 0 ? 0 : startIndex + 1;
  const showingTo = filteredUsers.length === 0 ? 0 : endIndex;
  const maxVisiblePages = 4;

  const visibleStartPage = Math.max(
    1,
    Math.min(
      currentPage - Math.floor(maxVisiblePages / 2),
      totalPages - maxVisiblePages + 1,
    ),
  );
  const visibleEndPage = Math.min(
    totalPages,
    visibleStartPage + maxVisiblePages - 1,
  );
  const visiblePages = Array.from(
    { length: visibleEndPage - visibleStartPage + 1 },
    (_, i) => visibleStartPage + i,
  );

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="bg-white mt-6  rounded-3xl">
      {/* ================= DESIGNATIONS ================= */}
      <h2 className="text-lg p-6 font-semibold ">Designations</h2>
      <div className="flex flex-wrap p-4 gap-4 mb-8">
        {designations.map((item, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-[20px] px-3.75 py-4 flex justify-between items-start w-[227px] h-[88px] shadow-sm hover:shadow-lg"
            style={{ gap: "30px" }} // Tailwind cannot directly handle arbitrary gap between children in flex items; use inline style
          >
            <div>
              <p className="text-sm font-medium">{item.title}</p>
              <p className="text-xs mt-2 text-gray-500">{item.level}</p>
            </div>

            <div className="flex flex-row gap-2">
              <button className="text-gray-400 hover:text-red-500 text-sm">
                ✎
              </button>

              <button className="text-gray-400 hover:text-red-500 text-sm">
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg px-4 font-semibold">Management Users</h2>

        <div className="flex items-center p-3 gap-3">
          {/* Search */}
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-2.5  text-gray-400"
            />
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-9 pr-4 py-2 rounded-lg bg-gray-50  text-sm focus:outline-none"
            />
          </div>

          {/* Button */}
          <button className="bg-black text-white px-4 py-2  rounded-lg text-sm">
            + Add Designations
          </button>
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className="overflow-x-auto bg-white  shadow-sm">
        <table className="w-full text-sm">
          <thead className=" text-gray-900 text-left">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Designations</th>
              <th className="px-4 py-3">Permissions</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedUsers.map((user, index) => (
              <tr
                key={`${user.id}-${startIndex + index}`}
                // className=" border-t border-gray-300  hover:bg-gray-50 transition"
                className={`border-t border-gray-300 hover:bg-gray-200 transition ${index % 2 === 0 ? "bg-gray-100" : "bg-white"}`}
              >
                <td className="px-4 py-3">{user.id}</td>

                <td className="px-4 py-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                  {user.name}
                </td>

                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3">{user.designation}</td>

                <td className="px-4 py-3 flex items-center gap-2 text-gray-600">
                  <Shield size={14} />
                  {user.permissions} Permissions
                </td>

                <td className="px-4 py-3">
                  <span className="px-3 py-1 text-xs rounded-md bg-green-100 text-green-600 border border-green-300">
                    Active
                  </span>
                </td>

                <td className="px-4 py-3">
                  <MoreVertical
                    size={18}
                    className="text-gray-500 cursor-pointer"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= FOOTER ================= */}
      <div className="flex justify-between px-4 py-3 items-center mt-6 text-sm text-gray-600">
        <p>
          Showing {showingFrom}-{showingTo} from {filteredUsers.length} data
        </p>

        {/* Pagination */}
        <div className="flex items-center justify-center space-x-4">
          {/* Previous Button */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 rounded-2xl text-blue-600 border border-blue-300 hover:bg-blue-50 disabled:opacity-50"
          >
            &#60;
          </button>

          {/* Page Numbers */}
          <div className="flex items-center space-x-2">
            {visiblePages.map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-4 py-2 rounded-full ${
                  currentPage === page
                    ? "bg-blue-600 text-white"
                    : "bg-white text-blue-600 hover:bg-blue-100"
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-2 rounded-full text-blue-600 border border-blue-300
         hover:bg-blue-50 disabled:opacity-50"
          >
            &#62;
          </button>
        </div>
      </div>
    </div>
  );
};

const DashboardStats = () => {
  const stats = [
    {
      title: "Management Users",
      value: 3,
      icon: <Users size={22} />,
      bg: "bg-orange-100",
      iconBg: "bg-orange-500",
    },
    {
      title: "Designations",
      value: 4,
      icon: <ShieldCheck size={22} />,
      bg: "bg-blue-100",
      iconBg: "bg-blue-500",
    },
    {
      title: "Active Users",
      value: 2,
      icon: <UserCheck size={22} />,
      bg: "bg-green-100",
      iconBg: "bg-green-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 p-4 gap-6">
      {stats.map((item, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl p-8 flex items-center justify-between shadow-md hover:shadow-lg  "
        >
          <div>
            <p className="text-gray-500 text-sm">{item.title}</p>
            <h2 className="text-2xl  mt-2">{item.value}</h2>
          </div>

          <div
            className={`w-12 h-12 flex items-center justify-center rounded-xl text-white ${item.iconBg}`}
          >
            {item.icon}
          </div>
        </div>
      ))}
    </div>
  );
};
