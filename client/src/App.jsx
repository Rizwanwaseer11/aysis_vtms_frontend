import { Route, Routes } from "react-router-dom";
import "./App.css";

import PageNotFound from "./pages/PageNotFound";
import Home from "./pages/Home";
import Login from "./pages/Login";
import AdminLayout from "./pages/AdminLayout";
import Dashboard from "./pages/Admin/Dashboard";
import Vehicles from "./pages/Admin/Vehicles";
import Bins from "./pages/Admin/Bins";
import Management from "./pages/Admin/Management";
import Attendance from "./pages/Admin/Attendance";
import Operations from "./pages/Admin/Operations";
import Locations from "./pages/Admin/Locations";
import Users from "./pages/Admin/Users";

function App() {
  return (
    <>
      <div className="min-h-screen flex flex-col">
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="*" element={<PageNotFound />} />

            <Route path="/login" element={<Login />} />

            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="manage-vehicles" element={<Vehicles />} />
              <Route path="manage-users" element={<Users />} />
              <Route path="manage-locations" element={<Locations />} />
              <Route path="manage-operations" element={<Operations />} />
              <Route path="manage-attendance" element={<Attendance />} />
              <Route path="manage-management" element={<Management />} />
              <Route path="manage-bins" element={<Bins />} />
            </Route>
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;
