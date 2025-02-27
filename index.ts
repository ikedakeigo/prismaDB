import express, { Request, Response } from "express";
import { PrismaClient, Prisma } from "@prisma/client";

const app = express();
const port = 3000;

const prisma = new PrismaClient();

app.use(express.json());

app.get("/users", async (req: Request, res: Response) => {
  const users = await prisma.user.findMany();
  return res.json(users);
});

app.post("/users", async (req: Request, res: Response) => {
  const { name, email } = req.body;
  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
      },
    });
    return res.json(user);
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError)
      if (e.code === "P2002") {
        console.log("There is a unique constraint violation, a new user cannot be created with this email");
      }
    return res.status(400).json(e);
  }
});

app.listen(port, () => console.log(`Example app listennig on port ${port}! やったね`));
