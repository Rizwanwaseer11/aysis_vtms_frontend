import { Route, Routes } from "react-router-dom";
import "./App.css";

import PageNotFound from "./pages/PageNotFound";
import Home from "./pages/Home";
import Login from "./pages/Login";
import AdminLayout from "./pages/AdminLayout";
import Dashboard from "./pages/Dashboard";
import Vehicles from "./pages/Admin/Vehicles";

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
              <Route path="manage-vehicles" element={<Vehicles />  } />
            </Route>
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;
