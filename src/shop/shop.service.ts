import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Item } from './entitities/item.entity';
import { DataSource } from 'typeorm';
import { Chest } from './entitities/chest.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ShopService {
  private itemsRepository;
  private chestsRepository;
  constructor(
    private dataSource: DataSource,
    private usersService: UsersService,
  ) {
    this.itemsRepository = this.dataSource.getRepository(Item);
    this.chestsRepository = this.dataSource.getRepository(Chest);
  }

  async getItems(): Promise<Item[]> {
    return await this.itemsRepository.find();
  }

  async getChests(): Promise<Chest[]> {
    return await this.chestsRepository.find({ relations: ['items'] });
  }

  async getChestById(chestId: number): Promise<Chest> {
    return await this.chestsRepository.findOne({
      relations: ['items'],
      where: { chestId: chestId },
    });
  }

  async purchaseChest(chestId: number, userId: number): Promise<Item> {
    const chest: Chest = await this.getChestById(chestId);
    const user: User = await this.usersService.getUserById(userId);
    if (user.clicks < chest.price) {
      throw new HttpException(
        {
          statusCode: HttpStatus.FORBIDDEN,
          error: 'Nemáš dostatek kliků pro zakoupení této bedny',
        },
        HttpStatus.FORBIDDEN,
      );
    }
    let newItemForPlayerFromChest: Item;
    do {
      const item = chest.items[Math.floor(Math.random() * chest.items.length)];
      if (!user.inventory.find((item) => item.itemId === item.itemId)) {
        newItemForPlayerFromChest = item;
      }
    } while (!newItemForPlayerFromChest);
    await this.usersService
      .addItemToUser(user.userId, newItemForPlayerFromChest.itemId)
      .catch((err) => {
        throw err;
      });
    user.clicks -= chest.price;
    await this.usersService.updateUser(user); //TODO: možná catch? ale co pak? ? ?
    return newItemForPlayerFromChest;
  }
}
