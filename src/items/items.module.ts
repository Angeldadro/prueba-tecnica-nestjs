import { Module } from '@nestjs/common';
import { ITEM_REPOSITORY } from '@/domain/repos/item.repository';
import { ItemRepositoryImpl } from '@/infrastructure/adapters/items.repository';
import CreateItemController from '@/infrastructure/controllers/create-item.controller';
import ListItemsController from '@/infrastructure/controllers/list-items.controller';
import { CreateItemUseCase } from '@/application/create-item.usecase';
import { ListItemsUseCase } from '@/application/list-items.usecase';
import { PrismaService } from '../infrastructure/persistance/prisma.service';

@Module({
  controllers: [CreateItemController, ListItemsController],
  providers: [
    {
      provide: ITEM_REPOSITORY,
      useClass: ItemRepositoryImpl,
    },
    PrismaService,
    CreateItemUseCase,
    ListItemsUseCase,
  ],
  exports: [CreateItemUseCase, ListItemsUseCase, PrismaService],
})
export class ItemsModule {}
