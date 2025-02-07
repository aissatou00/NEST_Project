import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { Reservation } from './reservation.entity';
import { Movie } from '../movies/movie.entity';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { HttpModule } from '@nestjs/axios';
import { MoviesModule } from '../movies/movies.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([Reservation, Movie]),
    forwardRef(() => UsersModule),
    forwardRef(() => AuthModule),
    HttpModule,
    MoviesModule, 
  ],
  providers: [ReservationService],
  controllers: [ReservationController],
  exports: [ReservationService],
})
export class ReservationModule {}
