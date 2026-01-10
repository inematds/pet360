import { Test, TestingModule } from '@nestjs/testing';
import { PetsService } from './pets.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('PetsService', () => {
  let service: PetsService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    pet: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
    medicalRecord: {
      findMany: jest.fn(),
    },
  };

  const mockPet = {
    id: 'pet-1',
    name: 'Rex',
    species: 'DOG',
    breed: 'Golden Retriever',
    gender: 'MALE',
    birthDate: new Date('2020-01-15'),
    weight: 32.5,
    tutorId: 'tutor-1',
    businessId: 'business-1',
    isActive: true,
    photoUrl: null,
    microchipNumber: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockTutor = {
    id: 'tutor-1',
    name: 'Maria Silva',
    phone: '11999999999',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PetsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<PetsService>(PetsService);
    prismaService = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated pets', async () => {
      const mockPets = [{ ...mockPet, tutor: mockTutor }];
      mockPrismaService.pet.findMany.mockResolvedValue(mockPets);
      mockPrismaService.pet.count.mockResolvedValue(1);

      const result = await service.findAll('business-1', { page: 1, limit: 20 });

      expect(result.data).toEqual(mockPets);
      expect(result.pagination).toEqual({
        page: 1,
        limit: 20,
        total: 1,
        totalPages: 1,
      });
    });

    it('should filter by species', async () => {
      mockPrismaService.pet.findMany.mockResolvedValue([mockPet]);
      mockPrismaService.pet.count.mockResolvedValue(1);

      await service.findAll('business-1', { species: 'DOG' });

      expect(mockPrismaService.pet.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            species: 'DOG',
          }),
        }),
      );
    });

    it('should filter by tutorId', async () => {
      mockPrismaService.pet.findMany.mockResolvedValue([mockPet]);
      mockPrismaService.pet.count.mockResolvedValue(1);

      await service.findAll('business-1', { tutorId: 'tutor-1' });

      expect(mockPrismaService.pet.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            tutorId: 'tutor-1',
          }),
        }),
      );
    });

    it('should filter by search term', async () => {
      mockPrismaService.pet.findMany.mockResolvedValue([mockPet]);
      mockPrismaService.pet.count.mockResolvedValue(1);

      await service.findAll('business-1', { search: 'Rex' });

      expect(mockPrismaService.pet.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: expect.arrayContaining([
              { name: { contains: 'Rex', mode: 'insensitive' } },
            ]),
          }),
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should return a pet by id', async () => {
      mockPrismaService.pet.findFirst.mockResolvedValue(mockPet);

      const result = await service.findOne('pet-1', 'business-1');

      expect(result).toEqual(mockPet);
      expect(mockPrismaService.pet.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'pet-1', businessId: 'business-1' },
        }),
      );
    });

    it('should throw NotFoundException if pet not found', async () => {
      mockPrismaService.pet.findFirst.mockResolvedValue(null);

      await expect(service.findOne('invalid-id', 'business-1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('should create a new pet', async () => {
      const createDto = {
        name: 'Rex',
        species: 'DOG',
        breed: 'Golden Retriever',
        gender: 'MALE',
        tutorId: 'tutor-1',
      };

      mockPrismaService.pet.create.mockResolvedValue({
        ...mockPet,
        tutor: mockTutor,
      });

      const result = await service.create('business-1', createDto as any);

      expect(result.name).toBe('Rex');
      expect(mockPrismaService.pet.create).toHaveBeenCalledWith({
        data: { ...createDto, businessId: 'business-1' },
        include: { tutor: true },
      });
    });
  });

  describe('update', () => {
    it('should update a pet', async () => {
      const updateDto = { name: 'Rex Jr' };

      mockPrismaService.pet.findFirst.mockResolvedValue(mockPet);
      mockPrismaService.pet.update.mockResolvedValue({
        ...mockPet,
        name: 'Rex Jr',
        tutor: mockTutor,
      });

      const result = await service.update('pet-1', 'business-1', updateDto as any);

      expect(result.name).toBe('Rex Jr');
    });

    it('should throw NotFoundException if pet not found', async () => {
      mockPrismaService.pet.findFirst.mockResolvedValue(null);

      await expect(
        service.update('invalid-id', 'business-1', { name: 'Test' } as any),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should soft delete a pet by setting isActive to false', async () => {
      mockPrismaService.pet.findFirst.mockResolvedValue(mockPet);
      mockPrismaService.pet.update.mockResolvedValue({
        ...mockPet,
        isActive: false,
      });

      const result = await service.delete('pet-1', 'business-1');

      expect(result.isActive).toBe(false);
      expect(mockPrismaService.pet.update).toHaveBeenCalledWith({
        where: { id: 'pet-1' },
        data: { isActive: false },
      });
    });

    it('should throw NotFoundException if pet not found', async () => {
      mockPrismaService.pet.findFirst.mockResolvedValue(null);

      await expect(service.delete('invalid-id', 'business-1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getVaccineCard', () => {
    it('should return vaccine card with pending vaccines', async () => {
      const futureDate = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000);
      const mockPetWithVaccines = {
        ...mockPet,
        tutor: mockTutor,
        vaccineRecords: [
          {
            id: 'vaccine-1',
            vaccineName: 'V10',
            applicationDate: new Date('2024-01-01'),
            nextDoseDate: futureDate,
            vet: { name: 'Dr. Joao', crmv: '12345' },
          },
        ],
      };

      mockPrismaService.pet.findFirst.mockResolvedValue(mockPetWithVaccines);

      const result = await service.getVaccineCard('pet-1', 'business-1');

      expect(result).toHaveProperty('pet');
      expect(result).toHaveProperty('tutor');
      expect(result).toHaveProperty('vaccines');
      expect(result).toHaveProperty('pendingVaccines');
      expect(result.pendingVaccines.length).toBe(1);
    });

    it('should throw NotFoundException if pet not found', async () => {
      mockPrismaService.pet.findFirst.mockResolvedValue(null);

      await expect(
        service.getVaccineCard('invalid-id', 'business-1'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getMedicalHistory', () => {
    it('should return medical history with records', async () => {
      mockPrismaService.pet.findFirst.mockResolvedValue(mockPet);
      mockPrismaService.medicalRecord.findMany.mockResolvedValue([
        {
          id: 'record-1',
          recordDate: new Date(),
          diagnosis: 'Consulta de rotina',
          vet: { id: 'vet-1', name: 'Dr. Joao', crmv: '12345' },
        },
      ]);

      const result = await service.getMedicalHistory('pet-1', 'business-1');

      expect(result).toHaveProperty('pet');
      expect(result).toHaveProperty('records');
      expect(result.records.length).toBe(1);
    });
  });
});
