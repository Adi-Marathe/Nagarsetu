import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

import PrivateRoute from "./routes/PrivateRoute";
import LandingPage from "./pages/LandingPage/LandingPage";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import CitizenDashboard from "./pages/Citizen/CitizenDashboard";
import ReportIssue from "./pages/Citizen/ReportIssue";
import MyComplaints from "./pages/Citizen/MyComplaints";
import ComplaintDetails from "./pages/Citizen/ComplaintDetails";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import VerifyIssues from "./pages/Admin/VerifyIssues";
import AssignOfficers from "./pages/Admin/AssignOfficers";
import OfficerDashboard from "./pages/Officer/OfficerDashboard";
import OfficerWork from "./pages/Officer/OfficerWork";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ToastContainer position="top-right" autoClose={3000} toastClassName="custom-toast" />
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Signup />} />

          {/* Citizen */}
          <Route path="/citizen/dashboard" element={
            <PrivateRoute allowedRoles={['citizen']}><CitizenDashboard /></PrivateRoute>
          } />
          <Route path="/citizen/report" element={
            <PrivateRoute allowedRoles={['citizen']}><ReportIssue /></PrivateRoute>
          } />
          <Route path="/citizen/complaints" element={
            <PrivateRoute allowedRoles={['citizen']}><MyComplaints /></PrivateRoute>
          } />
          <Route path="/complaint/:id" element={
            <PrivateRoute allowedRoles={['citizen', 'admin', 'officer']}><ComplaintDetails /></PrivateRoute>
          } />

          {/* Admin */}
          <Route path="/admin/dashboard" element={
            <PrivateRoute allowedRoles={['admin']}><AdminDashboard /></PrivateRoute>
          } />
          <Route path="/admin/verify" element={
            <PrivateRoute allowedRoles={['admin']}><VerifyIssues /></PrivateRoute>
          } />
          <Route path="/admin/assign" element={
            <PrivateRoute allowedRoles={['admin']}><AssignOfficers /></PrivateRoute>
          } />

          {/* Officer */}
          <Route path="/officer/dashboard" element={
            <PrivateRoute allowedRoles={['officer']}><OfficerDashboard /></PrivateRoute>
          } />
          <Route path="/officer/work" element={
            <PrivateRoute allowedRoles={['officer']}><OfficerWork /></PrivateRoute>
          } />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;