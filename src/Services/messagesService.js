const knex = require("knex");

const MessagesService = {
  getAllmessages(knex) {
    return knex.select("*").from("messages");
  },

  insertMessages(knex, newMessage) {
    return knex
      .insert(newMessage)
      .into("messages")
      .returning("*")
      .then((rows) => {
        return rows[0];
      });
  },

  getConversation(knex, users) {
    return knex
      .select("*")
      .from("messages")
      .where((user_id = users));
  },
  getVenueConversation(knex, providers) {
    return knex
      .select("*")
      .from("messages")
      .where((providers_id = providers));
  },
};

module.exports = MessagesService;
