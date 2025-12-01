import { Request, Response, NextFunction } from "express";
// import {JwtPayload} from "jsonwebtoken"; 
import jwt, { JwtPayload } from 'jsonwebtoken'
// import config from "../config";
import prisma from "../db/db";  
const jwtConfig = {
  sign(payload: object): string {
    console.log("payload",payload) 
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY as string);
    
    return token;
  },
  verifyUser(req: Request, res: Response, next: NextFunction) {
    const authHeader = req?.headers?.authorization;
 console.log('authHeader', req?.headers?.authorization )
    try {
      if (authHeader) {
        const [bearer, token] = authHeader.split(" ");
        jwt.verify(token, process.env.JWT_SECRET_KEY as string, async (err: any, decoded: any) => {
          if (err) {
            res.status(401).json({ message: "You need to login first" });
          } else {
            const user = await prisma.user.findUnique({
              where: {
                id:decoded.id
              }
            })
            if (user) {
              res.locals.user = user
              next();
            }
            else {
              return res.status(401).json({ message: "You need to login first" });

            }

          }
        });
      } else {
        res.status(401).json({ message: "You need to login first" });
      }
    } catch (error) {
      // console.log(err);
      res.status(520).json({ error: "Network Error" });
    }
  },
   verifyAdmin(req: Request, res: Response, next: NextFunction) {
    const authHeader = req?.headers?.authorization;

    try {
      if (authHeader) {
        const [bearer, token] = authHeader.split(" ");
        console.log(token,"token")
        jwt.verify(token, process.env.JWT_SECRET_KEY as string, async (err: any, decoded: any) => {
          console.log("decoded",decoded)
          if (err) {
            res.status(401).json({ message: "You need to login first",err });
          } else {
            const user = await prisma.user.findFirst({
              where: {
                id:decoded.id
              }
            })
            if (user) {
             if(user.isAdmin){
               res.locals.user = user 
              console.log(user,"user")
              next();
             }
             else{
              return res.status(401).json({ message: "You need to login first" });

             }
            }
            else {
              return res.status(401).json({ message: "You need to login first" });

            }

          }
        });
         
      } else {
        res.status(401).json({ message: "You need to login first" });
      }
    } catch (error) {
      // console.log(err);
      res.status(520).json({ error: "Network Error" });
    }
  },
  logOut(req: Request, res: Response) {
    const authHeader = req?.headers?.authorization;

    try {
      if (authHeader) {
        const [bearer, token] = authHeader.split(" ");

        jwt.verify(token, process.env.JWT_SECRET_KEY as string, async (err: any, decoded: any) => {
          if (err) {
            res.status(401).json({ message: "You are not authorized" });
          } else {
            const fetchUser = await prisma.user.findFirst({
              where: {
                token: token
              }
            })
            const updatedUser = await prisma.user.update({
              where: {
                id: fetchUser.id
              },
              data: {
                token: null
              }
            })
            return res.status(200).json({ message: "User Logged out", updatedUser })
          }
        });
      } else {
        res.status(401).json({ message: "You are not authorized" });
      }
    } catch (error) {
      res.status(520).json({ error: "Network Error" });
    }
  },
  authGuard(req: Request, res: Response) {
    const authHeader = req?.headers?.authorization;
    console.log("req?.headers")
    console.log(req?.headers)
    console.log("req?.headers")
    try {
      if (authHeader) {
        console.log(res.locals.user)
        const [bearer, token] = authHeader.split(" ");

        jwt.verify(token, process.env.JWT_SECRET_KEY as string, async (err: any, decoded: any) => {
          if (err) {
            res.status(401).json({ message: "You are not authorized" });
          } else {
            const user = await prisma.user.findFirst({
              where: {
                token
              }
            })
            if (user) {
              return res.status(200).json({ message: "User Authorized",isAdmin:user.isAdmin })

            }
            return res.status(200).json({ message: "You are not authorized" })
          }
        });
      } else {
        res.status(401).json({ message: "You are not authorized" });
      }
    } catch (error) {
      // console.log(err);
      res.status(520).json({ error: "Network Error" });
    }
  },
  autoLogin(req: Request, res: Response) {
    const authHeader = req?.headers?.authorization;

    try {
      if (authHeader) {
        const [bearer, token] = authHeader.split(" ");


        jwt.verify(token, process.env.JWT_SECRET_KEY as string, async (err: any, decoded: any) => {
          console.log(decoded)
          if (err) {
            res.status(401).json({ message: "You are not authorized" });
          } else {  
 
            // const user = await prisma.user.findFirst({
            //   where: {
            //     token: token
            //   },
            

            // })



            // if (!user) {
            //   return res.status(401).json({ message: "You are not authorized" });

            // }
            const {id,...details} = decoded  
            return res.status(200).json({ message: "Logged in Succesfully",user: details })
          }
        })

      } else {
        res.status(401).json({ message: "You are not authorized" });
      }
    } catch (error) {
      // console.log(err);
      res.status(520).json({ error: "Network Error" });
    }
  },

};

export default jwtConfig
