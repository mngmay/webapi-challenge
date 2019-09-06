const router = require("express").Router();

const Projects = require("../data/helpers/projectModel.js");

// GET /projects

router.get("/", (req, res) => {
  Projects.get()
    .then(projects => {
      res.status(200).json(projects);
    })
    .catch(error => {
      res.status(500).json({ error: "The projects could not be retrieved" });
    });
});

router.get("/:id", validateProjectId, (req, res) => {
  const id = req.params.id;

  Projects.get(id)
    .then(project => {
      res.status(200).json(project);
    })
    .catch(error => {
      res.status(500).json({ error: "The project could not be retrieved" });
    });
});

// custom middleware

function validateProjectId(req, res, next) {
  let id = req.params.id;

  Projects.get(id)
    .then(project => {
      if (project) {
        req.project = project;
      } else {
        res.status(400).json({ message: "invalid project id" });
      }
    })
    .catch(error =>
      res.status(500).json({ error: "The project could not be retrieved" })
    );

  next();
}

module.exports = router;
