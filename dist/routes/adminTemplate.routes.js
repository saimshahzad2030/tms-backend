"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminTemplate_controller_1 = require("../controllers/adminTemplate.controller");
const jwt_1 = __importDefault(require("../middleware/jwt"));
const router = (0, express_1.Router)();
router.route("/admin-template")
    .post(jwt_1.default.verifyAdmin, adminTemplate_controller_1.createAdminTemplate)
    .get(jwt_1.default.verifyAdmin, adminTemplate_controller_1.fetchAdminTemplates)
    .patch(jwt_1.default.verifyAdmin, adminTemplate_controller_1.updateAdminTemplate)
    .delete(jwt_1.default.verifyAdmin, adminTemplate_controller_1.deleteTemplate);
router.route("/admin-templates")
    .get(jwt_1.default.verifyAdmin, adminTemplate_controller_1.fetchAllTemplates)
    .patch(jwt_1.default.verifyAdmin, adminTemplate_controller_1.allowTemplateAccessToUser)
    .delete(jwt_1.default.verifyAdmin, adminTemplate_controller_1.denyTemplateAccessToUser);
exports.default = router;
//# sourceMappingURL=adminTemplate.routes.js.map