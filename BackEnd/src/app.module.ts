import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MateriasModule } from './materias/materias.module';
import { TareasModule } from './tareas/tareas.module';
import { SemestresModule } from './semestres/semestres.module';
import { HorarioModule } from './horario/horario.module';
import { TemarioModule } from './temarios/temario.module';

@Module({
  imports: [
    // Variables de entorno
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // TypeORM + SQLite
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'sqlite',
        database: configService.get<string>('DATABASE_PATH', './studyboard.sqlite'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true, // Solo en desarrollo — en producción usar migraciones
        logging: process.env.NODE_ENV === 'development',
      }),
    }),

    AuthModule,
    SemestresModule,
    MateriasModule,
    TareasModule,
    HorarioModule,
    TemarioModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
