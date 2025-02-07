import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './users.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<User>;

  const mockUserRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a user if found', async () => {
      const user = { id: '1', username: 'test', password: 'password' };
      mockUserRepository.findOne.mockResolvedValue(user);

      const result = await service.findOne('test');
      expect(result).toEqual(user);
    });

    it('should return undefined if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      const result = await service.findOne('nonexistent');
      expect(result).toBeUndefined();
    });
  });

  describe('createUser', () => {
    it('should create and save a new user', async () => {
      const registerDto = { username: 'test', password: 'password' };
      const hashedPassword = await bcrypt.hash(registerDto.password, 10);
      const newUser = { ...registerDto, password: hashedPassword };

      mockUserRepository.create.mockReturnValue(newUser);
      mockUserRepository.save.mockResolvedValue(newUser);

      const result = await service.createUser(registerDto);

      expect(result).toEqual(newUser);
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        username: 'test',
        password: hashedPassword,
      });
      expect(mockUserRepository.save).toHaveBeenCalledWith(newUser);
    });
  });
});
