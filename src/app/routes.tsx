import { createHashRouter } from "react-router"; // <-- change this line
import { Home } from "./pages/Home";
import { SecurityInsights } from "./pages/SecurityInsights";
import { HowItWorks } from "./pages/HowItWorks";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { WhosAtRisk } from "./pages/WhosAtRisk";
import { ReportSite } from "./pages/ReportSite";
import { Help } from "./pages/Help";
import { ForgotPassword } from "./pages/ForgotPassword";
import { VerifyAccount } from "./pages/VerifyAccount";
import { RequireAuth } from "./pages/RequireAuth";
import { AdminRoute } from "./components/AdminRoute";
import { AdminDashboard } from "./pages/AdminDashboard";

export const router = createHashRouter([
  { path: "/", Component: Home },
  { path: "/insights/:domain", Component: SecurityInsights },
  { path: "/how-it-works", Component: HowItWorks },
  { path: "/login", Component: Login },
  //  { path: "/dashboard", Component: Dashboard },
  { path: "/dashboard", Component: () => (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  ), },
  { path: "/whos-at-risk", Component: WhosAtRisk },
  { path: "/report-site", Component: ReportSite },
  { path: "/help", Component: Help },
  { path: "/forgot-password", Component: ForgotPassword },
  { path: "/verify-account", Component: VerifyAccount },
  { path: "/require-auth", Component: RequireAuth },
  { path: "/admin", Component: () => (
    <AdminRoute>
      <AdminDashboard />
    </AdminRoute>
  ), },
]);