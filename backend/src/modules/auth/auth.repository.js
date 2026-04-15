import prisma from "../../config/config.prisma.js";

export const getUserByEmail = async (email) => {
  return prisma.user.findUnique({
    where: {
      email,
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
