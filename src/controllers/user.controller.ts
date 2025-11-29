import { Request, Response } from "express";
import prisma from "../db/db";
import bcrypt from "bcrypt";
import jwtConfig from "../middleware/jwt"; 
export const createUser = async (req: Request, res: Response) => {
  try {
    console.log(req.body)
    const { firstName, lastName, email, username, password } = req.body;
    if (    !email || !username || !password) {
      return res.status(400).json({
        message: 'All fields are required.',
      });
    }
    const existingUser = await prisma.user.findFirst({
      where: {
        email
      }
    });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const usernameExist = await prisma.user.findUnique({
      where: {
        username
      }
    });
    if (usernameExist) {
      return res.status(400).json({ message: "Usernname already taken" });
    }
    let hashedPassword = await bcrypt.hash(password, 10);
    // Create the user
    const newUser = await prisma.user.create({
      data: {
        firstName: firstName || "firstName",
        lastName: lastName || "lastName",
        email, 
        token:"",
        username, 
        password: hashedPassword, // Consider hashing this before storing
      }
    });

    res.status(201).json({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    console.log(req.body)
    if (!email || !password) {
      return res.status(404).json({ message: "All fields requried" });
    }

    const userExist = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });
    if (!userExist) {
      return res.status(409).json({ message: "Wrong Credentials" });
    }
    const encryptedPassword = await bcrypt.compare(password, userExist.password);
    console.log(encryptedPassword,"sdsad")
    if (!encryptedPassword) {
      return res.status(409).json({ message: "Wrong credentials" });

    }
    const token = jwtConfig.sign({
      id: userExist.id,
      email: userExist.email,
      username: userExist.username,
      role: userExist.isAdmin ? "admin" : "user",
    })
    
    const updatedUser = await prisma.user.update({
      where: {
        id: userExist.id,
      },
      data: {
        token
      },
       
    })
    res.status(200).json({ message: "Login Successfull", updatedUser });
  } catch (error) {
    res.status(520).json({ message: "Network Error",error });
  }
}
 

export const fetchAllUsers = async (req: Request, res: Response) => {
  try {  
    const users = await prisma.user.findMany({where:{isAdmin:false}});
    res.status(201).json({ message: "All Users are fetched succesfully",users });

  } catch (error) {
    console.error("Error fetching Users", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};