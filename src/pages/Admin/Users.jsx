import { useState } from "react";
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
                className="pl-9 pr-4 py-2 rounded-xl bg-gray-100 text-sm focus:outline-none"
              />
            </div>

            {/* Add Button */}
            <button className="bg-black text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-800 transition">
              + Add Vehicle
            </button>
          </div>
        </div>

        {/* ================= TOGGLE ================= */}
        <div className=" px-6 pb-4">
          <div className="bg-gray-200  rounded-full flex shadow-md  w-80 h-12">
            {["Drivers", "Supervisors"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
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
              {[...users, ...users].map((user, index) => (
                <tr
                  key={index}
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
          <p>Showing 1-10 from 46 data</p>

          <div className="flex items-center gap-1">
            <button className="w-8 h-8 rounded-full border border-gray-300">
              &lt;
            </button>

            <button className="w-8 h-8 rounded-lg border border-gray-300">
              1
            </button>
            <button className="w-8 h-8 rounded-lg border border-gray-300">
              2
            </button>
            <button className="w-8 h-8 rounded-lg bg-blue-600 text-white">
              3
            </button>
            <button className="w-8 h-8 rounded-lg border border-gray-300">
              4
            </button>

            <button className="w-8 h-8 rounded-full border border-gray-300">
              &gt;
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}