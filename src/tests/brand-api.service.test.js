import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrandApiService } from '@/shared/services/brand-api.service.js';

// Mock del módulo API
vi.mock('@/api/apiVehicleService.js', () => {
  return {
    default: {
      get: vi.fn(),
    }
  };
});

import api from '@/api/apiVehicleService.js';

describe('Brand API Service', () => {
  let brandService;

  beforeEach(() => {
    vi.clearAllMocks();
    brandService = new BrandApiService();
  });

  describe('getAll', () => {
    it('debería obtener todas las marcas exitosamente', async () => {
      // Arrange
      const mockBrands = [
        { id: 1, name: 'Toyota', country: 'Japan' },
        { id: 2, name: 'Honda', country: 'Japan' },
        { id: 3, name: 'Ford', country: 'USA' }
      ];
      api.get.mockResolvedValue({ data: mockBrands });

      // Act
      const result = await brandService.getAll();

      // Assert
      expect(api.get).toHaveBeenCalledWith('/brands');
      expect(result).toEqual(mockBrands);
    });

    it('debería manejar errores con response data', async () => {
      // Arrange
      const mockError = { 
        response: { data: 'Error del servidor al obtener marcas' } 
      };
      api.get.mockRejectedValue(mockError);

      // Act & Assert
      await expect(brandService.getAll()).rejects.toThrow('Error del servidor al obtener marcas');
      expect(api.get).toHaveBeenCalledWith('/brands');
    });

    it('debería manejar errores de red sin response', async () => {
      // Arrange
      const mockError = new Error('Network Error');
      api.get.mockRejectedValue(mockError);

      // Act & Assert
      await expect(brandService.getAll()).rejects.toThrow('Error de red o servidor');
    });

    it('debería manejar errores con response vacía', async () => {
      // Arrange
      const mockError = { response: null };
      api.get.mockRejectedValue(mockError);

      // Act & Assert
      await expect(brandService.getAll()).rejects.toThrow('Error de red o servidor');
    });
  });
});
