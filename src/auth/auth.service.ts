import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { SignUpDto } from './dto/signup.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import { LoginDto } from './dto/login.dto';
dotenv.config();

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
    private readonly jwtService: JwtService,
  ) {}

  async create(signUpDto: SignUpDto) {
    const userExist = await this.userRepository.findOne({
      where: [{ email: signUpDto.email }, { phone: signUpDto.phone }],
    });

    if (userExist) {
      this.logger.error('Email or Phone Number Already Exist');
      throw new ConflictException('Email or Phone Number Already Exist');
    }

    const hashedPassword = await this.hashData(signUpDto.password);
    const user = this.userRepository.create({
      first_name: signUpDto.first_name,
      last_name: signUpDto.last_name,
      email: signUpDto.email,
      password: hashedPassword,
      phone: signUpDto.phone,
    });

    const newUser = await this.userRepository.save(user);

    return newUser;
  }

  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
    });
    if (!user) {
      this.logger.error('Invalid email or password');
      throw new BadRequestException('Invalid email or password');
    }

    const isPasswordValid = await this.comparePassword(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      this.logger.error('Invalid email or password');
      throw new BadRequestException('Invalid email or password');
    }

    const token = await this.getToken(user.id, user.email);
    this.logger.log(`${user.email} logged in successfully`);
    return {
      ...user,
      password: undefined,
      token,
    };
  }

  async hashData(data: string) {
    const salt = 10;
    const hashedData = bcrypt.hashSync(data, salt);
    return hashedData;
  }

  async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    const isPasswordMatching = bcrypt.compare(password, hashedPassword);
    return isPasswordMatching;
  }

  async getToken(userId: number, email: string) {
    const token = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: process.env.JWT_SECRET,
          expiresIn: '15m',
        },
      ),
    ]);
    return {
      token: token,
    };
  }
}
