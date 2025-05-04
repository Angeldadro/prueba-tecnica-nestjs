import { Module } from '@nestjs/common';
import { ITEM_REPOSITORY } from '@items/domain/repos/item.repository';
import { ItemRepositoryImpl } from '@items/infraestructure/adapters/items.repository';
import CreateItemController from '@items/infraestructure/controllers/create-item.controller';
import ListItemsController from '@items/infraestructure/controllers/list-items.controller';
import { CreateItemUseCase } from '@items/application/create-item.usecase';
import { ListItemsUseCase } from '@items/application/list-items.usecase';
import { PrismaService } from '@shared/persistance/prisma.service';

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
