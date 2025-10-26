"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const user_repository_1 = __importDefault(require("../repositories/user.repository"));
const jsonwebtoken_1 = require("jsonwebtoken");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const config_1 = require("../config");
class AuthService {
    constructor() {
        this.userRepository = new user_repository_1.default();
    }
    async register(userData) {
        const hashedPassword = await bcryptjs_1.default.hash(userData.password, 10);
        const newUser = { ...userData, password: hashedPassword };
        return this.userRepository.createUser(newUser);
    }
    async login(email, password) {
        const user = await this.userRepository.findUserByEmail(email);
        if (user && await bcryptjs_1.default.compare(password, user.password)) {
            const token = this.generateToken(user);
            return token;
        }
        return null;
    }
    generateToken(user) {
        const payload = { id: user.id, email: user.email };
        return (0, jsonwebtoken_1.sign)(payload, config_1.config.JWT_SECRET, { expiresIn: config_1.config.JWT_EXPIRES_IN });
    }
    async verifyToken(token) {
        try {
            return (0, jsonwebtoken_1.verify)(token, config_1.config.JWT_SECRET);
        }
        catch (error) {
            return null;
        }
    }
}
exports.AuthService = AuthService;
exports.default = AuthService;
