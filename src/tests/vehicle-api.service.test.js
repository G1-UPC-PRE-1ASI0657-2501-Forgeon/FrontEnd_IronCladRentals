import { describe, it, expect, vi, beforeEach } from 'vitest';
import vehicleService from '@/shared/services/vehicle-api.service.js';

// Mock del módulo API
vi.mock('@/api/apiVehicleService', () => {
  return {
    default: {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    }
  };
});

import api from '@/api/apiVehicleService';

describe('Vehicle API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAll', () => {
    it('debería obtener todos los vehículos exitosamente', async () => {
      // Arrange
      const mockVehicles = [
        { id: 1, brand: 'Toyota', model: 'Corolla', year: 2020 },
        { id: 2, brand: 'Honda', model: 'Civic', year: 2021 }
      ];
      api.get.mockResolvedValue({ data: mockVehicles });

      // Act
      const result = await vehicleService.getAll();

      // Assert
      expect(api.get).toHaveBeenCalledWith('/vehicle');
      expect(result).toEqual(mockVehicles);
    });

    it('debería manejar errores al obtener todos los vehículos', async () => {
      // Arrange
      const mockError = { response: { data: 'Error del servidor' } };
      api.get.mockRejectedValue(mockError);

      // Act & Assert
      await expect(vehicleService.getAll()).rejects.toThrow('Error del servidor');
    });
  });

  describe('getAllModels', () => {
    it('debería obtener todos los modelos exitosamente', async () => {
      // Arrange
      const mockModels = [
        { id: 1, name: 'Corolla', brandId: 1 },
        { id: 2, name: 'Civic', brandId: 2 }
      ];
      api.get.mockResolvedValue({ data: mockModels });

      // Act
      const result = await vehicleService.getAllModels();

      // Assert
      expect(api.get).toHaveBeenCalledWith('/models');
      expect(result).toEqual(mockModels);
    });

    it('debería manejar errores al obtener modelos', async () => {
      // Arrange
      const mockError = { response: { data: 'Error obteniendo modelos' } };
      api.get.mockRejectedValue(mockError);

      // Act & Assert
      await expect(vehicleService.getAllModels()).rejects.toThrow('Error obteniendo modelos');
    });
  });

  describe('getAllBrands', () => {
    it('debería obtener todas las marcas exitosamente', async () => {
      // Arrange
      const mockBrands = [
        { id: 1, name: 'Toyota' },
        { id: 2, name: 'Honda' }
      ];
      api.get.mockResolvedValue({ data: mockBrands });

      // Act
      const result = await vehicleService.getAllBrands();

      // Assert
      expect(api.get).toHaveBeenCalledWith('/brands');
      expect(result).toEqual(mockBrands);
    });

    it('debería manejar errores al obtener marcas', async () => {
      // Arrange
      const mockError = { response: { data: 'Error obteniendo marcas' } };
      api.get.mockRejectedValue(mockError);

      // Act & Assert
      await expect(vehicleService.getAllBrands()).rejects.toThrow('Error obteniendo marcas');
    });
  });

  describe('getAvailable', () => {
    it('debería obtener vehículos disponibles y arreglar URLs de imagen', async () => {
      // Arrange
      const mockVehicles = [
        { id: 1, brand: 'Toyota', model: 'Corolla', imageUrl: '/images/corolla.jpg' },
        { id: 2, brand: 'Honda', model: 'Civic', imageUrl: 'http://example.com/civic.jpg' }
      ];
      api.get.mockResolvedValue({ data: mockVehicles });

      // Act
      const result = await vehicleService.getAvailable();

      // Assert
      expect(api.get).toHaveBeenCalledWith('/vehicle/available');
      expect(result).toHaveLength(2);
      expect(result[0].imageUrl).toContain('http://localhost:5162/images/corolla.jpg');
      expect(result[1].imageUrl).toBe('http://example.com/civic.jpg');
    });

    it('debería manejar errores al obtener vehículos disponibles', async () => {
      // Arrange
      const mockError = { response: { data: 'Error obteniendo vehículos disponibles' } };
      api.get.mockRejectedValue(mockError);

      // Act & Assert
      await expect(vehicleService.getAvailable()).rejects.toThrow('Error obteniendo vehículos disponibles');
    });
  });

  describe('getById', () => {
    it('debería obtener un vehículo por ID exitosamente', async () => {
      // Arrange
      const vehicleId = 1;
      const mockVehicle = { id: 1, brand: 'Toyota', model: 'Corolla', year: 2020, imageUrl: '/images/corolla.jpg' };
      api.get.mockResolvedValue({ data: mockVehicle });

      // Act
      const result = await vehicleService.getById(vehicleId);

      // Assert
      expect(api.get).toHaveBeenCalledWith(`/vehicle/${vehicleId}`);
      expect(result).toEqual({
        ...mockVehicle,
        imageUrl: 'http://localhost:5162/images/corolla.jpg'
      });
    });

    it('debería mantener URLs completas de imagen', async () => {
      // Arrange
      const vehicleId = 1;
      const mockVehicle = { id: 1, brand: 'Toyota', model: 'Corolla', year: 2020, imageUrl: 'http://example.com/image.jpg' };
      api.get.mockResolvedValue({ data: mockVehicle });

      // Act
      const result = await vehicleService.getById(vehicleId);

      // Assert
      expect(result.imageUrl).toBe('http://example.com/image.jpg');
    });

    it('debería manejar errores al obtener vehículo por ID', async () => {
      // Arrange
      const vehicleId = 999;
      const mockError = { response: { data: 'Vehículo no encontrado' } };
      api.get.mockRejectedValue(mockError);

      // Act & Assert
      await expect(vehicleService.getById(vehicleId)).rejects.toThrow('Vehículo no encontrado');
    });
  });

  describe('create', () => {
    it('debería crear un vehículo exitosamente con FormData', async () => {
      // Arrange
      const vehicleData = { brand: 'Toyota', model: 'Corolla', year: 2020 };
      const mockCreatedVehicle = { id: 3, ...vehicleData };
      api.post.mockResolvedValue({ data: mockCreatedVehicle });

      // Act
      const result = await vehicleService.create(vehicleData);

      // Assert
      expect(api.post).toHaveBeenCalledWith('/vehicle', expect.any(FormData));
      expect(result).toEqual(mockCreatedVehicle);
    });

    it('debería manejar FormData directamente', async () => {
      // Arrange
      const formData = new FormData();
      formData.append('brand', 'Honda');
      formData.append('model', 'Civic');
      const mockCreatedVehicle = { id: 4, brand: 'Honda', model: 'Civic' };
      api.post.mockResolvedValue({ data: mockCreatedVehicle });

      // Act
      const result = await vehicleService.create(formData);

      // Assert
      expect(api.post).toHaveBeenCalledWith('/vehicle', formData);
      expect(result).toEqual(mockCreatedVehicle);
    });

  });

  describe('update', () => {
    it('debería actualizar un vehículo exitosamente', async () => {
      // Arrange
      const vehicleId = 1;
      const vehicleData = { brand: 'Toyota', model: 'Corolla 2023', year: 2023 };
      const mockUpdatedVehicle = { id: vehicleId, ...vehicleData };
      api.put.mockResolvedValue({ data: mockUpdatedVehicle });

      // Act
      const result = await vehicleService.update(vehicleId, vehicleData);

      // Assert
      expect(api.put).toHaveBeenCalledWith(`/vehicle/${vehicleId}`, vehicleData);
      expect(result).toEqual(mockUpdatedVehicle);
    });

    it('debería manejar errores al actualizar vehículo', async () => {
      // Arrange
      const vehicleId = 1;
      const vehicleData = { brand: 'Toyota' };
      const mockError = { response: { data: 'Error al actualizar vehículo' } };
      api.put.mockRejectedValue(mockError);

      // Act & Assert
      await expect(vehicleService.update(vehicleId, vehicleData)).rejects.toThrow('Error al actualizar vehículo');
    });
  });

  describe('delete', () => {
    it('debería eliminar un vehículo exitosamente', async () => {
      // Arrange
      const vehicleId = 1;
      api.delete.mockResolvedValue({ data: { message: 'Vehículo eliminado' } });

      // Act
      const result = await vehicleService.delete(vehicleId);

      // Assert
      expect(api.delete).toHaveBeenCalledWith(`/vehicle/${vehicleId}`);
      expect(result).toBeUndefined(); // El método delete no retorna nada, solo hace console.log
    });

    it('debería manejar errores al eliminar vehículo', async () => {
      // Arrange
      const vehicleId = 999;
      const mockError = { response: { data: 'Vehículo no encontrado' } };
      api.delete.mockRejectedValue(mockError);

      // Act & Assert
      await expect(vehicleService.delete(vehicleId)).rejects.toThrow('Vehículo no encontrado');
    });
  });

  describe('createCompany', () => {
    it('debería crear una compañía exitosamente', async () => {
      // Arrange
      const companyData = { name: 'IronClad Rentals', address: 'Av. Principal 123' };
      const mockCreatedCompany = { id: 1, ...companyData };
      api.post.mockResolvedValue({ data: mockCreatedCompany });

      // Act
      const result = await vehicleService.createCompany(companyData);

      // Assert
      expect(api.post).toHaveBeenCalledWith('/companies', companyData);
      expect(result).toEqual(mockCreatedCompany);
    });

    it('debería manejar errores al crear compañía', async () => {
      // Arrange
      const companyData = { name: 'Compañía Inválida' };
      const mockError = { response: { data: 'Datos de compañía inválidos' } };
      api.post.mockRejectedValue(mockError);

      // Act & Assert
      await expect(vehicleService.createCompany(companyData)).rejects.toThrow('Datos de compañía inválidos');
    });
  });

  describe('createLocation', () => {
    it('debería crear una ubicación exitosamente', async () => {
      // Arrange
      const locationData = { name: 'Oficina Centro', address: 'Av. Central 456' };
      const mockCreatedLocation = { id: 1, ...locationData };
      api.post.mockResolvedValue({ data: mockCreatedLocation });

      // Act
      const result = await vehicleService.createLocation(locationData);

      // Assert
      expect(api.post).toHaveBeenCalledWith('/locations', locationData);
      expect(result).toEqual(mockCreatedLocation);
    });

    it('debería manejar errores al crear ubicación', async () => {
      // Arrange
      const locationData = { name: 'Ubicación Inválida' };
      const mockError = { response: { data: 'Datos de ubicación inválidos' } };
      api.post.mockRejectedValue(mockError);

      // Act & Assert
      await expect(vehicleService.createLocation(locationData)).rejects.toThrow('Datos de ubicación inválidos');
    });
  });

  describe('getCompanyLocations', () => {
    it('debería obtener ubicaciones de una compañía exitosamente', async () => {
      // Arrange
      const companyId = 1;
      const mockLocations = [
        { id: 1, name: 'Oficina Centro', companyId: 1 },
        { id: 2, name: 'Oficina Norte', companyId: 1 }
      ];
      api.get.mockResolvedValue({ data: mockLocations });

      // Act
      const result = await vehicleService.getCompanyLocations(companyId);

      // Assert
      expect(api.get).toHaveBeenCalledWith(`/companies/${companyId}/locations`);
      expect(result).toEqual(mockLocations);
    });

    it('debería manejar errores al obtener ubicaciones de compañía', async () => {
      // Arrange
      const companyId = 999;
      const mockError = { response: { data: 'Compañía no encontrada' } };
      api.get.mockRejectedValue(mockError);

      // Act & Assert
      await expect(vehicleService.getCompanyLocations(companyId)).rejects.toThrow('Compañía no encontrada');
    });
  });

  describe('getLocationById', () => {
    it('debería obtener una ubicación por ID exitosamente', async () => {
      // Arrange
      const locationId = 1;
      const mockLocation = { id: 1, name: 'Oficina Centro', address: 'Av. Central 456' };
      api.get.mockResolvedValue({ data: mockLocation });

      // Act
      const result = await vehicleService.getLocationById(locationId);

      // Assert
      expect(api.get).toHaveBeenCalledWith(`/locations/${locationId}`);
      expect(result).toEqual(mockLocation);
    });

    it('debería manejar errores al obtener ubicación por ID', async () => {
      // Arrange
      const locationId = 999;
      const mockError = { response: { data: 'Ubicación no encontrada' } };
      api.get.mockRejectedValue(mockError);

      // Act & Assert
      await expect(vehicleService.getLocationById(locationId)).rejects.toThrow('Ubicación no encontrada');
    });
  });

  describe('getCompanyMe', () => {
    it('debería obtener información de la compañía autenticada exitosamente', async () => {
      // Arrange
      const mockCompany = { id: 1, name: 'IronClad Rentals', email: 'admin@ironclad.com' };
      api.get.mockResolvedValue({ data: mockCompany });

      // Act
      const result = await vehicleService.getCompanyMe();

      // Assert
      expect(api.get).toHaveBeenCalledWith('/companies/me', {
        withCredentials: true,
        skipAuthInterceptor: true
      });
      expect(result).toEqual(mockCompany);
    });

    it('debería manejar error 401 (no autenticado) retornando null', async () => {
      // Arrange
      const mockError = { response: { status: 401, data: 'No autorizado' } };
      api.get.mockRejectedValue(mockError);

      // Act
      const result = await vehicleService.getCompanyMe();

      // Assert
      expect(result).toBeNull();
    });

    it('debería lanzar otros errores que no sean 401', async () => {
      // Arrange
      const mockError = { response: { status: 500, data: 'Error del servidor' } };
      api.get.mockRejectedValue(mockError);

      // Act & Assert
      await expect(vehicleService.getCompanyMe()).rejects.toEqual(mockError);
    });
  });
});
