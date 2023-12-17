import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import App from "./App";
import TyreStatusPage from "./TyreStatusPage";
import SessionManager from "./SessionManager";
import TemplateManager from "./TemplateManager";
import "./styles.css";

const Main = () => {
  return (
    <Router>
      <nav>
        <ul>
          <li>
            <Link to="/">Home Page</Link>
          </li>
          <li>
            <Link to="/session-manager">Session Manager</Link>
          </li>
          <li>
            <Link to="/tyre-status">Tyre Status Page</Link>
          </li>
          <li>
            <Link to="/template-manager">Template Manager</Link>{" "}
          </li>
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/session-manager" element={<SessionManager />} />
        <Route path="/tyre-status" element={<TyreStatusPage />} />
        <Route path="/template-manager" element={<TemplateManager />} />{" "}
      </Routes>
    </Router>
  );
};

export default Main;
