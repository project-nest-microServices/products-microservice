import {
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { extend } from 'joi';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common/indext';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  findFirst(arg0: {}) {
    throw new Error('Method not implemented.');
  }

  private readonly logger = new Logger('ProductsSerice');

  onModuleInit() {
    this.$connect();
    this.logger.log('Connected to the databse');
  }

  async create(createProductDto: CreateProductDto) {
    const product = await this.product.create({
      data: createProductDto,
    });
    console.log(product); // Revisa qué datos devuelve aquí
    return product;
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    // const totalPage = await this.product.count();

    // return this.product.findMany({
    //    skip: (page - 1) * limit,
    //     take: limit,
    // });

    //mostrar la cantidad total de paginas
    const totalPages = await this.product.count( { where: { available: true }});
    const lastPage = Math.ceil(totalPages / limit);

    return {
      data: await this.product.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: { available: true }
      }),
      meta: {
        total: totalPages,
        page: page,
        lastPage: lastPage,
      },
    };
  }

  async findOne(id: number) {
    const product = await this.product.findFirst({
      where: { id: id, available: true },
    });

    if (!product) {
      throw new NotFoundException(`Product with id ${id} was not found`);
    }

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {

    const { id:__, ...data } = updateProductDto;

    await this.findOne(id);

    return this.product.update({
      where: { id: id },
      data: data,
    });
  }

  async remove(id: number) {

    await this.findOne(id);

    const product = await this.product.update({
      where: { id : id },
      data: { available : false}

    })

    return product;
    // return this.product.delete({
    //   where: { id: id}
    // })
  }
}
