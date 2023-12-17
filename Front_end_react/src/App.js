import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function App() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    soft_sets: 0,
    medium_sets: 0,
    hard_sets: 0
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name.endsWith("sets") ? parseInt(value, 10) : value
    });
  };

  const handleSubmit = async () => {
    const total_sets =
      formData.soft_sets + formData.medium_sets + formData.hard_sets;
    const payload = {
      ...formData,
      total_sets
    };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/weekend_format/`,
        payload
      );
      navigate("/session-manager", { state: { data: response.data } });
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const handleReset = async () => {
    try {
      await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/api/weekend_format/clear_all_data/`
      );
      window.location.reload();
    } catch (error) {
      console.error("An error occurred while resetting data:", error);
    }
  };

  const resetDataKeepTemplate = () => {
    axios
      .post(
        `${process.env.REACT_APP_BACKEND_URL}/api/weekend_format/clear_all_data_keepTemplate/`
      )
      .then((response) => {
        window.location.reload();
      })
      .catch((error) => {
        console.error("There was an error resetting the data:", error);
      });
  };

  return (
    <div>
      <h1>Let's Start</h1>
      <form>
        <div>
          <label>Week Name: </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Description: </label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Soft Sets: </label>
          <input
            type="number"
            name="soft_sets"
            value={formData.soft_sets}
            onChange={handleChange}
            min="0"
          />
        </div>
        <div>
          <label>Medium Sets: </label>
          <input
            type="number"
            name="medium_sets"
            value={formData.medium_sets}
            onChange={handleChange}
            min="0"
          />
        </div>
        <div>
          <label>Hard Sets: </label>
          <input
            type="number"
            name="hard_sets"
            value={formData.hard_sets}
            onChange={handleChange}
            min="0"
          />
        </div>
        <button type="button" onClick={handleSubmit}>
          Submit
        </button>
        <button onClick={resetDataKeepTemplate}>
          Reset All Data But Keep Template
        </button>

        <button type="button" onClick={handleReset}>
          Reset All Data
        </button>
      </form>
      <p>Note: Clicking "Reset All Data" will erase all the existing data.</p>
    </div>
  );
}
