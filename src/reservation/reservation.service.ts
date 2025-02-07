import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from './reservation.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { User } from '../users/users.entity';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Movie } from '../movies/movie.entity';
import { MoviesService } from '../movies/movies.service'; 

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private reservationRepo: Repository<Reservation>,
    private readonly moviesService: MoviesService, 
  ) {}

  async createReservation(user: User, dto: CreateReservationDto): Promise<Reservation> {
    const movieDetails = await firstValueFrom(this.moviesService.getMovieDetails(dto.movieId));
    console.log("Détails du film récupérés:", movieDetails);
    if (!movieDetails) {
      throw new NotFoundException('Film non trouvé');
    }
  
    const startTime = new Date(dto.startTime);
    const endTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000); 
  
    const conflicts = await this.reservationRepo
      .createQueryBuilder('reservation')
      .where('reservation.userId = :userId', { userId: user.id })
      .andWhere(
        '(reservation.startTime < :endTime AND reservation.endTime > :startTime) OR ' + 
        '(reservation.endTime > :startTime AND reservation.endTime <= :endTime) OR ' + 
        '(reservation.startTime >= :startTime AND reservation.startTime < :endTime)' 
      )
      .setParameters({
        startTime,   
        endTime,     
        userId: user.id
      })
      .getMany();
  
    if (conflicts.length) {
      throw new ConflictException('Conflit avec une autre réservation');
    }
  
    const reservation = this.reservationRepo.create({
      user, 
      movieId: dto.movieId,
      startTime,
      endTime,
    });
    console.log("Réservation à enregistrer :", reservation);
    await this.reservationRepo.insert(reservation);
    return reservation;
  }
  
  async getUserReservations(user: User): Promise<Reservation[]> {
    return this.reservationRepo.find({
      where: { user: { id: user.id } },  
    });
    
  }

  async cancelReservation(id: number, user: User): Promise<void> {
    const reservation = await this.reservationRepo.findOne({ where: { id, user: { id: user.id } } });
    if (!reservation) throw new NotFoundException('Réservation non trouvée');

    await this.reservationRepo.remove(reservation);
  }
}