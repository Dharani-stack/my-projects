import passport from 'passport';
import passportLocal from 'passport-local';
import User from '../models/User';
import bcrypt from 'bcryptjs';

const LocalStrategy = passportLocal.Strategy;

passport.use(new LocalStrategy(
  { usernameField: 'email' },
  async (email, password, done) => {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return done(null, false, { message: 'Incorrect email.' });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

passport.serializeUser((user: any, done) => {
  done(null, user.email);
});

passport.deserializeUser(async (email, done) => {
    try {
      const user = await User.findOne({ email });
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });