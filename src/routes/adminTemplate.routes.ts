
import { Router } from "express";
import { allowTemplateAccessToUser, createAdminTemplate, deleteTemplate, denyTemplateAccessToUser, fetchAdminTemplates, fetchAllTemplates, fetchUserAllowedSingleTemplate, fetchUserAllowedTemplates, updateAdminTemplate } from "../controllers/adminTemplate.controller";
import jwtConfig from "../middleware/jwt";
 
const router = Router()
  import multer from "multer";
 const upload = multer(); // memory storage
 
router.route("/admin-template")
    .post(jwtConfig.verifyAdmin,upload.none(),createAdminTemplate)  
    .get(jwtConfig.verifyAdmin,fetchAdminTemplates)
    .patch(jwtConfig.verifyAdmin,upload.none(),updateAdminTemplate)  
    .delete(jwtConfig.verifyAdmin,deleteTemplate)
   
router.route("/admin-templates")  
    .get(jwtConfig.verifyAdmin,fetchAllTemplates)   
    .patch(jwtConfig.verifyAdmin,upload.none(),allowTemplateAccessToUser)
    .delete(jwtConfig.verifyAdmin,denyTemplateAccessToUser)
    
router.route("/user-allowed-templates")  
    .get(jwtConfig.verifyUser,fetchUserAllowedTemplates)   
    router.route("/user-allowed-template")  
    .get(jwtConfig.verifyUser,fetchUserAllowedSingleTemplate)   
export default router;
