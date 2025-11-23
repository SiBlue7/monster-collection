import { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "../routes/protectedRoute";

import Login from "../auth/Login";
import Register from "../auth/Register";
import App from "../App";
import AppHome from "../page/AppHome";
import Page404 from "../page/Page404";
import JoinGroupPage from "../components/JoinGroupPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="p-6">Chargement…</div>}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Routes protégées */}
          <Route element={<ProtectedRoute />}>
            <Route path="/app" element={<App />} />
            <Route path="/appHome" element={<AppHome />} />
            <Route path="/join-group" element={<JoinGroupPage />} />
          </Route>

          {/* Par défaut */}
          <Route path="/" element={<Login />} />
          <Route path="*" element={<Page404 />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
