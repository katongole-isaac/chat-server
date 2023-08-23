"use strict";
/**
 * Client schema
 *
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateClient = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const joi_1 = __importDefault(require("joi"));
const ClientSchema = new mongoose_1.default.Schema({
    username: { type: String, required: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: new Date() },
});
const Client = mongoose_1.default.model('client', ClientSchema);
exports.default = Client;
function validateClient(client) {
    const schema = joi_1.default.object({
        name: joi_1.default.string().required().min(3),
        password: joi_1.default.string().required().min(4)
    });
    return schema.validate(client);
}
exports.validateClient = validateClient;
