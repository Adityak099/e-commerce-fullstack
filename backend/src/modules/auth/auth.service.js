import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as authRepository from "./auth.repository.js";

export const register = async (name, email, password) => {
  // 1. Check if user exists
  const existingUser = await authRepository.findUserByEmail(email);
  if (existingUser) throw new Error("User already exists");

  // 2. Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // 3. Save to DB
  return await authRepository.createUser({
    name,
    email,
    password: hashedPassword,
  });
};

export const login = async (email, password) => {
  // 1. Find user
  const user = await authRepository.findUserByEmail(email);
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
