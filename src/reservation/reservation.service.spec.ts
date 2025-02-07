import { Test, TestingModule } from '@nestjs/testing';
import { ReservationService } from './reservation.service';
import { Repository } from 'typeorm';
import { Reservation } from './reservation.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../users/users.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('ReservationService', () => {
  let service: ReservationService;
  let repo: Repository<Reservation>;

  const mockUser: User = { 
    id: "1",  
    username: 'testuser', 
    password: 'hashedpassword',  
    reservations: [] 
  } as User;
    const mockReservation = { id: 1, movieId: 123, startTime: new Date(), endTime: new Date(), user: mockUser };

  const mockRepo = {
    create: jest.fn().mockReturnValue(mockReservation),
    insert: jest.fn().mockResolvedValue(mockReservation),
    find: jest.fn().mockResolvedValue([mockReservation]),
    findOne: jest.fn().mockResolvedValue(mockReservation),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationService,
        { provide: getRepositoryToken(Reservation), useValue: mockRepo },
      ],
    }).compile();

    service = module.get<ReservationService>(ReservationService);
    repo = module.get<Repository<Reservation>>(getRepositoryToken(Reservation));
  });

  it('should create a reservation', async () => {
    const dto: CreateReservationDto = { movieId: 123, startTime: '2025-02-05T16:00:00Z' };
    await expect(service.createReservation(mockUser, dto)).resolves.toEqual(mockReservation);
    expect(repo.create).toHaveBeenCalled();
    expect(repo.insert).toHaveBeenCalledWith(mockReservation);
  });

  it('should get user reservations', async () => {
    await expect(service.getUserReservations(mockUser)).resolves.toEqual([mockReservation]);
    expect(repo.find).toHaveBeenCalled();
  });

  it('should cancel a reservation', async () => {
    await expect(service.cancelReservation(1, mockUser)).resolves.toBeUndefined();
    expect(repo.remove).toHaveBeenCalledWith(mockReservation);
  });

  it('should throw NotFoundException if reservation does not exist', async () => {
    jest.spyOn(repo, 'findOne').mockResolvedValue(null);
    await expect(service.cancelReservation(99, mockUser)).rejects.toThrow(NotFoundException);
  });
});
