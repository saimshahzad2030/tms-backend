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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendEmail = (userEmail, subject, message) => __awaiter(void 0, void 0, void 0, function* () {
    const transporter = nodemailer_1.default.createTransport({
        service: "gmail",
        auth: {
            user: "saimshehzad2040@gmail.com",
            pass: "fdzo hgag vbrj wxxp",
        },
    });
    const mailOptions = {
        from: "noreply@get2Gether.com",
        to: userEmail,
        subject: subject,
        text: message,
    };
    try {
        yield transporter.sendMail(mailOptions);
    }
    catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Error sending email');
    }
});
exports.sendEmail = sendEmail;
//# sourceMappingURL=send-email.js.map