import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import bcrypt from 'bcrypt';
import { User } from './schemas/user.shema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  create(createUserDto: CreateUserDto) {
    const user: User = {
      ...createUserDto,
      hashedPassword: bcrypt.hashSync(
        createUserDto.password,
        bcrypt.genSaltSync(10)
      ),
    };
    return this.userModel.create(user);
  }

  findAll() {
    return this.userModel.find(); // TODO Maybe remove hashed Password from return
  }

  findOne(username: string) {
    return this.userModel.findOne({ name: username });
  }

  findOneById(id: string) {
    return this.userModel.findById(id);
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    if (updateUserDto.hashedPassword) {
      updateUserDto.hashedPassword = bcrypt.hashSync(
        updateUserDto.password,
        bcrypt.genSaltSync(10)
      );
    }
    return this.userModel.findByIdAndUpdate(id, updateUserDto);
  }

  remove(id: string) {
    return this.userModel.findByIdAndDelete(id);
  }
}
