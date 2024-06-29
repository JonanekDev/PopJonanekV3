import { Injectable } from '@nestjs/common';
import { users } from './entities/users.entity';
import { DataSource } from 'typeorm';
import { ResDto } from 'src/dto/res.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  private usersRepository;
  constructor(
    private dataSource: DataSource,
    private readonly configService: ConfigService,
  ) {
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
    const check: boolean = await this.usersRepository.existsBy({
      email: email,
    });
    return check;
  }

  async getUserByEmail(email: string): Promise<users> {
    const user: users = await this.usersRepository.findOne({
      where: { email: email },
    });
    return user;
  }

  async getUserById(userId: number): Promise<users> {
    const user: users = await this.usersRepository.findOne({
      where: { userId: userId },
    });
    return user;
  }

  async updateClicks(userId: number, clicks: number): Promise<ResDto> {
    const user: users = await this.getUserById(userId);
    const addedClicks: number = clicks - user.clicks;
    if (addedClicks > this.configService.get<number>('clicksUpdateLimit')) {
      return {
        status: 'error',
        errCodes: [5],
      };
    }
    if (clicks < user.clicks) {
      return {
        status: 'error',
        errCodes: [6],
      };
    }
    user.clicks = clicks;
    user.totalClicks = user.totalClicks + addedClicks;
    await this.usersRepository.save(user);
    return {
      status: 'ok',
      data: clicks,
    };
  }

  async getGlobalTotalClicks(): Promise<ResDto> {
    const totalClicks = await this.usersRepository
      .createQueryBuilder('user')
      .select('SUM(user.totalClicks)', 'total')
      .getRawOne();
    return {
      status: 'ok',
      data: totalClicks.total,
    };
  }
}
