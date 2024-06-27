import { Injectable } from '@nestjs/common';
import { users } from './users.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class UsersService {
  private usersRepository;
  constructor(private dataSource: DataSource) {
    this.usersRepository = this.dataSource.getRepository(users);
  }

  //Vytvoření uživatele v databázi
  async createUser(userData: Partial<users>): Promise<users> {
    const newUser = await this.usersRepository.create(userData);
    await this.usersRepository.save(newUser);
    return newUser;
  }

  async checkUsername(username: string): Promise<boolean> {
    const check = await this.usersRepository.existsBy({ username: username });
    return check;
  }

  async checkEmail(email: string): Promise<boolean> {
    const check = await this.usersRepository.existsBy({ email: email });
    return check;
  }
}
