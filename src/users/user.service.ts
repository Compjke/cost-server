import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { createUserDto } from 'src/auth/dto/user.dto';
import { loginUserDto } from 'src/auth/dto/loginUser.dto';
import { User, UsersDocument } from 'src/schemas/users.shema';
import { hash } from 'argon2';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UsersDocument>,
  ) {}

  async login(loginUserDto: loginUserDto): Promise<User | null> {
    const oldUser = await this.userModel.collection.findOne({
      userName: loginUserDto.userName,
    });

    if (!oldUser) {
      return null;
    }

    return oldUser as User;
  }

  async registration(createUserDto: createUserDto): Promise<User | null> {
    const oldUser = await this.userModel.collection.findOne({
      userName: createUserDto.userName,
    });

    if (oldUser)
      throw new BadRequestException(
        'This user already exists, please select a different username.',
      );

    const newUser = new this.userModel({
      userName: createUserDto.userName,
      password: await hash(createUserDto.password),
    });
    return newUser.save();
  }

  async findExistUser(userName: string): Promise<User> {
    return this.userModel.findOne({
      userName,
    });
  }
}
