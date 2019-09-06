const router = require("express").Router();

const Actions = require("../data/helpers/actionModel.js");
const projects = require("./projectRouter.js");

// GET /actions

router.get("/", (req, res) => {
  Actions.get()
    .then(actions => {
      res.status(200).json(actions);
    })
    .catch(error => {
      res.status(500).json({ error: "The actions could not be retrieved." });
    });
});

// GET actions by id

router.get("/:id", validateActionId, (req, res) => {
  const id = req.params.id;

  Actions.get(id)
    .then(action => {
      res.status(200).json(action);
    })
    .catch(error => {
      res.status(500).json({ error: "The action could not be retrieved." });
    });
});

// POST action

router.post("/", validateAction, projects.validateProjectId, (req, res) => {
  const action = req.body;

  Actions.insert(action)
    .then(action => res.status(201).json(action))
    .catch(error =>
      res
        .status(500)
        .json({ error: "The action could not be posted to the database." })
    );
});

// DELETE action by id

router.delete("/:id", validateActionId, (req, res) => {
  const id = req.params.id;

  Actions.remove(id)
    .then(action => res.status(200).json(action))
    .catch(error =>
      res.status(500).json({ error: "The action could not be deleted." })
    );
});

// custom middleware

function validateActionId(req, res, next) {
  let id = req.params.id;

  Actions.get(id)
    .then(action => {
      if (action) {
        req.action = action;
      } else {
        res.status(400).json({ message: "Invalid action id" });
      }
    })
    .catch(error =>
      res.status(500).json({ error: "The project could not be retrieved" })
    );

  next();
}

function validateAction(req, res, next) {
  if (Object.keys(req.body) < 1) {
    return res.status(400).json({ message: "Missing action data" });
  }
  if (!req.body.description || !req.body.project_id || !req.body.notes) {
    return res.status(400).json({
      message: "Actions require a valid project_id, description, and notes."
    });
  }

  next();
}

module.exports = router;
