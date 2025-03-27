import { Module } from '@nestjs/common';
import { VectorRepository } from './vector.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Vector, VectorSchema } from './vector.schema';

@Module({
  controllers: [],
  providers: [VectorRepository],
  exports: [VectorRepository],
  imports: [
    MongooseModule.forFeature([{ name: Vector.name, schema: VectorSchema }]),
  ],
})
export class VectorModule {}
