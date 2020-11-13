const knex = require("knex");

const ProvidersService = {
  getAllProviders(knex) {
    return knex.select("*").from("providers");
  },

  insertProviders(knex, newProvider) {
    return knex
      .insert(newProvider)
      .into("providers")
      .returning("*")
      .then((rows) => {
        return rows[0];
      });
  },
};

module.exports = ProvidersService;
