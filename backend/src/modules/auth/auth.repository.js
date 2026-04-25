import prisma from "../../config/config.prisma.js";

export const findUserByEmail = async (email) => {
  if (!email) return null;

  return prisma.user.findFirst({
    where: {
      email: email.trim().toLowerCase(),
      isActive: true,
    },
  });
};

export const createUser = async (userData) => {
  return await prisma.user.create({
    data: userData,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });
};
