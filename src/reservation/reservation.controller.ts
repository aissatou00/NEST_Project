import { Controller, Post, Get, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { User } from '../users/user.decorator'; 
import { User as UserEntity } from '../users/users.entity'; 
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';


@ApiTags('Reservations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('reservations')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  create(@User() user: UserEntity, @Body() dto: CreateReservationDto) { 
    return this.reservationService.createReservation(user, dto);
  }

  @Get()
  getAll(@User() user: UserEntity) { 
    return this.reservationService.getUserReservations(user);
  }

  @Delete(':id')
  cancel(@Param('id') id: number, @User() user: UserEntity) { 
    return this.reservationService.cancelReservation(id, user);
  }
}
