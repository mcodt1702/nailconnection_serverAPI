const express = require("express");
const MessagesService = require("../Services/messagesService");
const MessagesRouter = express.Router();
const jsonParser = express.json();
const path = require("path");
const bcrypt = require("bcryptjs");
const { requireAuth, requireAuthVenues } = require("../Auth/jwtAuthorization");
const ProvidersService = require("../Services/providersService");

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

MessagesRouter.route("/conversation").get(
  requireAuth,
  jsonParser,
  (req, res, next) => {
    const id = req.user.id;
    //const { providers_id } = req.body;
    let users = { users_id: id };
    //let providers = { providers_id };

    MessagesService.getConversation(req.app.get("db"), users)
      .then((user) => {
        res.json(user.map(serializeMessages));
      })
      .catch(next);
  }
);

MessagesRouter.route("/vconver").get(
  requireAuthVenues,
  jsonParser,
  (req, res, next) => {
    const id = req.provider.id;

    let providers = { providers_id: id };

    MessagesService.getVenueConversation(req.app.get("db"), providers)
      .then((providers) => {
        res.json(providers.map(serializeMessages));
      })
      .catch(next);
  }
);
MessagesRouter.route("/messagesVen")
  .get(requireAuthVenues, (req, res, next) => {
    MessagesService.getVenueConversation(req.app.get("db"))
      .then((user) => {
        res.json(user.map(serializeMessages));
      })
      .catch(next);
  })
  .post(requireAuthVenues, jsonParser, async (req, res, next) => {
    const { users_id, message, sender } = req.body;

    const providers_id = req.provider.id;

    const newMessage = { users_id, providers_id, message, sender };

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
module.exports = MessagesRouter;
