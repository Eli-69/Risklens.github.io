import { createHashRouter } from "react-router"; // <-- change this line
import { Home } from "./pages/Home";
import { SecurityInsights } from "./pages/SecurityInsights";
import { HowItWorks } from "./pages/HowItWorks";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { WhosAtRisk } from "./pages/WhosAtRisk";
import { ReportSite } from "./pages/ReportSite";
import { Help } from "./pages/Help";

export const router = createHashRouter([
  { path: "/", Component: Home },
  { path: "/insights/:domain", Component: SecurityInsights },
  { path: "/how-it-works", Component: HowItWorks },
  { path: "/login", Component: Login },
  { path: "/dashboard", Component: Dashboard },
  { path: "/whos-at-risk", Component: WhosAtRisk },
  { path: "/report-site", Component: ReportSite },
  { path: "/help", Component: Help },
]);