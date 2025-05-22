const express = require('express');
const router = require('./routes/router');
const path = require('node:path');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      // use prisma

      //     const { rows } = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
      //   const user = rows[0];

      if (!user) {
        return done(null, false, { message: 'Incorrect username' });
      }
      if (user.password !== password) {
        return done(null, false, { message: 'Incorrect password' });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

app.use(session({ secret: 'cats', resave: false, saveUninitialized: false }));
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

app.use('/', router);

app.listen(999, () => {
  console.log('Listening on port 999...');
});
