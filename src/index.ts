import express, { Request, Response } from 'express';
import prisma from './db/db'
import userRoutes from './routes/user.routes'; 
import adminTemplateRoutes from './routes/adminTemplate.routes'; 
import cors from 'cors'
import bodyParser from 'body-parser';
const app = express();
app.use(cors())
app.use(
  bodyParser.json({
    verify: (req: Request, res: Response, buf) => {
      req.body = buf;
    },
  })
);
app.use("/api", userRoutes); 
app.use("/api", adminTemplateRoutes); 
const port = process.env.PORT || 3000;

app.get('/', async (req: Request, res: Response) => {
  try {
    const courses = await prisma.user.findMany({ take: 10 })
    res.status(200).json({ message: 'Users fetched', courses })

  } catch (error) {
    res.status(500).json({ error: error });
  }
});

app.listen(port, async () => {

  console.log(`Server is running on http://localhost:${port} `);
});
