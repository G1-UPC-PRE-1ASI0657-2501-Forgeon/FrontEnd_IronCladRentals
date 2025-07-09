import { describe, it, expect, vi, beforeEach } from 'vitest';
import rentalService from '@/shared/services/rental-api.service.js';

// Mock del módulo API
vi.mock('@/api/apiRentalService.js', () => {
  return {
    default: {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    }
  };
});

import api from '@/api/apiRentalService.js';

describe('Rental API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAll', () => {
    it('debería obtener todas las rentas exitosamente', async () => {
      // Arrange
      const mockRentals = [
        { id: 1, vehicleId: 1, userId: 1, startDate: '2024-01-01', endDate: '2024-01-07' },
        { id: 2, vehicleId: 2, userId: 2, startDate: '2024-01-08', endDate: '2024-01-14' }
      ];
      api.get.mockResolvedValue({ data: mockRentals });

      // Act
      const result = await rentalService.getAll();

      // Assert
      expect(api.get).toHaveBeenCalledWith('/rentals');
      expect(result).toEqual(mockRentals);
    });

    it('debería manejar errores al obtener todas las rentas', async () => {
      // Arrange
      const mockError = { response: { data: 'Error del servidor' } };
      api.get.mockRejectedValue(mockError);

      // Act & Assert
      await expect(rentalService.getAll()).rejects.toThrow('Error del servidor');
      expect(api.get).toHaveBeenCalledWith('/rentals');
    });

    it('debería manejar errores de red', async () => {
      // Arrange
      const mockError = new Error('Network Error');
      api.get.mockRejectedValue(mockError);

      // Act & Assert
      await expect(rentalService.getAll()).rejects.toThrow('Error de red o del servidor');
    });
  });

  describe('getById', () => {
    it('debería obtener una renta por ID exitosamente', async () => {
      // Arrange
      const rentalId = 1;
      const mockRental = {
        id: 1,
        vehicleId: 1,
        userId: 1,
        startDate: '2024-01-01',
        endDate: '2024-01-07',
        totalCost: 350
      };
      api.get.mockResolvedValue({ data: mockRental });

      // Act
      const result = await rentalService.getById(rentalId);

      // Assert
      expect(api.get).toHaveBeenCalledWith(`/rentals/${rentalId}`);
      expect(result).toEqual(mockRental);
    });

    it('debería manejar errores al obtener renta por ID', async () => {
      // Arrange
      const rentalId = 999;
      const mockError = { response: { data: 'Renta no encontrada' } };
      api.get.mockRejectedValue(mockError);

      // Act & Assert
      await expect(rentalService.getById(rentalId)).rejects.toThrow('Renta no encontrada');
    });
  });

  describe('create', () => {
    it('debería crear una renta exitosamente', async () => {
      // Arrange
      const rentalData = {
        vehicleId: 1,
        userId: 1,
        startDate: '2024-01-01',
        endDate: '2024-01-07'
      };
      const mockCreatedRental = { id: 3, ...rentalData, totalCost: 350 };
      api.post.mockResolvedValue({ data: mockCreatedRental });

      // Act
      const result = await rentalService.create(rentalData);

      // Assert
      expect(api.post).toHaveBeenCalledWith('/rental', rentalData);
      expect(result).toEqual(mockCreatedRental);
    });

    it('debería manejar errores al crear renta', async () => {
      // Arrange
      const rentalData = { vehicleId: 1 }; // datos incompletos
      const mockError = { response: { data: 'Datos de renta inválidos' } };
      api.post.mockRejectedValue(mockError);

      // Act & Assert
      await expect(rentalService.create(rentalData)).rejects.toThrow('Datos de renta inválidos');
    });
  });

  describe('update', () => {
    it('debería actualizar una renta exitosamente', async () => {
      // Arrange
      const rentalId = 1;
      const rentalData = {
        vehicleId: 1,
        userId: 1,
        startDate: '2024-01-01',
        endDate: '2024-01-10' // fecha extendida
      };
      const mockUpdatedRental = { id: rentalId, ...rentalData, totalCost: 500 };
      api.put.mockResolvedValue({ data: mockUpdatedRental });

      // Act
      const result = await rentalService.update(rentalId, rentalData);

      // Assert
      expect(api.put).toHaveBeenCalledWith(`/rentals/${rentalId}`, rentalData);
      expect(result).toEqual(mockUpdatedRental);
    });

    it('debería manejar errores al actualizar renta', async () => {
      // Arrange
      const rentalId = 1;
      const rentalData = { startDate: '2024-01-01' };
      const mockError = { response: { data: 'Error al actualizar renta' } };
      api.put.mockRejectedValue(mockError);

      // Act & Assert
      await expect(rentalService.update(rentalId, rentalData)).rejects.toThrow('Error al actualizar renta');
    });
  });

  describe('delete', () => {
    it('debería eliminar una renta exitosamente', async () => {
      // Arrange
      const rentalId = 1;
      api.delete.mockResolvedValue({ data: { message: 'Renta eliminada' } });

      // Act
      const result = await rentalService.delete(rentalId);

      // Assert
      expect(api.delete).toHaveBeenCalledWith(`/rentals/${rentalId}`);
      expect(result).toBeUndefined(); // El método delete no retorna nada, solo hace console.log
    });

    it('debería manejar errores al eliminar renta', async () => {
      // Arrange
      const rentalId = 999;
      const mockError = { response: { data: 'Renta no encontrada' } };
      api.delete.mockRejectedValue(mockError);

      // Act & Assert
      await expect(rentalService.delete(rentalId)).rejects.toThrow('Renta no encontrada');
    });
  });

  describe('getByUserId', () => {
    it('debería obtener rentas por ID de usuario exitosamente', async () => {
      // Arrange
      const userId = 1;
      const mockRentals = [
        { id: 1, vehicleId: 1, userId: 1, startDate: '2024-01-01', endDate: '2024-01-07' },
        { id: 3, vehicleId: 3, userId: 1, startDate: '2024-02-01', endDate: '2024-02-07' }
      ];
      api.get.mockResolvedValue({ data: mockRentals });

      // Act
      const result = await rentalService.getByUserId(userId);

      // Assert
      expect(api.get).toHaveBeenCalledWith(`/rentals?user_id=${userId}`);
      expect(result).toEqual(mockRentals);
    });

    it('debería manejar errores al obtener rentas por usuario', async () => {
      // Arrange
      const userId = 999;
      const mockError = { response: { data: 'Usuario no encontrado' } };
      api.get.mockRejectedValue(mockError);

      // Act & Assert
      await expect(rentalService.getByUserId(userId)).rejects.toThrow('Usuario no encontrado');
    });
  });

  describe('getByVehicleId', () => {
    it('debería obtener rentas por ID de vehículo exitosamente', async () => {
      // Arrange
      const vehicleId = 1;
      const mockRentals = [
        { id: 1, vehicleId: 1, userId: 1, startDate: '2024-01-01', endDate: '2024-01-07' },
        { id: 4, vehicleId: 1, userId: 2, startDate: '2024-03-01', endDate: '2024-03-07' }
      ];
      api.get.mockResolvedValue({ data: mockRentals });

      // Act
      const result = await rentalService.getByVehicleId(vehicleId);

      // Assert
      expect(api.get).toHaveBeenCalledWith(`/rentals?vehicle_id=${vehicleId}`);
      expect(result).toEqual(mockRentals);
    });

    it('debería manejar errores al obtener rentas por vehículo', async () => {
      // Arrange
      const vehicleId = 999;
      const mockError = { response: { data: 'Vehículo no encontrado' } };
      api.get.mockRejectedValue(mockError);

      // Act & Assert
      await expect(rentalService.getByVehicleId(vehicleId)).rejects.toThrow('Vehículo no encontrado');
    });
  });

  describe('getRentalsActiveMe', () => {
    it('debería obtener rentas activas del usuario autenticado exitosamente', async () => {
      // Arrange
      const mockActiveRentals = [
        { id: 1, vehicleId: 1, userId: 1, status: 'active', startDate: '2024-01-01', endDate: '2024-01-07' },
        { id: 2, vehicleId: 2, userId: 1, status: 'active', startDate: '2024-01-08', endDate: '2024-01-14' }
      ];
      api.get.mockResolvedValue({ data: mockActiveRentals });

      // Act
      const result = await rentalService.getRentalsActiveMe();

      // Assert
      expect(api.get).toHaveBeenCalledWith('/rental/me/active', {
        withCredentials: true,
        skipAuthInterceptor: true
      });
      expect(result).toEqual(mockActiveRentals);
    });

    it('debería manejar error 401 (no autenticado) retornando null', async () => {
      // Arrange
      const mockError = { response: { status: 401, data: 'No autorizado' } };
      api.get.mockRejectedValue(mockError);

      // Act
      const result = await rentalService.getRentalsActiveMe();

      // Assert
      expect(result).toBeNull();
    });

    it('debería lanzar otros errores que no sean 401', async () => {
      // Arrange
      const mockError = { response: { status: 500, data: 'Error del servidor' } };
      api.get.mockRejectedValue(mockError);

      // Act & Assert
      await expect(rentalService.getRentalsActiveMe()).rejects.toEqual(mockError);
    });
  });

  describe('getRentalsPendingMe', () => {
    it('debería obtener rentas pendientes del usuario autenticado exitosamente', async () => {
      // Arrange
      const mockPendingRentals = [
        { id: 3, vehicleId: 3, userId: 1, status: 'pending', startDate: '2024-02-01', endDate: '2024-02-07' },
        { id: 4, vehicleId: 4, userId: 1, status: 'pending', startDate: '2024-02-15', endDate: '2024-02-21' }
      ];
      api.get.mockResolvedValue({ data: mockPendingRentals });

      // Act
      const result = await rentalService.getRentalsPendingMe();

      // Assert
      expect(api.get).toHaveBeenCalledWith('/rental/me/pending', {
        withCredentials: true,
        skipAuthInterceptor: true
      });
      expect(result).toEqual(mockPendingRentals);
    });

    it('debería manejar error 401 (no autenticado) retornando null', async () => {
      // Arrange
      const mockError = { response: { status: 401, data: 'No autorizado' } };
      api.get.mockRejectedValue(mockError);

      // Act
      const result = await rentalService.getRentalsPendingMe();

      // Assert
      expect(result).toBeNull();
    });

    it('debería lanzar otros errores que no sean 401', async () => {
      // Arrange
      const mockError = { response: { status: 500, data: 'Error del servidor' } };
      api.get.mockRejectedValue(mockError);

      // Act & Assert
      await expect(rentalService.getRentalsPendingMe()).rejects.toEqual(mockError);
    });
  });

  describe('getByCompanyId', () => {
    it('debería obtener rentas pendientes por ID de compañía exitosamente', async () => {
      // Arrange
      const companyId = 1;
      const mockCompanyRentals = [
        { id: 5, vehicleId: 5, companyId: 1, status: 'pending', startDate: '2024-03-01', endDate: '2024-03-07' },
        { id: 6, vehicleId: 6, companyId: 1, status: 'pending', startDate: '2024-03-08', endDate: '2024-03-14' }
      ];
      api.get.mockResolvedValue({ data: mockCompanyRentals });

      // Act
      const result = await rentalService.getByCompanyId(companyId);

      // Assert
      expect(api.get).toHaveBeenCalledWith(`/rental/company/${companyId}/pending`);
      expect(result).toEqual(mockCompanyRentals);
    });

    it('debería manejar errores al obtener rentas por compañía', async () => {
      // Arrange
      const companyId = 999;
      const mockError = { response: { data: 'Compañía no encontrada' } };
      api.get.mockRejectedValue(mockError);

      // Act & Assert
      await expect(rentalService.getByCompanyId(companyId)).rejects.toThrow('Compañía no encontrada');
    });
  });
});
