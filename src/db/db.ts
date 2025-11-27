import { PrismaClient } from "@prisma/client"; 
const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
})
//it is a good practice to not create the instance of this prisma client again and again so  we create it only one time
export default prisma