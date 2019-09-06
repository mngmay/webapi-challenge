import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [projects, setProjects] = useState([]);
  console.log(projects);

  useEffect(() => {
    getProjects();
  }, []);

  const getProjects = () => {
    axios
      .get("http://localhost:5000/projects")
      .then(res => {
        console.log(res.data);
        setProjects(res.data);
      })
      .catch(err => {
        console.log(err.message);
      });
  };

  return (
    <div className="App">
      {projects.map(project => (
        <div>{project.name}</div>
      ))}
    </div>
  );
}

export default App;
