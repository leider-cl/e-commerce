import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { pool } from "../config/db.js";

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || "/api/auth/google/callback",
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const googleId = profile.id;
          const email = profile.emails?.[0]?.value;
          const name = profile.displayName;

          if (!email) {
            return done(new Error("Google account has no email"), null);
          }

          const existing = await pool.query(
            "SELECT id, name, email, role FROM users WHERE google_id = $1",
            [googleId],
          );

          if (existing.rows.length > 0) {
            return done(null, existing.rows[0]);
          }

          const existingByEmail = await pool.query(
            "SELECT id, name, email, role FROM users WHERE email = $1",
            [email],
          );

          if (existingByEmail.rows.length > 0) {
            const user = existingByEmail.rows[0];
            await pool.query(
              "UPDATE users SET google_id = $1, email_verified = TRUE WHERE id = $2",
              [googleId, user.id],
            );
            return done(null, { ...user });
          }

          const result = await pool.query(
            `INSERT INTO users (name, email, google_id, email_verified, role)
             VALUES ($1, $2, $3, TRUE, 'customer')
             RETURNING id, name, email, role`,
            [name, email, googleId],
          );

          done(null, result.rows[0]);
        } catch (err) {
          done(err, null);
        }
      },
    ),
  );
}

export default passport;
