import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SemestresService } from './semestres.service';
import { SemestresController } from './semestres.controller';
import { Semestre } from './semestre.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Semestre])],
  controllers: [SemestresController],
  providers: [SemestresService],
  exports: [SemestresService],
})
export class SemestresModule {}
