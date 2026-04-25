import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as authRepository from "./auth.repository.js";
import { ensureRedis } from "../../config/config.redis.js";

const TOKEN_BLACKLIST_PREFIX = "blacklisted-token:";

export const register = async (name, email, password) => {
  const normalizedEmail = email?.trim().toLowerCase();

  // 1. Check if user exists
  const existingUser = await authRepository.findUserByEmail(normalizedEmail);
  if (existingUser) throw new Error("User already exists");

  // 2. Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // 3. Save to DB
  return await authRepository.createUser({
    name,
    email: normalizedEmail,
    password: hashedPassword,
  });
};

export const login = async (email, password) => {
  const normalizedEmail = email?.trim().toLowerCase();

  // 1. Find user
  const user = await authRepository.findUserByEmail(normalizedEmail);
  if (!user) throw new Error("Invalid credentials");

  // 2. Check password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  // 3. Generate Token
  const token = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" },
  );

  return { token, user: { id: user.id, name: user.name, email: user.email } };
};

export const logout = async (token) => {
  const decoded = jwt.decode(token);

  if (!decoded?.exp) {
    throw new Error("Invalid token");
  }

  const ttl = decoded.exp - Math.floor(Date.now() / 1000);
  const redisClient = await ensureRedis();

  if (ttl > 0 && redisClient) {
    await redisClient.setex(`${TOKEN_BLACKLIST_PREFIX}${token}`, ttl, "true");
  }

  return { message: "Logged out successfully" };
};

export const isTokenBlacklisted = async (token) => {
  const redisClient = await ensureRedis();
  if (!redisClient) {
    return false;
  }

  const result = await redisClient.get(`${TOKEN_BLACKLIST_PREFIX}${token}`);
  return result === "true";
};
