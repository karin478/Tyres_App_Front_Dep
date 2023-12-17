import React, { useState, useEffect } from "react";
import axios from "axios";

const SessionManager = () => {
  const [sessions, setSessions] = useState([]);
  const [newSession, setNewSession] = useState({
    name: "",
    sets_to_return_soft: 0,
    sets_to_return_medium: 0,
    sets_to_return_hard: 0
  });
  const [format, setFormat] = useState({
    total_sets: 0,
    soft_sets: 0,
    medium_sets: 0,
    hard_sets: 0
  });
  const [templateName, setTemplateName] = useState("");

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/api/weekend_session/`)
      .then((response) => {
        setSessions(response.data.results);
      })
      .catch((error) => {
        console.error("There was an error fetching the sessions:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/api/weekend_format/`)
      .then((response) => {
        setFormat(response.data.results[0]);
      })
      .catch((error) => {
        console.error("There was an error fetching the format:", error);
      });
  }, [sessions]);

  const addSession = () => {
    const isNameExists = sessions.some(
      (session) => session.name === newSession.name
    );

    if (isNameExists) {
      alert("Session name already exists!");
      return;
    }
    const competitionSets = calculateCompetitionSets();

    if (
      newSession.sets_to_return_soft >= competitionSets.soft ||
      newSession.sets_to_return_medium >= competitionSets.medium ||
      newSession.sets_to_return_hard >= competitionSets.hard
    ) {
      alert(
        "Please leave at least one set of each tire type for the competition session."
      );
      return;
    }
    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/api/weekend_session/`, newSession)
      .then((response) => {
        setSessions([...sessions, response.data]);
      })
      .catch((error) => {
        console.error("There was an error adding the session:", error);
      });
  };

  const calculateCompetitionSets = () => {
    if (!format) {
      return {
        soft: 0,
        medium: 0,
        hard: 0
      };
    }

    let soft = format.soft_sets;
    let medium = format.medium_sets;
    let hard = format.hard_sets;

    sessions.forEach((session) => {
      soft -= session.sets_to_return_soft;
      medium -= session.sets_to_return_medium;
      hard -= session.sets_to_return_hard;
    });

    return {
      soft,
      medium,
      hard
    };
  };

  const competitionSets = calculateCompetitionSets();

  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/api/weekend_template/`)
      .then((response) => {
        setTemplates(response.data.results);
      })
      .catch((error) => {
        console.error("There was an error fetching the templates:", error);
        alert("Template name already exists or Templates information unformat ");
      });
  }, []);

  const saveTemplate = () => {
    const isTemplateNameExists = templates.some(
      (template) => template.name === templateName
    );
    console.log('Is template name exists:', isTemplateNameExists);  // 加入这行代码以便调试

    if (isTemplateNameExists) {
      alert("Template name already exists! ");
      return;
    }
    axios
      .post(
        `${process.env.REACT_APP_BACKEND_URL}/api/save_weekend_template/`,
        { template_name: templateName }
      )
      .then((response) => {
        alert("Template saved successfully.");
      })
      .catch((error) => {
        console.error("There was an error saving the template:", error);
      });
  };

  return (
    <div>
      <h1>Session Manager</h1>

      {format ? (
        <>
          {/* */}
          <h2>Total Sets Available:</h2>
          <table>
            <thead>
              <tr>
                <th>Soft</th>
                <th>Medium</th>
                <th>Hard</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{format.soft_sets}</td>
                <td>{format.medium_sets}</td>
                <td>{format.hard_sets}</td>
              </tr>
            </tbody>
          </table>

          <h2>Current Sessions:</h2>
          <ul>
            {sessions.map((session) => (
              <li key={session.id}>
                <div>{session.name}</div>
                <div className="session-info">
                  <span>Soft: {session.sets_to_return_soft}</span>
                  <span>Medium: {session.sets_to_return_medium}</span>
                  <span>Hard: {session.sets_to_return_hard}</span>
                </div>
              </li>
            ))}
          </ul>

          {/*  */}
          <h2>Competition Session:</h2>
          <p>
            Competition session - Soft left: {competitionSets.soft} / Medium
            left: {competitionSets.medium} / Hard left: {competitionSets.hard}
          </p>

          {/* */}
          <h2>Add New Session:</h2>
          <div>
            <label>
              Name:
              <input
                type="text"
                value={newSession.name}
                onChange={(e) =>
                  setNewSession({ ...newSession, name: e.target.value })
                }
              />
            </label>
            <label>
              Soft:
              <input
                type="number"
                value={newSession.sets_to_return_soft}
                onChange={(e) =>
                  setNewSession({
                    ...newSession,
                    sets_to_return_soft: parseInt(e.target.value)
                  })
                }
              />
            </label>
            <label>
              Medium:
              <input
                type="number"
                value={newSession.sets_to_return_medium}
                onChange={(e) =>
                  setNewSession({
                    ...newSession,
                    sets_to_return_medium: parseInt(e.target.value)
                  })
                }
              />
            </label>
            <label>
              Hard:
              <input
                type="number"
                value={newSession.sets_to_return_hard}
                onChange={(e) =>
                  setNewSession({
                    ...newSession,
                    sets_to_return_hard: parseInt(e.target.value)
                  })
                }
              />
            </label>
            <button onClick={addSession}>Add Session</button>
          </div>
          <div style={{ marginTop: "20px" }}>
            <h2>Save As Template:</h2>
            <label>
              Template Name:
              <input
                type="text"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
              />
            </label>
            <button onClick={saveTemplate}>Save As Template</button>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default SessionManager;
