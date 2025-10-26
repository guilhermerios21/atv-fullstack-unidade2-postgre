import UserRepository from '../repositories/user.repository';
import { IUser } from '../models/user.model';
import { sign, verify } from 'jsonwebtoken';
import * as bcryptjs from 'bcryptjs';
import { config } from '../config';

interface RegisterData {
    name: string;
    email: string;
    password: string;
}

export class AuthService {
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    async register(userData: RegisterData): Promise<IUser> {
    const hashedPassword = await bcryptjs.hash(userData.password, 10);
        const newUser = { ...userData, password: hashedPassword };
        return this.userRepository.createUser(newUser);
    }

    async login(email: string, password: string): Promise<string | null> {
        const user = await this.userRepository.findUserByEmail(email);
        if (user && await bcryptjs.compare(password, user.password)) {
            const token = this.generateToken(user);
            return token;
        }
        return null;
    }

    private generateToken(user: IUser): string {
        const payload = { id: (user as any).id, email: user.email };
        return sign(payload, config.JWT_SECRET, { expiresIn: config.JWT_EXPIRES_IN });
    }

    async verifyToken(token: string): Promise<any> {
        try {
            return verify(token, config.JWT_SECRET);
        } catch (error) {
            return null;
        }
    }
}

export default AuthService;