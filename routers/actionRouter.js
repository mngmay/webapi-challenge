const router = require("express").Router();

const Actions = require("../data/helpers/actionModel.js");
const Projects = require("../data/helpers/projectModel.js");
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

router.post("/", validateAction, validateProjectId, (req, res) => {
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
    .then(action =>
      res
        .status(200)
        .json({ message: `Action ${id} has been successfully deleted.` })
    )
    .catch(error =>
      res.status(500).json({ error: "The action could not be deleted." })
    );
});

// PUT/update action by id  //did projectId validation w/o middleware for more reps

router.put("/:id", validateActionId, (req, res) => {
  const id = req.params.id;
  const projectId = req.body.project_id;
  const changes = req.body;

  if (Object.keys(changes) < 1) {
    return res.status(400).json({ error: "Missing property data" });
  }

  Projects.get(projectId)
    .then(project => {
      if (project) {
        if (
          changes.description ||
          changes.notes ||
          changes.project_id ||
          changes.completed
        ) {
          Actions.update(id, changes)
            .then(updated => res.status(200).json(updated))
            .catch(error =>
              res
                .status(500)
                .json({ error: "The action could not be updated." })
            );
        } else {
          return res
            .status(400)
            .json({ error: "Please provide a valid property to update." });
        }
      } else {
        return res.status(400).json({ error: "Invalid project id." });
      }
    })
    .catch(error =>
      res.status(500).json({ error: "The action could not be updated." })
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

function validateProjectId(req, res, next) {
  let id = req.body.project_id;

  Projects.get(id)
    .then(project => {
      if (project) {
        next();
      } else {
        res.status(400).json({ message: "Invalid project id" });
      }
    })
    .catch(error =>
      res.status(500).json({ error: "The project could not be retrieved" })
    );
}

module.exports = router;
