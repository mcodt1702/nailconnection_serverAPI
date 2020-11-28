const express = require("express");
const ProvidersService = require("../Services/providersService");
const ProvidersRouter = express.Router();
const jsonParser = express.json();
const path = require("path");
const bcrypt = require("bcryptjs");
const { requireAuth } = require("../Auth/jwtAuthorization");

serializeProvider = (provider) => ({
  name: provider.name,
  email: provider.email,
  password: provider.password,
  phone: provider.phone,
  zip: provider.zip,
});

serializeProvider2 = (provider) => ({
  id: provider.id,
  name: provider.name,
  email: provider.email,
  description: provider.description,
  phone: provider.phone,
  zip: provider.zip,
});

ProvidersRouter.route("/")
  .get(requireAuth, (req, res, next) => {
    ProvidersService.getAllProviders(req.app.get("db"))
      .then((user) => {
        res.json(user.map(serializeProvider2));
      })
      .catch(next);
  })

  .post(jsonParser, async (req, res, next) => {
    const { name, phone, email, zip, description } = req.body;
    const hashedpassword = await bcrypt.hash(req.body.password, 12);
    password = hashedpassword;

    const newProvider = { name, phone, email, zip, description, password };

    for (const [key, value] of Object.entries(newProvider)) {
      if (value == null) {
        return res
          .status(400)
          .json({ error: { message: `Missing '${key}' in request body` } });
      }
    }

    ProvidersService.insertProviders(req.app.get("db"), newProvider)
      .then((provider) => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${provider.id}`))
          .json(serializeProvider(provider));
      })
      .catch(next);
  });

module.exports = ProvidersRouter;
