import React, { useEffect, useMemo, useState } from "react";
import { Search, MoreVertical, Pencil, Trash2 } from "lucide-react";
import {
  useCreateVehicleMutation,
  useCreateVehicleTypeMutation,
  useDeleteVehicleMutation,
  useDeleteVehicleTypeMutation,
  useGetVehiclesQuery,
  useGetVehicleTypesQuery,
  useUpdateVehicleMutation,
  useUpdateVehicleTypeMutation,
} from "../../store/api";

const Vehicles = () => {
  return (
    <div className="mt-8 ">
      <VehicleManagement />
    </div>
  );
};

export default Vehicles;

function VehicleManagement() {
  const [typeSearch, setTypeSearch] = useState("");
  const [vehicleSearch, setVehicleSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const debouncedTypeSearch = useDebouncedValue(typeSearch, 300);
  const debouncedVehicleSearch = useDebouncedValue(vehicleSearch, 350);

  const [typeFormOpen, setTypeFormOpen] = useState(false);
  const [editingType, setEditingType] = useState(null);
  const [typeForm, setTypeForm] = useState({ name: "", isActive: true });
  const [typeError, setTypeError] = useState("");

  const [vehicleFormOpen, setVehicleFormOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [vehicleForm, setVehicleForm] = useState({
    vehicleNumber: "",
    vehicleTypeId: "",
    ownership: "COMPANY",
    isActive: true,
  });
  const [vehicleError, setVehicleError] = useState("");
  const [activeMenuId, setActiveMenuId] = useState(null);
  const menuRef = React.useRef(null);
  const activeMenuIdRef = React.useRef(null);

  const {
    notice: typeNotice,
    showNotice: showTypeNotice,
    clearNotice: clearTypeNotice,
  } = useTimedNotice();
  const {
    notice: vehicleNotice,
    showNotice: showVehicleNotice,
    clearNotice: clearVehicleNotice,
  } = useTimedNotice();

  const {
    data: typesResponse,
    isLoading: typesLoading,
    isError: typesError,
  } = useGetVehicleTypesQuery(
    { page: 1, perPage: "all", q: debouncedTypeSearch.trim() },
    { refetchOnMountOrArgChange: true },
  );
  const vehicleTypes = typesResponse?.data?.items || [];

  const {
    data: vehiclesResponse,
    isLoading: vehiclesLoading,
    isError: vehiclesError,
  } = useGetVehiclesQuery(
    { page: currentPage, perPage: itemsPerPage, q: debouncedVehicleSearch.trim() },
    { refetchOnMountOrArgChange: true },
  );
  const {
    data: vehiclesAllResponse,
  } = useGetVehiclesQuery(
    { page: 1, perPage: "all", q: "" },
    { refetchOnMountOrArgChange: false },
  );

  const vehicles = vehiclesResponse?.data?.items || [];
  const vehiclesAll = vehiclesAllResponse?.data?.items || vehicles;
  const meta = vehiclesResponse?.meta || {
    total: vehicles.length,
    totalPages: 1,
    page: currentPage,
  };

  const totalItems = meta.total ?? vehicles.length;
  const totalPages = Math.max(1, meta.totalPages || 1);
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const showingFrom =
    totalItems > 0 ? (safeCurrentPage - 1) * itemsPerPage + 1 : 0;
  const showingTo =
    totalItems > 0
      ? Math.min(safeCurrentPage * itemsPerPage, totalItems)
      : 0;

  const typeCounts = useMemo(() => {
    const map = {};
    vehiclesAll.forEach((vehicle) => {
      const key = vehicle.vehicleTypeId || vehicle.vehicleTypeName || "unknown";
      map[key] = (map[key] || 0) + 1;
    });
    return map;
  }, [vehiclesAll]);

  const [createVehicleType, { isLoading: isCreatingType }] =
    useCreateVehicleTypeMutation();
  const [updateVehicleType, { isLoading: isUpdatingType }] =
    useUpdateVehicleTypeMutation();
  const [deleteVehicleType, { isLoading: isDeletingType }] =
    useDeleteVehicleTypeMutation();

  const [createVehicle, { isLoading: isCreatingVehicle }] =
    useCreateVehicleMutation();
  const [updateVehicle, { isLoading: isUpdatingVehicle }] =
    useUpdateVehicleMutation();
  const [deleteVehicle, { isLoading: isDeletingVehicle }] =
    useDeleteVehicleMutation();

  useEffect(() => {
    if (!vehicleFormOpen) return;
    if (!vehicleTypes.length) return;
    if (vehicleForm.vehicleTypeId) return;
    setVehicleForm((prev) => ({ ...prev, vehicleTypeId: vehicleTypes[0]._id }));
  }, [vehicleFormOpen, vehicleForm.vehicleTypeId, vehicleTypes]);

  React.useEffect(() => {
    activeMenuIdRef.current = activeMenuId;
  }, [activeMenuId]);

  React.useEffect(() => {
    const handleClick = (event) => {
      if (!activeMenuIdRef.current) return;
      if (!menuRef.current || menuRef.current.contains(event.target)) return;
      setActiveMenuId(null);
    };
    if (activeMenuId) {
      document.addEventListener("mousedown", handleClick);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [activeMenuId]);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleTypeFormOpen = (type = null) => {
    clearTypeNotice();
    setTypeError("");
    setEditingType(type);
    setTypeForm(
      type
        ? { name: type.name || "", isActive: type.isActive ?? true }
        : { name: "", isActive: true },
    );
    setTypeFormOpen(true);
  };

  const handleVehicleFormOpen = (vehicle = null) => {
    clearVehicleNotice();
    setVehicleError("");
    setEditingVehicle(vehicle);
    setVehicleForm(
      vehicle
        ? {
            vehicleNumber: vehicle.vehicleNumber || "",
            vehicleTypeId: vehicle.vehicleTypeId || "",
            ownership: vehicle.ownership || "COMPANY",
            isActive: vehicle.isActive ?? true,
          }
        : {
            vehicleNumber: "",
            vehicleTypeId: "",
            ownership: "COMPANY",
            isActive: true,
          },
    );
    setVehicleFormOpen(true);
  };

  const handleTypeSubmit = async (event) => {
    event.preventDefault();
    setTypeError("");
    const name = typeForm.name.trim();
    if (!name) {
      const message = "Vehicle type name is required.";
      setTypeError(message);
      showTypeNotice("error", message);
      return;
    }

    try {
      if (editingType) {
        await updateVehicleType({
          id: editingType._id,
          name,
          isActive: Boolean(typeForm.isActive),
        }).unwrap();
        showTypeNotice("success", "Vehicle type updated successfully.");
      } else {
        await createVehicleType({ name }).unwrap();
        showTypeNotice("success", "Vehicle type created successfully.");
      }
      setTypeFormOpen(false);
      setEditingType(null);
      setTypeForm({ name: "", isActive: true });
    } catch (error) {
      const message =
        error?.data?.message ||
        error?.error ||
        "Unable to save vehicle type.";
      setTypeError(message);
      showTypeNotice("error", message);
    }
  };

  const handleTypeDelete = async (type) => {
    if (isDeletingType) return;
    const shouldDelete = window.confirm(
      `Delete vehicle type "${type.name}"? This cannot be undone.`,
    );
    if (!shouldDelete) return;

    try {
      await deleteVehicleType(type._id).unwrap();
      showTypeNotice("success", "Vehicle type deleted successfully.");
    } catch (error) {
      const message =
        error?.data?.message ||
        error?.error ||
        "Unable to delete vehicle type.";
      showTypeNotice("error", message);
    }
  };

  const handleVehicleSubmit = async (event) => {
    event.preventDefault();
    setVehicleError("");
    const payload = {
      vehicleNumber: vehicleForm.vehicleNumber.trim(),
      vehicleTypeId: vehicleForm.vehicleTypeId,
      ownership: vehicleForm.ownership === "PRIVATE" ? "PRIVATE" : "COMPANY",
    };

    if (!payload.vehicleNumber) {
      const message = "Vehicle number is required.";
      setVehicleError(message);
      showVehicleNotice("error", message);
      return;
    }
    if (!payload.vehicleTypeId) {
      const message = "Vehicle type is required.";
      setVehicleError(message);
      showVehicleNotice("error", message);
      return;
    }

    try {
      if (editingVehicle) {
        await updateVehicle({
          id: editingVehicle._id,
          ...payload,
          isActive: Boolean(vehicleForm.isActive),
        }).unwrap();
        showVehicleNotice("success", "Vehicle updated successfully.");
      } else {
        await createVehicle(payload).unwrap();
        showVehicleNotice("success", "Vehicle created successfully.");
      }
      setVehicleFormOpen(false);
      setEditingVehicle(null);
      setVehicleForm({
        vehicleNumber: "",
        vehicleTypeId: vehicleTypes[0]?._id || "",
        ownership: "COMPANY",
        isActive: true,
      });
    } catch (error) {
      const message =
        error?.data?.message || error?.error || "Unable to save vehicle.";
      setVehicleError(message);
      showVehicleNotice("error", message);
    }
  };

  const handleVehicleDelete = async (vehicle) => {
    if (isDeletingVehicle) return;
    const shouldDelete = window.confirm(
      `Delete vehicle "${vehicle.vehicleNumber}"? This cannot be undone.`,
    );
    if (!shouldDelete) return;

    try {
      await deleteVehicle(vehicle._id).unwrap();
      showVehicleNotice("success", "Vehicle deleted successfully.");
    } catch (error) {
      const message =
        error?.data?.message || error?.error || "Unable to delete vehicle.";
      showVehicleNotice("error", message);
    }
  };

  return (
    <div className="min-h-screen space-y-6">
      <div className="bg-white rounded-3xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Vehicle Types</h2>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search"
                value={typeSearch}
                onChange={(event) => setTypeSearch(event.target.value)}
                className="pl-9 pr-4 py-2 rounded-xl bg-gray-100 text-sm focus:outline-none"
              />
            </div>
            <button
              type="button"
              onClick={() => handleTypeFormOpen()}
              className="bg-black text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-800 transition"
            >
              + Add Type
            </button>
          </div>
        </div>

        <NoticeBanner notice={typeNotice} />

        {typeFormOpen && (
          <form
            onSubmit={handleTypeSubmit}
            className="mb-6 rounded-2xl border border-gray-200 bg-gray-50 p-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-600">
                  Type Name
                </label>
                <input
                  type="text"
                  value={typeForm.name}
                  onChange={(event) =>
                    setTypeForm((prev) => ({
                      ...prev,
                      name: event.target.value,
                    }))
                  }
                  className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                  placeholder="e.g. Fork, Flap"
                  required
                />
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={Boolean(typeForm.isActive)}
                    onChange={(event) =>
                      setTypeForm((prev) => ({
                        ...prev,
                        isActive: event.target.checked,
                      }))
                    }
                    className="h-4 w-4"
                  />
                  Active
                </label>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setTypeFormOpen(false);
                  setEditingType(null);
                  setTypeForm({ name: "", isActive: true });
                }}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isCreatingType || isUpdatingType}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white disabled:opacity-70"
              >
                {isCreatingType || isUpdatingType
                  ? "Saving..."
                  : editingType
                    ? "Update Type"
                    : "Create Type"}
              </button>
            </div>
            {typeError && (
              <div className="mt-3 text-sm text-red-600">{typeError}</div>
            )}
          </form>
        )}

        <div className="space-y-3">
          {typesLoading && (
            <div className="px-4 py-6 text-sm text-gray-500">
              Loading vehicle types...
            </div>
          )}
          {typesError && (
            <div className="px-4 py-6 text-sm text-red-500">
              Unable to load vehicle types.
            </div>
          )}
          {!typesLoading && !typesError && vehicleTypes.length === 0 && (
            <div className="px-4 py-6 text-sm text-gray-500">
              No vehicle types found.
            </div>
          )}
          {vehicleTypes.map((type) => (
            <div
              key={type._id}
              className="bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 flex items-center justify-between"
            >
              <div>
                <p className="font-medium text-gray-800">{type.name}</p>
                <p className="text-xs text-gray-500">
                  {typeCounts[type._id] || 0} vehicles
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleTypeFormOpen(type)}
                  className="text-gray-400 hover:text-blue-500"
                  aria-label="Edit vehicle type"
                >
                  <Pencil size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => handleTypeDelete(type)}
                  className="text-gray-400 hover:text-red-500"
                  aria-label="Delete vehicle type"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm">
        <div className="flex justify-between p-6 items-center mb-3">
          <h2 className="text-xl font-semibold text-gray-800">
            Vehicle Management
          </h2>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search"
                value={vehicleSearch}
                onChange={(event) => {
                  setVehicleSearch(event.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9 pr-4 py-2 rounded-xl bg-gray-100 text-sm focus:outline-none"
              />
            </div>

            <button
              type="button"
              onClick={() => handleVehicleFormOpen()}
              className="bg-black text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-800 transition"
            >
              + Add Vehicle
            </button>
          </div>
        </div>

        <div className="px-6">
          <NoticeBanner notice={vehicleNotice} />
        </div>

        {vehicleFormOpen && (
          <form
            onSubmit={handleVehicleSubmit}
            className="mx-6 mb-6 rounded-2xl border border-gray-200 bg-gray-50 p-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-600">
                  Vehicle Number
                </label>
                <input
                  type="text"
                  value={vehicleForm.vehicleNumber}
                  onChange={(event) =>
                    setVehicleForm((prev) => ({
                      ...prev,
                      vehicleNumber: event.target.value,
                    }))
                  }
                  className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                  placeholder="e.g. FK-001"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600">
                  Vehicle Type
                </label>
                <select
                  value={vehicleForm.vehicleTypeId}
                  onChange={(event) =>
                    setVehicleForm((prev) => ({
                      ...prev,
                      vehicleTypeId: event.target.value,
                    }))
                  }
                  className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                  disabled={!vehicleTypes.length}
                  required
                >
                  <option value="">
                    {vehicleTypes.length ? "Select type" : "No types available"}
                  </option>
                  {vehicleTypes.map((type) => (
                    <option key={type._id} value={type._id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600">
                  Ownership
                </label>
                <select
                  value={vehicleForm.ownership}
                  onChange={(event) =>
                    setVehicleForm((prev) => ({
                      ...prev,
                      ownership: event.target.value,
                    }))
                  }
                  className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                >
                  <option value="COMPANY">Company</option>
                  <option value="PRIVATE">Private</option>
                </select>
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={Boolean(vehicleForm.isActive)}
                    onChange={(event) =>
                      setVehicleForm((prev) => ({
                        ...prev,
                        isActive: event.target.checked,
                      }))
                    }
                    className="h-4 w-4"
                    disabled={!editingVehicle}
                  />
                  Active
                </label>
                {!editingVehicle && (
                  <span className="text-xs text-gray-400 ml-3">
                    Available after create
                  </span>
                )}
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setVehicleFormOpen(false);
                  setEditingVehicle(null);
                  setVehicleForm({
                    vehicleNumber: "",
                    vehicleTypeId: vehicleTypes[0]?._id || "",
                    ownership: "COMPANY",
                    isActive: true,
                  });
                }}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isCreatingVehicle || isUpdatingVehicle}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white disabled:opacity-70"
              >
                {isCreatingVehicle || isUpdatingVehicle
                  ? "Saving..."
                  : editingVehicle
                    ? "Update Vehicle"
                    : "Create Vehicle"}
              </button>
            </div>
            {vehicleError && (
              <div className="mt-3 text-sm text-red-600">{vehicleError}</div>
            )}
          </form>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 text-left">
                <th className="py-3 px-4">Vehicle ID</th>
                <th>Type</th>
                <th>Ownership</th>
                <th>Created</th>
                <th>Updated</th>
                <th>Status</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {vehiclesLoading && (
                <tr>
                  <td className="py-5 px-4 text-gray-500" colSpan={7}>
                    Loading vehicles...
                  </td>
                </tr>
              )}
              {vehiclesError && (
                <tr>
                  <td className="py-5 px-4 text-red-500" colSpan={7}>
                    Unable to load vehicles.
                  </td>
                </tr>
              )}
              {!vehiclesLoading && !vehiclesError && vehicles.length === 0 && (
                <tr>
                  <td className="py-5 px-4 text-gray-500" colSpan={7}>
                    No vehicles found.
                  </td>
                </tr>
              )}
              {!vehiclesLoading &&
                !vehiclesError &&
                vehicles.map((vehicle, index) => (
                  <tr
                    key={vehicle._id}
                    className={`transition ${
                      index % 2 === 0 ? "bg-gray-100" : "bg-white"
                    } hover:bg-gray-200`}
                  >
                    <td className="py-5 px-4 font-medium text-gray-700">
                      {vehicle.vehicleNumber}
                    </td>
                    <td>{vehicle.vehicleTypeName || "--"}</td>
                    <td>{vehicle.ownership || "COMPANY"}</td>
                    <td>{formatDate(vehicle.createdAt)}</td>
                    <td>{formatDate(vehicle.updatedAt)}</td>
                    <td>
                      <span
                        className={`px-4 py-1 rounded-lg text-xs font-medium border ${
                          vehicle.isActive
                            ? "border-green-500 text-green-600 bg-green-50"
                            : "border-red-500 text-red-500 bg-red-50"
                        }`}
                      >
                        {vehicle.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="text-center">
                      <div
                        className="relative inline-block"
                        ref={activeMenuId === vehicle._id ? menuRef : null}
                      >
                        <button
                          type="button"
                          onClick={() =>
                            setActiveMenuId((prev) =>
                              prev === vehicle._id ? null : vehicle._id,
                            )
                          }
                          className="p-2 hover:bg-gray-100 rounded-lg"
                        >
                          <MoreVertical size={16} />
                        </button>
                        {activeMenuId === vehicle._id && (
                          <div className="absolute right-0 mt-2 w-32 rounded-lg border border-gray-200 bg-white shadow-md z-10">
                            <button
                              type="button"
                              onClick={() => {
                                setActiveMenuId(null);
                                handleVehicleFormOpen(vehicle);
                              }}
                              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setActiveMenuId(null);
                                handleVehicleDelete(vehicle);
                              }}
                              className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-gray-50"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

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

            {buildVisiblePages(safeCurrentPage, totalPages).map((page) => (
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

const buildVisiblePages = (currentPage, totalPages) => {
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

  return Array.from(
    { length: visibleEndPage - visibleStartPage + 1 },
    (_, index) => visibleStartPage + index,
  );
};

const formatDate = (value) => {
  if (!value) return "--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--";
  return date.toLocaleDateString("en-US");
};

const NoticeBanner = ({ notice }) => {
  if (!notice) return null;
  const baseStyles = "mb-4 rounded-lg border px-4 py-2 text-sm";
  const theme =
    notice.type === "success"
      ? "border-green-200 bg-green-50 text-green-700"
      : "border-red-200 bg-red-50 text-red-700";
  return <div className={`${baseStyles} ${theme}`}>{notice.message}</div>;
};

const useTimedNotice = (durationMs = 4000) => {
  const [notice, setNotice] = useState(null);
  const timerRef = React.useRef(null);

  const clearNotice = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
    setNotice(null);
  };

  const showNotice = (type, message) => {
    if (!message) return;
    clearNotice();
    setNotice({ type, message });
    timerRef.current = setTimeout(() => {
      setNotice(null);
      timerRef.current = null;
    }, durationMs);
  };

  React.useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  return { notice, showNotice, clearNotice };
};

const useDebouncedValue = (value, delayMs) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handle = setTimeout(() => setDebouncedValue(value), delayMs);
    return () => clearTimeout(handle);
  }, [value, delayMs]);

  return debouncedValue;
};
