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

// GET project by id

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

// POST a project

router.post("/", validateProject, (req, res) => {
  const project = req.body;

  Projects.insert(project)
    .then(project => res.status(200).json(project))
    .catch(error => {
      res
        .status(500)
        .json({ error: "The project could not be posted to the database." });
    });
});

// DELETE a project

router.delete("/:id", validateProjectId, (req, res) => {
  const id = req.params.id;

  Projects.remove(id)
    .then(project => res.status(200).json(project))
    .catch(error =>
      res.status(500).json({ error: "The project could not be deleted." })
    );
});

// PUT/update a project

router.put("/:id", validateProjectId, (req, res) => {
  const id = req.params.id;
  const changes = req.body;

  if (Object.keys(changes) < 1) {
    return res.status(400).json({ error: "Missing property data" });
  }

  if (changes.name || changes.description || changes.description) {
    Projects.update(id, changes)
      .then(updated => res.status(200).json(updated))
      .catch(error =>
        res.status(500).json({ error: "The project could not be updated." })
      );
  } else {
    return res
      .status(400)
      .json({ error: "Please provide a valid property to update" });
  }
});

// custom middleware

function validateProjectId(req, res, next) {
  let id = req.params.id;

  Projects.get(id)
    .then(project => {
      if (project) {
        req.project = project;
      } else {
        res.status(400).json({ message: "Invalid project id" });
      }
    })
    .catch(error =>
      res.status(500).json({ error: "The project could not be retrieved" })
    );

  next();
}

function validateProject(req, res, next) {
  if (Object.keys(req.body) < 1) {
    return res.status(400).json({ message: "Missing project data" });
  }
  if (!req.body.name || !req.body.description) {
    return res
      .status(400)
      .json({ message: "Projects require a valid name and description" });
  }

  next();
}

module.exports = router;
