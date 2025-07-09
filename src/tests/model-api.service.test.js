import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ModelApiService } from '@/shared/services/model-api.service.js';

// Mock del módulo API
vi.mock('@/api/apiVehicleService.js', () => {
  return {
    default: {
      get: vi.fn(),
    }
  };
});

import api from '@/api/apiVehicleService.js';

describe('Model API Service', () => {
  let modelService;

  beforeEach(() => {
    vi.clearAllMocks();
    modelService = new ModelApiService();
  });

  describe('getAll', () => {
    it('debería obtener todos los modelos exitosamente', async () => {
      // Arrange
      const mockModels = [
        { id: 1, name: 'Corolla', brandId: 1, year: 2020 },
        { id: 2, name: 'Civic', brandId: 2, year: 2021 },
        { id: 3, name: 'Focus', brandId: 3, year: 2019 }
      ];
      api.get.mockResolvedValue({ data: mockModels });

      // Act
      const result = await modelService.getAll();

      // Assert
      expect(api.get).toHaveBeenCalledWith('/models');
      expect(result).toEqual(mockModels);
    });

    it('debería manejar errores con response data', async () => {
      // Arrange
      const mockError = { 
        response: { data: 'Error del servidor al obtener modelos' } 
      };
      api.get.mockRejectedValue(mockError);

      // Act & Assert
      await expect(modelService.getAll()).rejects.toThrow('Error del servidor al obtener modelos');
      expect(api.get).toHaveBeenCalledWith('/models');
    });

    it('debería manejar errores de red sin response', async () => {
      // Arrange
      const mockError = new Error('Network Error');
      api.get.mockRejectedValue(mockError);

      // Act & Assert
      await expect(modelService.getAll()).rejects.toThrow('Error de red o servidor');
    });

    it('debería manejar errores con response null', async () => {
      // Arrange
      const mockError = { response: null };
      api.get.mockRejectedValue(mockError);

      // Act & Assert
      await expect(modelService.getAll()).rejects.toThrow('Error de red o servidor');
    });

    it('debería manejar errores con response undefined', async () => {
      // Arrange
      const mockError = { response: undefined };
      api.get.mockRejectedValue(mockError);

      // Act & Assert
      await expect(modelService.getAll()).rejects.toThrow('Error de red o servidor');
    });
  });
});
