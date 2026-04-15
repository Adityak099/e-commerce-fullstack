import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default prisma;

// This file initializes the Prisma Client and exports it for use in other parts of the application. It connects to the database using the connection string defined in the .env file (DATABASE_URL). You can import this prisma instance in your controllers or services to interact with the database.