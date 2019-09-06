const router = require("express").Router();

const Actions = require("../data/helpers/actionModel.js");

// GET /actions

router.get("/", (req, res) => {
  Actions.get()
    .then(actions => {
      res.status(200).json(actions);
    })
    .catch(error => {
      res.status(500).json({ error: "The actions could not be retrieved" });
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
      res.status(500).json({ error: "The action could not be retrieved" });
    });
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

module.exports = router;
