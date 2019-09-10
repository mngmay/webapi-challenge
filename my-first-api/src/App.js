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
      <h1>List of Projects</h1>
      <div className="project-details">
        <div className="project-name">
          <h4>Name</h4>
          {projects.map(project => (
            <div>{project.name}</div>
          ))}
        </div>
        <div className="project-description">
          <h4>Description</h4>
          {projects.map(project => (
            <div>{project.description}</div>
          ))}
        </div>
        <div className="project-status">
          <h4>Status</h4>
          {projects.map(project => (
            <div>{project.completed ? "Done" : "Not Completed"}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
