import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../../config/config.prisma.js"; // Correct path: Up 2 levels to src, then into config

// Register a new user
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // 1. Check if user already exists using Prisma
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // 2. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Insert new user into the database
    // Prisma returns the object directly, no need for .rows[0]
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
      // Select only what you want to send back (safety)
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    res.status(201).json({ user: newUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login user logic
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    // 1. Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // 3. Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    res.json({
      message: "Login successful",
      token,
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
