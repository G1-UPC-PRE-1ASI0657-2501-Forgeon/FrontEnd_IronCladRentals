import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock de axios ANTES de importar el servicio
vi.mock('axios', () => {
  const mockAxiosInstance = {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  };

  return {
    default: {
      create: vi.fn(() => mockAxiosInstance)
    }
  };
});

// Mock del módulo API
vi.mock('@/api/api.js', () => {
  return {
    default: {
      get: vi.fn(),
    }
  };
});


import locationService from '@/shared/services/location-api.service.js';
import axios from 'axios';

describe('Location API Service', () => {
  let mockAxiosInstance;

  beforeEach(() => {
    vi.clearAllMocks();
    // Obtenemos la instancia mockeada que se creó
    mockAxiosInstance = axios.create();
  });

  describe('getAll', () => {
    it('debería obtener todas las ubicaciones exitosamente', async () => {
      // Arrange
      const mockLocations = [
        { id: 1, name: 'Centro', city: 'Lima', address: 'Av. Principal 123' },
        { id: 2, name: 'Miraflores', city: 'Lima', address: 'Av. Larco 456' }
      ];
      mockAxiosInstance.get.mockResolvedValue({ data: mockLocations });

      // Act
      const result = await locationService.getAll();

      // Assert
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('locations');
      expect(result.data).toEqual(mockLocations);
    });

    it('debería manejar errores al obtener ubicaciones', async () => {
      // Arrange
      const mockError = new Error('Server Error');
      mockAxiosInstance.get.mockRejectedValue(mockError);

      // Act & Assert
      await expect(locationService.getAll()).rejects.toThrow('Server Error');
    });
  });

  describe('getById', () => {
    it('debería obtener una ubicación por ID exitosamente', async () => {
      // Arrange
      const locationId = 1;
      const mockLocation = { id: 1, name: 'Centro', city: 'Lima', address: 'Av. Principal 123' };
      mockAxiosInstance.get.mockResolvedValue({ data: mockLocation });

      // Act
      const result = await locationService.getById(locationId);

      // Assert
      expect(mockAxiosInstance.get).toHaveBeenCalledWith(`locations/${locationId}`);
      expect(result.data).toEqual(mockLocation);
    });

    it('debería manejar errores al obtener ubicación por ID', async () => {
      // Arrange
      const locationId = 999;
      const mockError = new Error('Location not found');
      mockAxiosInstance.get.mockRejectedValue(mockError);

      // Act & Assert
      await expect(locationService.getById(locationId)).rejects.toThrow('Location not found');
    });
  });

  describe('create', () => {
    it('debería crear una ubicación exitosamente', async () => {
      // Arrange
      const locationData = {
        name: 'San Isidro',
        city: 'Lima',
        address: 'Av. Javier Prado 789'
      };
      const mockCreatedLocation = { id: 3, ...locationData };
      mockAxiosInstance.post.mockResolvedValue({ data: mockCreatedLocation });

      // Act
      const result = await locationService.create(locationData);

      // Assert
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('locations', locationData);
      expect(result.data).toEqual(mockCreatedLocation);
    });

    it('debería manejar errores al crear ubicación', async () => {
      // Arrange
      const locationData = { name: 'San Isidro' }; // datos incompletos
      const mockError = new Error('Invalid location data');
      mockAxiosInstance.post.mockRejectedValue(mockError);

      // Act & Assert
      await expect(locationService.create(locationData)).rejects.toThrow('Invalid location data');
    });
  });

  describe('update', () => {
    it('debería actualizar una ubicación exitosamente', async () => {
      // Arrange
      const locationId = 1;
      const locationData = {
        name: 'Centro Comercial',
        city: 'Lima',
        address: 'Av. Principal 123 - Actualizada'
      };
      const mockUpdatedLocation = { id: locationId, ...locationData };
      mockAxiosInstance.put.mockResolvedValue({ data: mockUpdatedLocation });

      // Act
      const result = await locationService.update(locationId, locationData);

      // Assert
      expect(mockAxiosInstance.put).toHaveBeenCalledWith(`locations/${locationId}`, locationData);
      expect(result.data).toEqual(mockUpdatedLocation);
    });

    it('debería manejar errores al actualizar ubicación', async () => {
      // Arrange
      const locationId = 1;
      const locationData = { name: 'Centro Comercial' };
      const mockError = new Error('Update failed');
      mockAxiosInstance.put.mockRejectedValue(mockError);

      // Act & Assert
      await expect(locationService.update(locationId, locationData)).rejects.toThrow('Update failed');
    });
  });

  describe('delete', () => {
    it('debería eliminar una ubicación exitosamente', async () => {
      // Arrange
      const locationId = 1;
      mockAxiosInstance.delete.mockResolvedValue({ data: { message: 'Location deleted successfully' } });

      // Act
      const result = await locationService.delete(locationId);

      // Assert
      expect(mockAxiosInstance.delete).toHaveBeenCalledWith(`locations/${locationId}`);
      expect(result.data).toEqual({ message: 'Location deleted successfully' });
    });

    it('debería manejar errores al eliminar ubicación', async () => {
      // Arrange
      const locationId = 999;
      const mockError = new Error('Location not found');
      mockAxiosInstance.delete.mockRejectedValue(mockError);

      // Act & Assert
      await expect(locationService.delete(locationId)).rejects.toThrow('Location not found');
    });
  });
});

