import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { config } from "./env";
import { UserService } from "@/services/user.service";

// Configure Google OAuth strategy - completely stateless
passport.use(
  new GoogleStrategy(
    {
      clientID: config.google.clientId,
      clientSecret: config.google.clientSecret,
      callbackURL: config.google.callbackUrl,
    },
    async (profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        const firstName = profile.name?.givenName;
        const lastName = profile.name?.familyName;

        if (!email || !firstName) {
          return done(new Error("Missing required profile information"), null);
        }

        // Check if user already exists
        let user = await UserService.findByEmail(email);

        if (user) {
          // If user exists but wasn't created via Google, update them to enable Google auth
          if (!user.isGoogleAuth) {
            user = await UserService.updateUser(user.id, {
              isGoogleAuth: true,
            });
          }
        } else {
          // Create new user for Google auth - password is optional for Google users
          user = await UserService.createUser({
            email,
            firstName,
            lastName: lastName || "",
            password: "", // Empty password for Google users
            isGoogleAuth: true,
          });
        }

        return done(null, user);
      } catch (error) {
        console.error("Google OAuth error:", error);
        return done(error, null);
      }
    }
  )
);

// No serialization needed for stateless approach
export default passport;
