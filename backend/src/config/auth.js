import { config } from "./env.js";

export const authConfig = {
  jwtSecret: config.jwtSecret,
  jwtExpiresIn: config.jwtExpiresIn,
};
