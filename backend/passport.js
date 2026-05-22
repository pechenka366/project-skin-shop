import dotenv from "dotenv";
dotenv.config();

import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as VKStrategy } from "passport-vkontakte";
import { Strategy as YandexStrategy } from "passport-yandex";
import User from "./models/User.js";

const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://bahtarma.ru"
    : "http://localhost:5000";

console.log("Google Client ID:", process.env.GOOGLE_CLIENT_ID);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${BASE_URL}/auth/google/callback`,
    },
    async (_, __, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        let user = await User.findOne({ email });

        if (!user) {
          user = await User.create({
            name: profile.displayName,
            email,
            googleId: profile.id,
            provider: "google",
            avatar: profile.photos?.[0]?.value,
          });
        }
        done(null, user);
      } catch (err) {
        done(err, null);
      }
    },
  ),
);

passport.use(
  new VKStrategy(
    {
      clientID: process.env.VK_APP_ID,
      clientSecret: process.env.VK_APP_SECRET,
      callbackURL: `${BASE_URL}/auth/vk/callback`,
      scope: ["email"],
      // apiVersion: '5.131',
    },
    async (accessToken, refreshToken, params, profile, done) => {
      try {
        const email = params.email;
        let user = await User.findOne({ email });

        if (!user) {
          user = await User.create({
            name:
              `${profile.name?.givenName} ${profile.name?.familyName}`.trim() ||
              profile.displayName,
            email: email,
            vkId: profile.id,
            provider: "vk",
          });
        }
        done(null, user);
      } catch (err) {
        done(err, null);
      }
    },
  ),
);

passport.use(
  new YandexStrategy(
    {
      clientID: process.env.YANDEX_CLIENT_ID,
      clientSecret: process.env.YANDEX_CLIENT_SECRET,
      callbackURL: `${BASE_URL}/auth/yandex/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        let user = await User.findOne({ email });

        if (!user) {
          user = await User.create({
            name: profile.displayName,
            email: email,
            yandexId: profile.id,
            provider: "yandex",
            avatar: profile.photos?.[0]?.value,
          });
        }
        done(null, user);
      } catch (err) {
        done(err, null);
      }
    },
  ),
);

export default passport;
