import { Test, TestingModule } from '@nestjs/testing';
import { TutorsService } from './tutors.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, ConflictException } from '@nestjs/common';

describe('TutorsService', () => {
  let service: TutorsService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    tutor: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    appointment: {
      findMany: jest.fn(),
    },
    sale: {
      findMany: jest.fn(),
    },
    boarding: {
      findMany: jest.fn(),
    },
  };

  const mockTutor = {
    id: 'tutor-1',
    name: 'Maria Silva',
    email: 'maria@example.com',
    phone: '11999999999',
    cpf: '12345678901',
    businessId: 'business-1',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TutorsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<TutorsService>(TutorsService);
    prismaService = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated tutors', async () => {
      const mockTutors = [mockTutor];
      mockPrismaService.tutor.findMany.mockResolvedValue(mockTutors);
      mockPrismaService.tutor.count.mockResolvedValue(1);

      const result = await service.findAll('business-1', { page: 1, limit: 20 });

      expect(result.data).toEqual(mockTutors);
      expect(result.pagination).toEqual({
        page: 1,
        limit: 20,
        total: 1,
        totalPages: 1,
      });
    });

    it('should filter by search term', async () => {
      mockPrismaService.tutor.findMany.mockResolvedValue([mockTutor]);
      mockPrismaService.tutor.count.mockResolvedValue(1);

      await service.findAll('business-1', { search: 'Maria' });

      expect(mockPrismaService.tutor.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            businessId: 'business-1',
            OR: expect.arrayContaining([
              { name: { contains: 'Maria', mode: 'insensitive' } },
            ]),
          }),
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should return a tutor by id', async () => {
      mockPrismaService.tutor.findFirst.mockResolvedValue(mockTutor);

      const result = await service.findOne('tutor-1', 'business-1');

      expect(result).toEqual(mockTutor);
      expect(mockPrismaService.tutor.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'tutor-1', businessId: 'business-1' },
        }),
      );
    });

    it('should throw NotFoundException if tutor not found', async () => {
      mockPrismaService.tutor.findFirst.mockResolvedValue(null);

      await expect(service.findOne('invalid-id', 'business-1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('should create a new tutor', async () => {
      const createDto = {
        name: 'Maria Silva',
        email: 'maria@example.com',
        phone: '11999999999',
        cpf: '12345678901',
      };

      mockPrismaService.tutor.findFirst.mockResolvedValue(null);
      mockPrismaService.tutor.create.mockResolvedValue({
        ...mockTutor,
        ...createDto,
      });

      const result = await service.create('business-1', createDto);

      expect(result.name).toBe('Maria Silva');
      expect(mockPrismaService.tutor.create).toHaveBeenCalledWith({
        data: { ...createDto, businessId: 'business-1' },
      });
    });

    it('should throw ConflictException if CPF already exists', async () => {
      const createDto = {
        name: 'Maria Silva',
        email: 'maria@example.com',
        phone: '11999999999',
        cpf: '12345678901',
      };

      mockPrismaService.tutor.findFirst.mockResolvedValue(mockTutor);

      await expect(service.create('business-1', createDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('update', () => {
    it('should update a tutor', async () => {
      const updateDto = { name: 'Maria Santos' };

      mockPrismaService.tutor.findFirst.mockResolvedValue(mockTutor);
      mockPrismaService.tutor.update.mockResolvedValue({
        ...mockTutor,
        ...updateDto,
      });

      const result = await service.update('tutor-1', 'business-1', updateDto);

      expect(result.name).toBe('Maria Santos');
    });

    it('should throw NotFoundException if tutor not found', async () => {
      mockPrismaService.tutor.findFirst.mockResolvedValue(null);

      await expect(
        service.update('invalid-id', 'business-1', { name: 'Test' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException if CPF already used by another tutor', async () => {
      mockPrismaService.tutor.findFirst
        .mockResolvedValueOnce(mockTutor) // findOne check
        .mockResolvedValueOnce({ id: 'other-tutor' }); // CPF check

      await expect(
        service.update('tutor-1', 'business-1', { cpf: '99999999999' }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('delete', () => {
    it('should delete a tutor', async () => {
      mockPrismaService.tutor.findFirst.mockResolvedValue(mockTutor);
      mockPrismaService.tutor.delete.mockResolvedValue(mockTutor);

      const result = await service.delete('tutor-1', 'business-1');

      expect(result).toEqual(mockTutor);
      expect(mockPrismaService.tutor.delete).toHaveBeenCalledWith({
        where: { id: 'tutor-1' },
      });
    });

    it('should throw NotFoundException if tutor not found', async () => {
      mockPrismaService.tutor.findFirst.mockResolvedValue(null);

      await expect(service.delete('invalid-id', 'business-1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getHistory', () => {
    it('should return tutor history with appointments, sales, and boardings', async () => {
      mockPrismaService.tutor.findFirst.mockResolvedValue(mockTutor);
      mockPrismaService.appointment.findMany.mockResolvedValue([]);
      mockPrismaService.sale.findMany.mockResolvedValue([]);
      mockPrismaService.boarding.findMany.mockResolvedValue([]);

      const result = await service.getHistory('tutor-1', 'business-1');

      expect(result).toHaveProperty('tutor');
      expect(result).toHaveProperty('appointments');
      expect(result).toHaveProperty('sales');
      expect(result).toHaveProperty('boardings');
    });
  });
});
