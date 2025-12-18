"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.denyTemplateAccessToUser = exports.allowTemplateAccessToUser = exports.deleteTemplate = exports.fetchAllTemplates = exports.fetchUserAllowedSingleTemplate = exports.fetchUserAllowedTemplates = exports.fetchAdminTemplates = exports.updateAdminTemplate = exports.createAdminTemplate = void 0;
const db_1 = __importDefault(require("../db/db"));
const createAdminTemplate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { name, description, categories, steps } = req.body;
        const adminId = (_a = res.locals.user) === null || _a === void 0 ? void 0 : _a.id;
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
        const newTemplate = yield db_1.default.adminTemplate.create({
            data: {
                name,
                description,
                createdBy: { connect: { id: adminId } },
                categories: categories,
                steps: {
                    create: steps.map((step, index) => ({
                        name: step.name,
                        columnByCategoriesEnabled: step.columnByCategoriesEnabled === "true" || step.columnByCategoriesEnabled === true,
                        description: step.description,
                        type: step.type,
                        linkedStepId: step.linkedStepId,
                        trigger: step.trigger,
                        popupDescription: step === null || step === void 0 ? void 0 : step.popupDescription,
                        completed: step.completed === "true" || step.completed === true, // <- force boolean
                        unCheckEnabled: step.unCheckEnabled === "true" || step.unCheckEnabled === true,
                        columnDetailsChecked: step.columnDetailsChecked === "true" || step.columnDetailsChecked === true,
                        unCheckOption: step.unCheckOption,
                        timeSensitiveColors: step.timeSensitiveColors,
                        isTimeSensitive: step.isTimeSensitive === "true" || step.isTimeSensitive === true,
                        futureColumnThings: step.futureColumnThings,
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
            },
            include: { steps: true }
        });
        const indexToIdMap = newTemplate.steps.reduce((acc, step, i) => {
            acc[i] = step.id; // maps index in original array to created step id
            return acc;
        }, {});
        // Step 3: Update steps that have trigger = "relation"
        const relationSteps = steps
            .map((step, i) => ({ step, i }))
            .filter(({ step }) => { var _a; return step.trigger === "relation" && ((_a = step.linkedStep) === null || _a === void 0 ? void 0 : _a.index) !== undefined; });
        yield Promise.all(relationSteps.map(({ step, i }) => {
            if (!step.linkedStep)
                return;
            // Remove index before updating
            const _a = step.linkedStep, { index } = _a, linkedStepWithoutIndex = __rest(_a, ["index"]);
            return db_1.default.step.update({
                where: { id: indexToIdMap[i] },
                data: { linkedStep: Object.assign(Object.assign({}, linkedStepWithoutIndex), { id: indexToIdMap[index] }) },
            });
        }));
        const template = yield db_1.default.adminTemplate.findMany({
            where: { id: newTemplate.id },
            include: { steps: true, enabledUsers: true },
        });
        res.status(201).json({ message: "AdminTemplate created successfully", template });
    }
    catch (error) {
        console.error("Error creating AdminTemplate:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
});
exports.createAdminTemplate = createAdminTemplate;
const updateAdminTemplate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { name, description, categories, steps } = req.body;
        const id = Number(req.query.id);
        const adminId = (_a = res.locals.user) === null || _a === void 0 ? void 0 : _a.id;
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
        yield db_1.default.step.deleteMany({
            where: { templateId: id },
        });
        // Update the template
        const updatedTemplate = yield db_1.default.adminTemplate.update({
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
                            const _a = step.linkedStep, { index } = _a, rest = __rest(_a, ["index"]);
                            linkedStepWithoutIndex = rest;
                        }
                        return {
                            name: step.name,
                            description: step.description,
                            type: step.type,
                            columnByCategoriesEnabled: step.columnByCategoriesEnabled === "true" || step.columnByCategoriesEnabled === true,
                            linkedStepId: step.linkedStepId,
                            trigger: step.trigger,
                            popupDescription: step === null || step === void 0 ? void 0 : step.popupDescription,
                            completed: step.completed === "true" || step.completed === true, // <- force boolean
                            unCheckEnabled: step.unCheckEnabled === "true" || step.unCheckEnabled === true,
                            columnDetailsChecked: step.columnDetailsChecked === "true" || step.columnDetailsChecked === true,
                            unCheckOption: step.unCheckOption,
                            timeSensitiveColors: step.timeSensitiveColors,
                            isTimeSensitive: step.isTimeSensitive === "true" || step.isTimeSensitive === true,
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
        }, {});
        // Update steps with trigger = "relation"
        const relationSteps = steps
            .map((step, i) => ({ step, i }))
            .filter(({ step }) => { var _a; return step.trigger === "relation" && ((_a = step.linkedStep) === null || _a === void 0 ? void 0 : _a.index) !== undefined; });
        yield Promise.all(relationSteps.map(({ step, i }) => {
            if (!step.linkedStep)
                return;
            // Remove index before updating
            const _a = step.linkedStep, { index } = _a, linkedStepWithoutIndex = __rest(_a, ["index"]);
            return db_1.default.step.update({
                where: { id: indexToIdMap[i] },
                data: { linkedStep: Object.assign(Object.assign({}, linkedStepWithoutIndex), { id: indexToIdMap[index] }) },
            });
        }));
        const template = yield db_1.default.adminTemplate.findUnique({
            where: { id },
            include: { steps: true, enabledUsers: true },
        });
        res.status(200).json({ message: "AdminTemplate updated successfully", template });
    }
    catch (error) {
        console.error("Error updating AdminTemplate:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
});
exports.updateAdminTemplate = updateAdminTemplate;
const fetchAdminTemplates = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const adminId = (_a = res.locals.user) === null || _a === void 0 ? void 0 : _a.id;
        const templates = yield db_1.default.adminTemplate.findMany({
            where: { createdById: adminId },
            include: { steps: true, enabledUsers: true }
        });
        res.status(201).json({ message: "Fetched Admin Templates", templates });
    }
    catch (error) {
        console.error("Error creating AdminTemplate:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
});
exports.fetchAdminTemplates = fetchAdminTemplates;
const fetchUserAllowedTemplates = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = res.locals.user) === null || _a === void 0 ? void 0 : _a.id;
        const templates = yield db_1.default.adminTemplate.findMany({
            where: { enabledUsers: { some: { id: userId } } },
            include: { steps: true, enabledUsers: true }
        });
        res.status(201).json({ message: "Fetched User Allowed Templates", templates });
    }
    catch (error) {
        console.error("Error creating AdminTemplate:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
});
exports.fetchUserAllowedTemplates = fetchUserAllowedTemplates;
const fetchUserAllowedSingleTemplate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = res.locals.user) === null || _a === void 0 ? void 0 : _a.id;
        const templateId = Number(req.query.templateId);
        if (!templateId) {
            return res.status(400).json({ message: "templateId is required." });
        }
        const template = yield db_1.default.adminTemplate.findFirst({
            where: {
                id: templateId,
                OR: [
                    { createdById: userId }, // if the user is the creator
                    { enabledUsers: { some: { id: userId } } } // or user is enabled
                ]
            },
            include: {
                steps: true,
                enabledUsers: true
            }
        });
        if (!template) {
            return res.status(404).json({ message: "Template not found or access denied." });
        }
        res.status(200).json({ message: "Fetched your single template", template });
    }
    catch (error) {
        console.error("Error fetching single template:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
});
exports.fetchUserAllowedSingleTemplate = fetchUserAllowedSingleTemplate;
const fetchAllTemplates = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const templates = yield db_1.default.adminTemplate.findMany({ include: { steps: true, enabledUsers: true } });
        res.status(201).json({ message: "Fetched All Templates", templates });
    }
    catch (error) {
        console.error("Error creating AdminTemplate:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
});
exports.fetchAllTemplates = fetchAllTemplates;
const deleteTemplate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const templateId = Number(req.query.id);
        ;
        const adminId = (_a = res.locals.user) === null || _a === void 0 ? void 0 : _a.id;
        const templateToDelete = yield db_1.default.adminTemplate.findUnique({
            where: { id: templateId, createdById: adminId, },
        });
        if (!templateToDelete) {
            return res.status(404).json({ message: "Template not found or you don't have permission to delete it" });
        }
        yield db_1.default.step.deleteMany({
            where: { templateId: templateId },
        }).then(() => __awaiter(void 0, void 0, void 0, function* () {
            yield db_1.default.adminTemplate.delete({
                where: { id: templateId, createdById: adminId, },
            });
            res.status(201).json({ message: "Template Successfully deleted" });
        }));
    }
    catch (error) {
        console.error("Error Deleting this template", error);
        res.status(500).json({ message: "Internal server error", error });
    }
});
exports.deleteTemplate = deleteTemplate;
const allowTemplateAccessToUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const templateId = Number(req.query.id);
        ;
        const { userId } = req.body;
        if (!templateId || !userId) {
            return res.status(400).json({ message: "templateId and userId are required." });
        }
        const template = yield db_1.default.adminTemplate.update({
            where: { id: templateId },
            data: {
                enabledUsers: {
                    connect: { id: Number(userId) }
                }
            },
            include: { steps: true, enabledUsers: true }
        });
        res.status(201).json({ message: "This user allowed access to the template", template });
    }
    catch (error) {
        console.error("Error creating AdminTemplate:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
});
exports.allowTemplateAccessToUser = allowTemplateAccessToUser;
const denyTemplateAccessToUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { templateId, userId } = req.body;
        if (!templateId || !userId) {
            return res.status(400).json({ message: "templateId and userId are required." });
        }
        const templates = yield db_1.default.adminTemplate.update({
            where: { id: templateId },
            data: {
                enabledUsers: {
                    delete: { id: userId }
                }
            },
            include: { steps: true, enabledUsers: true }
        });
        res.status(201).json({ message: "User Access to this template Denied", templates });
    }
    catch (error) {
        console.error("Error creating AdminTemplate:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
});
exports.denyTemplateAccessToUser = denyTemplateAccessToUser;
//# sourceMappingURL=adminTemplate.controller.js.map