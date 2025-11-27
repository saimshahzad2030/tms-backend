import { Request, Response } from "express";
import prisma from "../db/db";
import bcrypt from "bcrypt";
import jwtConfig from "../middleware/jwt";


export const createAdminTemplate = async (req: Request, res: Response) => {
  try {
    const { name, description, categories, steps } = req.body;
    const adminId: number = res.locals.user?.id;

    if (!adminId) {
      return res.status(401).json({ message: "Unauthorized: Admin required" });
    }

    if (!name || !description || !categories || categories.length === 0) {
      return res.status(400).json({ message: "Name, description, and categories are required." });
    }

    if (!steps || !Array.isArray(steps)) {
      return res.status(400).json({ message: "Steps must be an array" });
    }

    // Create the AdminTemplate
    const newTemplate = await prisma.adminTemplate.create({
      data: {
        name,
        description,
        createdBy: { connect: { id: adminId } },
        categories: categories,
        steps: {
          create: steps.map((step, index) => ({
            name: step.name,
            description: step.description,
            type: step.type,
            linkedStepId: step.linkedStepId,
            trigger: step.trigger,
            popupDescription: step?.popup?.description,
            completed: step.completed,

            unCheckEnabled: step.unCheckEnabled,
            columnDetailsChecked: step.columnDetailsChecked,
            unCheckOption: step.unCheckOption,
            timeSensitiveColors: step.timeSensitiveColors,
            isTimeSensitive: step.isTimeSensitive, 
            futureColumnThings  : step.futureColumnThings,
            columnDetails: step.columnDetails,
            linkedStep: step.linkedStep  
            // futureColumnThings: step.futureColumnThings
            //   ? { create: step.futureColumnThings }
            //   : undefined,
            // columnDetails: step.columnDetails
            //   ? { create: step.columnDetails }
            //   : undefined
          }))
        }
      }
      , include: { steps: true }
    });

     
      const indexToIdMap = newTemplate.steps.reduce((acc, step, i) => {
      acc[i] = step.id; // maps index in original array to created step id
      return acc;
    }, {} as Record<number, number>);

    // Step 3: Update steps that have trigger = "relation"
    const relationSteps = steps
      .map((step, i) => ({ step, i }))
      .filter(({ step }) => step.trigger === "relation" && step.linkedStep?.index !== undefined);
await Promise.all(
  relationSteps.map(({ step, i }) => {
    if (!step.linkedStep) return;

    // Remove index before updating
    const { index, ...linkedStepWithoutIndex } = step.linkedStep;

    return prisma.step.update({
      where: { id: indexToIdMap[i] },
      data: { linkedStep: { ...linkedStepWithoutIndex, id: indexToIdMap[index] } },
    });
  })
);

    const template = await prisma.adminTemplate.findMany({
      where: { id: newTemplate.id },
      include: { steps: true },
    });
    res.status(201).json({ message: "AdminTemplate created successfully",template });

  } catch (error) {
    console.error("Error creating AdminTemplate:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};
export const updateAdminTemplate = async (req: Request, res: Response) => {
try {
const {  name, description, categories, steps } = req.body;
const id = Number(req.query.id);
const adminId: number = res.locals.user?.id;

 
if (!adminId) {
  return res.status(401).json({ message: "Unauthorized: Admin required" });
}

if (!id) {
  return res.status(400).json({ message: "Template ID is required." });
}

if (!name || !description || !categories || categories.length === 0) {
  return res.status(400).json({ message: "Name, description, and categories are required." });
}

if (!steps || !Array.isArray(steps)) {
  return res.status(400).json({ message: "Steps must be an array" });
}

// Delete existing steps first (to avoid foreign key issues)
await prisma.step.deleteMany({
  where: { templateId: id },
});

// Update the template
const updatedTemplate = await prisma.adminTemplate.update({
  where: { id },
  data: {
    name,
    description,
    categories: categories,
    createdBy: { connect: { id: adminId } },
    steps: {
  create: steps.map((step) => {
    let linkedStepWithoutIndex = undefined;
    if (step.linkedStep) {
      const { index, ...rest } = step.linkedStep;
      linkedStepWithoutIndex = rest;
    }
    return {
      name: step.name,
      description: step.description,
      type: step.type,
      linkedStepId: step.linkedStepId,
      trigger: step.trigger,
      popupDescription: step?.popup?.description,
      completed: step.completed,
      unCheckEnabled: step.unCheckEnabled,
      columnDetailsChecked: step.columnDetailsChecked,
      unCheckOption: step.unCheckOption,
      timeSensitiveColors: step.timeSensitiveColors,
      isTimeSensitive: step.isTimeSensitive,
      futureColumnThings: step.futureColumnThings,
      columnDetails: step.columnDetails,
      linkedStep: linkedStepWithoutIndex,
    };
  }),
},

  },
  include: { steps: true },
});

// Map step indices to newly created step IDs
const indexToIdMap = updatedTemplate.steps.reduce((acc, step, i) => {
  acc[i] = step.id;
  return acc;
}, {} as Record<number, number>);

// Update steps with trigger = "relation"
const relationSteps = steps
  .map((step, i) => ({ step, i }))
  .filter(({ step }) => step.trigger === "relation" && step.linkedStep?.index !== undefined);

await Promise.all(
  relationSteps.map(({ step, i }) => {
    if (!step.linkedStep) return;

    // Remove index before updating
    const { index, ...linkedStepWithoutIndex } = step.linkedStep;

    return prisma.step.update({
      where: { id: indexToIdMap[i] },
      data: { linkedStep: { ...linkedStepWithoutIndex, id: indexToIdMap[index] } },
    });
  })
);

const template = await prisma.adminTemplate.findUnique({
  where: { id },
  include: { steps: true },
});

res.status(200).json({ message: "AdminTemplate updated successfully", template });
 

} catch (error) {
console.error("Error updating AdminTemplate:", error);
res.status(500).json({ message: "Internal server error", error });
}
};

export const fetchAdminTemplates = async (req: Request, res: Response) => {
  try { 
    const adminId: number = res.locals.user?.id;
 
    const templates = await prisma.adminTemplate.findMany({
      where: { createdById: adminId},
       include:{steps:true ,enabledUsers:true  } 
    });
    res.status(201).json({ message: "Fetched Admin Templates",templates });

  } catch (error) {
    console.error("Error creating AdminTemplate:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const fetchAllTemplates = async (req: Request, res: Response) => {
  try {  
    const templates = await prisma.adminTemplate.findMany({include:{steps:true ,enabledUsers:true }});
    res.status(201).json({ message: "Fetched All Templates",templates });

  } catch (error) {
    console.error("Error creating AdminTemplate:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};
export const deleteTemplate = async (req: Request, res: Response) => {
  try {  
    const {templateId} = req.body;
    const adminId: number = res.locals.user?.id;
    const templateToDelete = await prisma.adminTemplate.findUnique({
      where:{id:templateId,createdById: adminId,},
       
    });
    if(!templateToDelete){
      return res.status(404).json({ message: "Template not found or you don't have permission to delete it" });
    }
    await prisma.step.deleteMany({
  where: { templateId: templateId },
}).then(async ()=>{
  await prisma.adminTemplate.delete({
    where:{id:templateId,createdById: adminId,},
        });
    res.status(201).json({ message: "Template Successfully deleted" });
  })

  } catch (error) {
    console.error("Error Deleting this template", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};
export const allowTemplateAccessToUser = async (req: Request, res: Response) => {
  try {  
    const {templateId,userId} = req.body;
    const templates = await prisma.adminTemplate.update({
      where:{id:templateId},
       data:{
        enabledUsers:{
          connect:{id:userId}
        } 
       },
       include:{steps:true ,enabledUsers:true } 
    });
    res.status(201).json({ message: "This user allowed access to the template",templates });

  } catch (error) {
    console.error("Error creating AdminTemplate:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};
export const denyTemplateAccessToUser = async (req: Request, res: Response) => {
  try {  
    const {templateId,userId} = req.body;
    const templates = await prisma.adminTemplate.update({
      where:{id:templateId},
       data:{
        enabledUsers:{
          delete:{id:userId}
        } 
       },
       include:{steps:true ,enabledUsers:true } 
    });
    res.status(201).json({ message: "User Access to this template Denied",templates });

  } catch (error) {
    console.error("Error creating AdminTemplate:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};
