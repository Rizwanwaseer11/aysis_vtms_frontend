import React, { useEffect, useMemo, useState } from "react";
import { Search, MoreVertical } from "lucide-react";
import {
  useCreateUserMutation,
  useDeleteUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
} from "../../store/api";

const ROLE_TABS = [
  { label: "Drivers", value: "DRIVER" },
  { label: "Supervisors", value: "SUPERVISOR" },
];

const OPERATION_OPTIONS = [
  { value: "GATE", label: "Gate" },
  { value: "FORK", label: "Fork" },
  { value: "FLAP", label: "Flap" },
  { value: "ARM_ROLLER", label: "Arm Roller" },
  { value: "BULK", label: "Bulk" },
  { value: "GTS", label: "GTS" },
  { value: "LFS", label: "LFS" },
];

const normalizeNic = (value) =>
  String(value || "")
    .replace(/[^0-9]/g, "")
    .trim();

const Users = () => {
  return (
    <div className="mt-8">
      <UserManagement />
    </div>
  );
};

export default Users;

function UserManagement() {
  const [activeRole, setActiveRole] = useState(ROLE_TABS[0].value);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const debouncedSearch = useDebouncedValue(search, 350);
  const trimmedSearch = debouncedSearch.trim();
  const nicQuery = normalizeNic(trimmedSearch);
  const isNicSearch =
    /\d{5}-\d{7}-\d/.test(trimmedSearch) || nicQuery.length === 13;

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formState, setFormState] = useState(getEmptyUserForm(activeRole));
  const [formError, setFormError] = useState("");
  const [activeMenuId, setActiveMenuId] = useState(null);
  const menuRef = React.useRef(null);
  const activeMenuIdRef = React.useRef(null);

  const { notice, showNotice, clearNotice } = useTimedNotice();

  const {
    data: usersResponse,
    isLoading,
    isError,
  } = useGetUsersQuery(
    { page: 1, perPage: "all", q: isNicSearch ? "" : trimmedSearch },
    { refetchOnMountOrArgChange: true },
  );

  const users = usersResponse?.data?.items || [];

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      if (activeRole && user.role !== activeRole) return false;
      if (!isNicSearch) return true;
      const userNic = normalizeNic(user.nicNumber || "");
      return userNic.includes(nicQuery);
    });
  }, [users, activeRole, isNicSearch, nicQuery]);

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

  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

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

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setCurrentPage(1);
  };

  const handleTabChange = (role) => {
    setActiveRole(role);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const openCreateForm = () => {
    clearNotice();
    setFormError("");
    setEditingUser(null);
    setFormState(getEmptyUserForm(activeRole));
    setIsFormOpen(true);
  };

  const openEditForm = (user) => {
    clearNotice();
    setFormError("");
    setEditingUser(user);
    setFormState(mapUserToForm(user));
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingUser(null);
    setFormState(getEmptyUserForm(activeRole));
    setFormError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError("");

    const required = [
      { key: "name", label: "Name" },
      { key: "nicNumber", label: "NIC number" },
      { key: "hrNumber", label: "HR number" },
      { key: "email", label: "Email" },
      { key: "role", label: "Role" },
      { key: "operationType", label: "Operation type" },
    ];

    for (const field of required) {
      if (!formState[field.key]?.toString().trim()) {
        const message = `${field.label} is required.`;
        setFormError(message);
        showNotice("error", message);
        return;
      }
    }

    const emailValue = formState.email.trim();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue);
    if (!emailOk) {
      const message = "Please enter a valid email address.";
      setFormError(message);
      showNotice("error", message);
      return;
    }

    if (!editingUser && !formState.password.trim()) {
      const message = "Password is required for new users.";
      setFormError(message);
      showNotice("error", message);
      return;
    }

    const payload = {
      name: formState.name.trim(),
      fatherName: formState.fatherName.trim(),
      nicNumber: formState.nicNumber.trim(),
      hrNumber: formState.hrNumber.trim(),
      email: emailValue,
      role: formState.role,
      operationType: formState.operationType,
    };

    if (formState.password.trim()) {
      payload.password = formState.password.trim();
    }

    try {
      if (editingUser) {
        await updateUser({
          id: editingUser._id,
          ...payload,
          isActive: Boolean(formState.isActive),
        }).unwrap();
        showNotice("success", "User updated successfully.");
      } else {
        await createUser(payload).unwrap();
        showNotice("success", "User created successfully.");
      }
      closeForm();
    } catch (error) {
      const message =
        error?.data?.message || error?.error || "Unable to save user.";
      setFormError(message);
      showNotice("error", message);
    }
  };

  const handleDelete = async (user) => {
    if (isDeleting) return;
    const shouldDelete = window.confirm(
      `Delete user "${user.name}"? This cannot be undone.`,
    );
    if (!shouldDelete) return;

    try {
      await deleteUser(user._id).unwrap();
      showNotice("success", "User deleted successfully.");
    } catch (error) {
      const message =
        error?.data?.message || error?.error || "Unable to delete user.";
      showNotice("error", message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-2">
      <div className="bg-white rounded-3xl shadow-sm">
        <div className="flex justify-between p-5 items-center">
          <h2 className="text-xl font-semibold text-gray-800">User Management</h2>

          <div className="flex items-center gap-3">
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

            <button
              type="button"
              onClick={openCreateForm}
              className="bg-black text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-800 transition"
            >
              + Add User
            </button>
          </div>
        </div>

        <NoticeBanner notice={notice} />

        {isFormOpen && (
          <form
            onSubmit={handleSubmit}
            className="mx-6 mb-6 rounded-2xl border border-gray-200 bg-gray-50 p-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-600">Name</label>
                <input
                  type="text"
                  value={formState.name}
                  onChange={(event) =>
                    setFormState((prev) => ({
                      ...prev,
                      name: event.target.value,
                    }))
                  }
                  className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600">
                  Father Name
                </label>
                <input
                  type="text"
                  value={formState.fatherName}
                  onChange={(event) =>
                    setFormState((prev) => ({
                      ...prev,
                      fatherName: event.target.value,
                    }))
                  }
                  className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600">NIC</label>
                <input
                  type="text"
                  value={formState.nicNumber}
                  onChange={(event) =>
                    setFormState((prev) => ({
                      ...prev,
                      nicNumber: event.target.value,
                    }))
                  }
                  className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600">HR #</label>
                <input
                  type="text"
                  value={formState.hrNumber}
                  onChange={(event) =>
                    setFormState((prev) => ({
                      ...prev,
                      hrNumber: event.target.value,
                    }))
                  }
                  className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600">Email</label>
                <input
                  type="email"
                  value={formState.email}
                  onChange={(event) =>
                    setFormState((prev) => ({
                      ...prev,
                      email: event.target.value,
                    }))
                  }
                  className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600">Password</label>
                <input
                  type="password"
                  value={formState.password}
                  onChange={(event) =>
                    setFormState((prev) => ({
                      ...prev,
                      password: event.target.value,
                    }))
                  }
                  className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                  placeholder={editingUser ? "Leave blank to keep current" : ""}
                  required={!editingUser}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600">Role</label>
                <select
                  value={formState.role}
                  onChange={(event) =>
                    setFormState((prev) => ({
                      ...prev,
                      role: event.target.value,
                    }))
                  }
                  className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                  required
                >
                  <option value="">Select role</option>
                  {ROLE_TABS.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600">
                  Operation Type
                </label>
                <select
                  value={formState.operationType}
                  onChange={(event) =>
                    setFormState((prev) => ({
                      ...prev,
                      operationType: event.target.value,
                    }))
                  }
                  className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                  required
                >
                  <option value="">Select operation</option>
                  {OPERATION_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={Boolean(formState.isActive)}
                    onChange={(event) =>
                      setFormState((prev) => ({
                        ...prev,
                        isActive: event.target.checked,
                      }))
                    }
                    className="h-4 w-4"
                    disabled={!editingUser}
                  />
                  Active
                </label>
                {!editingUser && (
                  <span className="text-xs text-gray-400 ml-3">
                    Available after create
                  </span>
                )}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={closeForm}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isCreating || isUpdating}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white disabled:opacity-70"
              >
                {isCreating || isUpdating
                  ? "Saving..."
                  : editingUser
                    ? "Update User"
                    : "Create User"}
              </button>
            </div>

            {formError && (
              <div className="mt-3 text-sm text-red-600">{formError}</div>
            )}
          </form>
        )}

        <div className=" px-6 pb-4">
          <div className="bg-gray-200 rounded-full flex shadow-md w-80 h-12">
            {ROLE_TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => handleTabChange(tab.value)}
                className={`flex-1 py-2 text-sm font-semibold rounded-full transition ${
                  activeRole === tab.value
                    ? "bg-white shadow text-gray-800"
                    : "text-gray-800"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 text-left border-b border-gray-300">
                <th className="py-3 px-6">HR #</th>
                <th>Name</th>
                <th>NIC</th>
                <th>Email</th>
                <th>Operation</th>
                <th>Status</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {isLoading && (
                <tr>
                  <td className="py-4 px-6 text-gray-500" colSpan={7}>
                    Loading users...
                  </td>
                </tr>
              )}
              {isError && (
                <tr>
                  <td className="py-4 px-6 text-red-500" colSpan={7}>
                    Unable to load users.
                  </td>
                </tr>
              )}
              {!isLoading && !isError && paginatedUsers.length === 0 && (
                <tr>
                  <td className="py-4 px-6 text-gray-500" colSpan={7}>
                    No users found.
                  </td>
                </tr>
              )}
              {!isLoading &&
                !isError &&
                paginatedUsers.map((user, index) => (
                  <tr
                    key={user._id}
                    className="border-b border-gray-300 odd:bg-gray-100 even:bg-white hover:bg-gray-200 transition"
                  >
                    <td className="py-4 px-6 font-medium text-gray-700">
                      {user.hrNumber || user._id.slice(-6)}
                    </td>

                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gray-300"></div>
                        <span className="font-medium text-gray-700">
                          {user.name}
                        </span>
                      </div>
                    </td>

                    <td>{user.nicNumber || "--"}</td>
                    <td>{user.email || "--"}</td>
                    <td>{formatOperation(user.operationType)}</td>

                    <td>
                      <span
                        className={`px-4 py-1 rounded-lg text-xs font-medium border ${
                          user.isActive
                            ? "border-green-500 text-green-600 bg-green-50"
                            : "border-red-500 text-red-500 bg-red-50"
                        }`}
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="text-center">
                      <div
                        className="relative inline-block"
                        ref={activeMenuId === user._id ? menuRef : null}
                      >
                        <button
                          type="button"
                          onClick={() =>
                            setActiveMenuId((prev) =>
                              prev === user._id ? null : user._id,
                            )
                          }
                          className="p-2 hover:bg-gray-200 rounded-lg"
                        >
                          <MoreVertical size={16} />
                        </button>
                        {activeMenuId === user._id && (
                          <div className="absolute right-0 mt-2 w-32 rounded-lg border border-gray-200 bg-white shadow-md z-10">
                            <button
                              type="button"
                              onClick={() => {
                                setActiveMenuId(null);
                                openEditForm(user);
                              }}
                              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setActiveMenuId(null);
                                handleDelete(user);
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

const getEmptyUserForm = (role) => ({
  name: "",
  fatherName: "",
  nicNumber: "",
  hrNumber: "",
  email: "",
  password: "",
  role: role || "",
  operationType: "",
  isActive: true,
});

const mapUserToForm = (user) => ({
  name: user?.name || "",
  fatherName: user?.fatherName || "",
  nicNumber: user?.nicNumber || "",
  hrNumber: user?.hrNumber || "",
  email: user?.email || "",
  password: "",
  role: user?.role || "",
  operationType: user?.operationType || "",
  isActive: user?.isActive ?? true,
});

const formatOperation = (value) => {
  if (!value) return "--";
  if (value === "ARM_ROLLER") return "Arm Roller";
  if (value === "LFS") return "LFS";
  return value.charAt(0) + value.slice(1).toLowerCase();
};


const NoticeBanner = ({ notice }) => {
  if (!notice) return null;
  const baseStyles = "mx-6 mb-4 rounded-lg border px-4 py-2 text-sm";
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
