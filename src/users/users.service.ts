import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Item } from 'src/shop/entitities/item.entity';
import { Inventory } from './entities/inventory.entity';

@Injectable()
export class UsersService {
  private usersRepository;
  private itemsRepository;
  private inventoriesRepository;
  constructor(
    private dataSource: DataSource,
    private readonly configService: ConfigService,
  ) {
    this.usersRepository = this.dataSource.getRepository(User);
    this.itemsRepository = this.dataSource.getRepository(Item);
    this.inventoriesRepository = this.dataSource.getRepository(Inventory);
  }

  //Vytvoření uživatele v databázi
  async createUser(userData: Partial<User>): Promise<User> {
    try {
      const newUser = await this.usersRepository.create(userData);
      await this.usersRepository.save(newUser);
      return newUser;
    } catch (err) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Chyba při vytváření uživatele',
        },
        500,
      );
    }
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

  async getUserByEmail(email: string): Promise<User> {
    const user: User = await this.usersRepository.findOne({
      where: { email: email },
    });
    return user;
  }

  async getUserById(userId: number): Promise<User> {
    const user: User = await this.usersRepository.findOne({
      relations: ['inventory', 'activeBackgroundId', 'activeSoundId'],
      where: { userId: userId },
    });
    return user;
  }

  async updateClicks(userId: number, clicks: number): Promise<void> {
    const user: User = await this.getUserById(userId);
    const addedClicks: number = clicks - user.clicks;
    if (addedClicks > this.configService.get<number>('clicksUpdateLimit')) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          error: 'Překročil jsi počet kliků za jednu aktualizaci',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    if (clicks < user.clicks) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          error: 'Kliky nelze odečítat',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    user.clicks = clicks;
    user.totalClicks = user.totalClicks + addedClicks;
    await this.usersRepository.save(user).catch(() => {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Nastala chyba při ukládání kliků',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    });
  }

  async getGlobalTotalClicks(): Promise<number> {
    const totalClicks = await this.usersRepository
      .createQueryBuilder('user')
      .select('SUM(user.totalClicks)', 'total')
      .getRawOne();
    return totalClicks.total;
  }

  async updateUser(user: User): Promise<User> {
    await this.usersRepository.save(user).catch(() => {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Nastala chyba při ukládání uživatele',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    });
    return user;
  }

  async addItemToUser(userId: number, itemId: number): Promise<void> {
    try {
      const user: User = await this.getUserById(userId);
      const item: Item = await this.itemsRepository.findOne({
        where: { itemId: itemId },
      });
      const newInv = await this.inventoriesRepository.create({
        user: user,
        itemId: item.itemId,
      });
      await this.inventoriesRepository.save(newInv);
    } catch (err) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Nastala chyba při ukládání itemu do inventáře',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async useItem(userId: number, itemId: number): Promise<void> {
    try {
      const user: User = await this.getUserById(userId);
      if (!user.inventory.find((item) => item.itemId === itemId)) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            error: 'Item nebyl nalezen v inventáři',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      console.log(user.inventory);
    } catch (err) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Nastala chyba při používání itemu',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
