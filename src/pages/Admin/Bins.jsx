import { useEffect, useMemo, useState } from "react";
import {
  Camera,
  TrendingUp,
  MapPin,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useGetForkActivitiesQuery } from "../../store/api";

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
  const itemsPerPage = 20;
  const debouncedSearch = useDebouncedValue(search, 350);
  const trimmedSearch = debouncedSearch.trim();

  const { data: activitiesResponse, isLoading, isError } =
    useGetForkActivitiesQuery(
      { page: 1, perPage: "all" },
      { refetchOnMountOrArgChange: true },
    );

  const activities = activitiesResponse?.data?.items || [];
  const filteredActivities = useMemo(() => {
    const query = trimmedSearch.toLowerCase();
    if (!query) return activities;
    return activities.filter((item) => {
      const text = [
        item?.fork?.binNumber,
        item?.fork?.manualBinNumber,
        item?.geo?.zoneName,
        item?.geo?.ucName,
        item?.geo?.wardName,
        item?.vehicle?.vehicleNumber,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return text.includes(query);
    });
  }, [activities, trimmedSearch]);

  const totalItems = filteredActivities.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedActivities = filteredActivities.slice(startIndex, endIndex);
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
              {isLoading && (
                <tr>
                  <td className="p-4 text-gray-500" colSpan={6}>
                    Loading bins...
                  </td>
                </tr>
              )}
              {isError && (
                <tr>
                  <td className="p-4 text-red-500" colSpan={6}>
                    Unable to load bins.
                  </td>
                </tr>
              )}
              {!isLoading && !isError && paginatedActivities.length === 0 && (
                <tr>
                  <td className="p-4 text-gray-500" colSpan={6}>
                    No bins found.
                  </td>
                </tr>
              )}
              {!isLoading &&
                !isError &&
                paginatedActivities.map((activity) => {
                  const placed = activity?.fork?.placed;
                  const statusClass =
                    placed === true
                      ? "bg-green-500"
                      : placed === false
                        ? "bg-red-500"
                        : "bg-gray-400";
                  const binNumber =
                    activity?.fork?.binNumber ||
                    activity?.fork?.manualBinNumber ||
                    activity?._id;
                  return (
                  <tr
                    key={activity._id}
                    className="even:bg-white odd:bg-gray-100 hover:bg-gray-200"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <span className={`h-3 w-3 rounded-full ${statusClass}`} />
                        {binNumber}
                      </div>
                    </td>
                    <td className="p-4">{activity?.geo?.zoneName || "--"}</td>
                    <td className="p-4">{activity?.geo?.ucName || "--"}</td>
                    <td className="p-4">{activity?.geo?.wardName || "--"}</td>

                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                        {formatTime(activity?.before?.at)}
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                        {formatTime(activity?.after?.at)}
                      </div>
                    </td>
                  </tr>
                );
                })}
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

const formatTime = (value) => {
  if (!value) return "--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--";
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const useDebouncedValue = (value, delayMs) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handle = setTimeout(() => setDebouncedValue(value), delayMs);
    return () => clearTimeout(handle);
  }, [value, delayMs]);

  return debouncedValue;
};
