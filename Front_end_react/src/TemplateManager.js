import React, { useState, useEffect } from "react";
import axios from "axios";

const TemplateManager = () => {
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/api/weekend_template/`)
      .then((response) => {
        setTemplates(response.data.results);
      })
      .catch((error) => {
        console.error("There was an error fetching the templates:", error);
      });
  }, []);

  return (
    <div>
      <h1>Template Manager</h1>
      {templates.map((template) => (
        <div key={template.id}>
          <h2>{template.name || "Unnamed Template"}</h2>
          <p>Description: {template.description}</p>
          <p>Total Sets: {template.total_sets}</p>
          <p>Hard Sets: {template.hard_sets}</p>
          <p>Medium Sets: {template.medium_sets}</p>
          <p>Soft Sets: {template.soft_sets}</p>
          <h3>Sessions</h3>
          <ul>
            {template.sessions.map((session) => (
              <li key={session.id}>
                {session.name} - Soft: {session.sets_to_return_soft} / Medium:{" "}
                {session.sets_to_return_medium} / Hard:{" "}
                {session.sets_to_return_hard}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default TemplateManager;
