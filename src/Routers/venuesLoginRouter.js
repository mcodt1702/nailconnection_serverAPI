const express = require("express");
const AuthService = require("../Services/authService");
const authRouterVenues = express.Router();
const jsonParser = express.json();

authRouterVenues.post("/", jsonParser, (req, res, next) => {
  const { email, password } = req.body;
  const loginUser = { email, password };

  for (const [key, value] of Object.entries(loginUser))
    if (value == null)
      return res.status(400).json({
        error: `Missing '${key}' in request body`,
      });

  AuthService.getUserWithUserNameVenues(
    req.app.get("db"),
    loginUser.email
  ).then((dbUser) => {
    if (!dbUser)
      return res.status(400).json({
        error: "Incorrect email or password",
      });
    return AuthService.comparePasswords(loginUser.password, dbUser.password)
      .then((compareMatch) => {
        if (!compareMatch)
          return res.status(400).json({
            error: "password doesnt match",
          });

        const sub = dbUser.email;
        const payload = { user_id: dbUser.id };
        res.send({
          authToken: AuthService.createJwt(sub, payload),
          user_id: dbUser.id,
        });
      })
      .catch(next);
  });
});

module.exports = authRouterVenues;
