
import { Router } from "express";
import { allowTemplateAccessToUser, createAdminTemplate, deleteTemplate, denyTemplateAccessToUser, fetchAdminTemplates, fetchAllTemplates, fetchUserAllowedSingleTemplate, fetchUserAllowedTemplates, updateAdminTemplate } from "../controllers/adminTemplate.controller";
import jwtConfig from "../middleware/jwt";
 
const router = Router()
 
router.route("/admin-template")
    .post(jwtConfig.verifyAdmin,createAdminTemplate)  
    .get(jwtConfig.verifyAdmin,fetchAdminTemplates)
    .patch(jwtConfig.verifyAdmin,updateAdminTemplate)  
    .delete(jwtConfig.verifyAdmin,deleteTemplate)
   
router.route("/admin-templates")  
    .get(jwtConfig.verifyAdmin,fetchAllTemplates)   
    .patch(jwtConfig.verifyAdmin,allowTemplateAccessToUser)
    .delete(jwtConfig.verifyAdmin,denyTemplateAccessToUser)
    
router.route("/user-allowed-templates")  
    .get(jwtConfig.verifyUser,fetchUserAllowedTemplates)   
    router.route("/user-allowed-template")  
    .get(jwtConfig.verifyUser,fetchUserAllowedSingleTemplate)   
export default router;
