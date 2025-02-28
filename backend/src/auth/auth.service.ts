import {
    Injectable,
    BadRequestException,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { User } from './user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

const JWT_SECRET = 'JWT_SECRET'; // TODO: Replace with env variable

export interface JwtPayload {
    userId: string;
    username: string;
}

@Injectable()
export class AuthService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) {}

    async register(dto: CreateUserDto) {
        const { username, password } = dto;

        // Check if user exists
        const existingUser = await this.userModel.findOne({ username });
        if (existingUser) {
            throw new BadRequestException('User already exists');
        }
        //Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = new this.userModel({
            username,
            password: hashedPassword,
        });
        await user.save();

        return { message: 'User create successfully' };
    }

    async login(dto: LoginDto) {
        const { username, password } = dto;

        const user = await this.userModel.findOne({ username });
        if (!user) {
            throw new UnauthorizedException('User does not exist');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Wrong password');
        }

        // Create JWT
        const token = jwt.sign(
            { userId: user._id, username: user.username },
            JWT_SECRET,
            { expiresIn: '1h' },
        );
        return {
            token,
        };
    }

    // Utility method to verify token if it's needed in a guard later
    verifyToken(token: string): JwtPayload {
        try {
            return jwt.verify(token, JWT_SECRET) as JwtPayload;
        } catch (error) {
            throw new UnauthorizedException('Invalid token');
        }
    }
}
