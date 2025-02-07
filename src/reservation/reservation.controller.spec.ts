import { Test, TestingModule } from '@nestjs/testing';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../users/users.entity';

describe('ReservationController', () => {
  let controller: ReservationController;
  let service: ReservationService;

  const mockUser: User = { 
    id: "1",  
    username: 'testuser', 
    password: 'hashedpassword', 
    reservations: [] 
  } as User;
    const mockReservation = { id: 1, movieId: 123, startTime: new Date(), endTime: new Date(), user: mockUser };

  const mockReservationService = {
    createReservation: jest.fn().mockResolvedValue(mockReservation),
    getUserReservations: jest.fn().mockResolvedValue([mockReservation]),
    cancelReservation: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservationController],
      providers: [{ provide: ReservationService, useValue: mockReservationService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({})
      .compile();

    controller = module.get<ReservationController>(ReservationController);
    service = module.get<ReservationService>(ReservationService);
  });

  it('should create a reservation', async () => {
    const dto: CreateReservationDto = { movieId: 123, startTime: '2025-02-05T16:00:00Z' };
    await expect(controller.create(mockUser, dto)).resolves.toEqual(mockReservation);
    expect(service.createReservation).toHaveBeenCalledWith(mockUser, dto);
  });

  it('should get all reservations of a user', async () => {
    await expect(controller.getAll(mockUser)).resolves.toEqual([mockReservation]);
    expect(service.getUserReservations).toHaveBeenCalledWith(mockUser);
  });

  it('should cancel a reservation', async () => {
    await expect(controller.cancel(1, mockUser)).resolves.toBeUndefined();
    expect(service.cancelReservation).toHaveBeenCalledWith(1, mockUser);
  });
});
