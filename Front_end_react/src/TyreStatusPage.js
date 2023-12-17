import React, { useEffect, useState } from "react";
import axios from "axios";

const TyreStatusPage = () => {
  const [tyreData, setTyreData] = useState([]);
  const [sessionData, setSessionData] = useState([]);
  const [selectedSessions, setSelectedSessions] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const getSessionNameById = (sessionId) => {
    const session = sessionData.find((s) => s.id === sessionId);
    return session ? session.name : "N/A";
  };

  //
  useEffect(() => {
    const fetchTyreData = async () => {
      try {
        const tyreResponse = await axios.get(
          `http://127.0.0.1:8000/api/tyre_sets/?page=${currentPage}`
        );
        setTyreData(tyreResponse.data.results);
        setTotalRecords(tyreResponse.data.count); //

        const sessionResponse = await axios.get(
          "http://127.0.0.1:8000/api/weekend_session/"
        );
        setSessionData(sessionResponse.data.results);

        const calculatedTotalPages = Math.ceil(tyreResponse.data.count / 15); // 假设每页有 10 条记录
        setTotalPages(calculatedTotalPages);
      } catch (error) {
        console.error("An error occurred while fetching data:", error);
      }
    };

    fetchTyreData();
  }, [currentPage]);

  //

  const updateTyre = async (
    tyreId,
    type,
    plannedReturnSession,
    usedInSessions
  ) => {
    const tyreToUpdate = tyreData.find((tyre) => tyre.id === tyreId);

    const processedPlannedReturnSession =
      plannedReturnSession !== undefined
        ? plannedReturnSession
        : tyreToUpdate.planned_return_session;

    let processedUsedInSessions;
    if (usedInSessions === "N/A") {
      processedUsedInSessions = []; //
    } else if (usedInSessions) {
      processedUsedInSessions = [parseInt(usedInSessions)]; //
    } else {
      processedUsedInSessions = tyreToUpdate.used_in_sessions || [];
    }

    const updatedTyre = {
      ...tyreToUpdate,
      type,
      planned_return_session:
        processedPlannedReturnSession === "N/A"
          ? null
          : processedPlannedReturnSession,
      used_in_sessions: processedUsedInSessions,
      state:
        processedUsedInSessions && processedUsedInSessions.length > 0
          ? "Used"
          : "New"
    };

    const updatedTyres = tyreData.map((tyre) =>
      tyre.id === tyreId ? updatedTyre : tyre
    );

    try {
      const url = `http://127.0.0.1:8000/api/tyre_sets/${tyreId}/`;
      const response = await axios.put(url, updatedTyre);

      const updatedTyreFromResponse = response.data;
      const updatedTyres = tyreData.map((tyre) =>
        tyre.id === tyreId ? updatedTyreFromResponse : tyre
      );

      setTyreData(updatedTyres);
      alert("Updated successfully");
    } catch (error) {
      console.error("An error occurred while updating data:", error);
    }
  };

  return (
    <div>
      <h1>Tyre Status</h1>
      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Type</th>
            <th>State</th>
            <th>Current Planned Return Session</th>
            <th>Planned Return Session</th>
            <th>Current Used In Sessions</th>
            <th>Used In Sessions</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tyreData.map((tyre, index) => (
            <tr key={index}>
              <td>{tyre.id}</td>
              <td>{tyre.type}</td>
              <td>{tyre.state}</td>
              <td>
                {tyre.planned_return_session
                  ? `${getSessionNameById(tyre.planned_return_session)}-${
                      tyre.planned_return_session
                    }`
                  : "N/A"}
              </td>
              <td>
                <select
                  value={
                    selectedSessions[tyre.id]?.plannedReturnSession ||
                    tyre.planned_return_session ||
                    "N/A"
                  }
                  onChange={(e) =>
                    setSelectedSessions({
                      ...selectedSessions,
                      [tyre.id]: {
                        ...selectedSessions[tyre.id],
                        plannedReturnSession: e.target.value
                      }
                    })
                  }
                >
                  <option value="N/A">N/A</option>
                  {sessionData.map((session) => (
                    <option key={session.id} value={session.id}>
                      {`${session.name}-${session.id}`}
                    </option>
                  ))}
                </select>
              </td>
              <td>{tyre.used_in_sessions?.join(", ") || "N/A"}</td>
              <td>
                <select
                  value={
                    selectedSessions[tyre.id]?.usedInSessions ||
                    (tyre.used_in_sessions && tyre.used_in_sessions[0]) ||
                    "N/A"
                  }
                  onChange={(e) =>
                    setSelectedSessions({
                      ...selectedSessions,
                      [tyre.id]: {
                        ...selectedSessions[tyre.id],
                        usedInSessions: e.target.value
                      }
                    })
                  }
                >
                  <option value="N/A">N/A</option>
                  {sessionData.map((session) => (
                    <option key={session.id} value={session.id}>
                      {`${session.name}-${session.id}`}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <button
                  onClick={() =>
                    updateTyre(
                      tyre.id,
                      tyre.type,
                      selectedSessions[tyre.id]?.plannedReturnSession,
                      selectedSessions[tyre.id]?.usedInSessions
                    )
                  }
                >
                  Update
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button
          disabled={currentPage <= 1}
          onClick={() =>
            setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))
          }
        >
          Previous
        </button>
        <span>Current Page: {currentPage}</span>
        <button
          disabled={currentPage >= totalPages}
          onClick={() =>
            setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages))
          }
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TyreStatusPage;
