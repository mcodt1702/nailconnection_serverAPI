const express = require("express");
const MessagesService = require("../Services/messagesService");
const MessagesRouter = express.Router();
const jsonParser = express.json();
const path = require("path");
const bcrypt = require("bcryptjs");
const { requireAuth } = require("../Auth/jwtAuthorization");

serializeMessages = (messages) => ({
  users_id: messages.users_id,
  providers_id: messages.providers_id,
  message: messages.message,
  message_date: messages.message_date,
});

MessagesRouter.route("/")
  .get(requireAuth, (req, res, next) => {
    MessagesService.getAllmessages(req.app.get("db"))
      .then((user) => {
        res.json(user.map(serializeMessages));
      })
      .catch(next);
  })

  .post(requireAuth, jsonParser, async (req, res, next) => {
    const { providers_id, message } = req.body;

    const users_id = req.user.id;

    const newMessage = { users_id, providers_id, message };

    for (const [key, value] of Object.entries(newMessage)) {
      if (value == null) {
        return res
          .status(400)
          .json({ error: { message: `Missing '${key}' in request body` } });
      }
    }

    MessagesService.insertMessages(req.app.get("db"), newMessage)
      .then((messa) => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${messa.id}`))
          .json(serializeMessages(messa));
      })
      .catch(next);
  });
// UserRouter.route("/name").get(requireAuth, (req, res, next) => {
//   res.json(req.user);
// });

module.exports = MessagesRouter;
