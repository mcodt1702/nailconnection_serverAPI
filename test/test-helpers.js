const bcrypt = require('bcryptjs')

  function makeUsersArray() {
    return [

...

  function cleanTables(db) {
    // code not shown
  }

+ function seedUsers(db, users) {
+   const preppedUsers = users.map(user => ({
+     ...user,
+     password: bcrypt.hashSync(user.password, 1)
+   }))
+   return db.into('blogful_users').insert(preppedUsers)
+     .then(() =>
+       // update the auto sequence to stay in sync
+       db.raw(
+         `SELECT setval('blogful_users_id_seq', ?)`,
+         [users[users.length - 1].id],
+       )
+     )
+ }

  function seedArticlesTables(db, users, articles, comments=[]) {
    // use a transaction to group the queries and auto rollback on any failure
    return db.transaction(async trx => {

+     await seedUsers(trx, users)

+     await trx.into('blogful_articles').insert(articles)
      // update the auto sequence to match the forced id values

+     await trx.raw(
+       `SELECT setval('blogful_articles_id_seq', ?)`,
+       [articles[articles.length - 1].id],
+     )
      // only insert comments if there are some, also update the sequence counter
  }

  function seedMaliciousArticle(db, user, article) {
n
+   return seedUsers(db, [user])
      .then(() =>
        db
          .into('blogful_articles')
          .insert([article])
      )
  }

...

  module.exports = {
    makeUsersArray,
    makeArticlesArray,
    makeExpectedArticle,
    makeExpectedArticleComments,
    makeMaliciousArticle,
    makeCommentsArray,

    makeArticlesFixtures,
    cleanTables,
    seedArticlesTables,
    seedMaliciousArticle,
    makeAuthHeader,
+   seedUsers,
  }