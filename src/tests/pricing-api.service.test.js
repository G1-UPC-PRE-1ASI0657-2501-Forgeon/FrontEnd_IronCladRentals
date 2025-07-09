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

import pricingService from '@/shared/services/pricing-api.service.js';
import axios from 'axios';

describe('Pricing API Service', () => {
  let mockAxiosInstance;

  beforeEach(() => {
    vi.clearAllMocks();
    // Obtenemos la instancia mockeada que se creó
    mockAxiosInstance = axios.create();
  });

  describe('getAll', () => {
    it('debería obtener todos los precios exitosamente', async () => {
      // Arrange
      const mockPricings = [
        { id: 1, vehicleType: 'sedan', dailyRate: 50, weeklyRate: 300, monthlyRate: 1000 },
        { id: 2, vehicleType: 'suv', dailyRate: 75, weeklyRate: 450, monthlyRate: 1500 }
      ];
      mockAxiosInstance.get.mockResolvedValue({ data: mockPricings });

      // Act
      const result = await pricingService.getAll();

      // Assert
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('pricings');
      expect(result.data).toEqual(mockPricings);
    });

    it('debería manejar errores al obtener precios', async () => {
      // Arrange
      const mockError = new Error('Server Error');
      mockAxiosInstance.get.mockRejectedValue(mockError);

      // Act & Assert
      await expect(pricingService.getAll()).rejects.toThrow('Server Error');
    });
  });

  describe('getById', () => {
    it('debería obtener un precio por ID exitosamente', async () => {
      // Arrange
      const pricingId = 1;
      const mockPricing = { id: 1, vehicleType: 'sedan', dailyRate: 50, weeklyRate: 300, monthlyRate: 1000 };
      mockAxiosInstance.get.mockResolvedValue({ data: mockPricing });

      // Act
      const result = await pricingService.getById(pricingId);

      // Assert
      expect(mockAxiosInstance.get).toHaveBeenCalledWith(`pricings/${pricingId}`);
      expect(result.data).toEqual(mockPricing);
    });

    it('debería manejar errores al obtener precio por ID', async () => {
      // Arrange
      const pricingId = 999;
      const mockError = new Error('Pricing not found');
      mockAxiosInstance.get.mockRejectedValue(mockError);

      // Act & Assert
      await expect(pricingService.getById(pricingId)).rejects.toThrow('Pricing not found');
    });
  });

  describe('create', () => {
    it('debería crear un precio exitosamente', async () => {
      // Arrange
      const pricingData = {
        vehicleType: 'compact',
        dailyRate: 40,
        weeklyRate: 250,
        monthlyRate: 800
      };
      const mockCreatedPricing = { id: 3, ...pricingData };
      mockAxiosInstance.post.mockResolvedValue({ data: mockCreatedPricing });

      // Act
      const result = await pricingService.create(pricingData);

      // Assert
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('pricings', pricingData);
      expect(result.data).toEqual(mockCreatedPricing);
    });

    it('debería manejar errores al crear precio', async () => {
      // Arrange
      const pricingData = { vehicleType: 'compact' }; // datos incompletos
      const mockError = new Error('Invalid pricing data');
      mockAxiosInstance.post.mockRejectedValue(mockError);

      // Act & Assert
      await expect(pricingService.create(pricingData)).rejects.toThrow('Invalid pricing data');
    });
  });

  describe('update', () => {
    it('debería actualizar un precio exitosamente', async () => {
      // Arrange
      const pricingId = 1;
      const pricingData = {
        vehicleType: 'sedan',
        dailyRate: 55, // precio actualizado
        weeklyRate: 330,
        monthlyRate: 1100
      };
      const mockUpdatedPricing = { id: pricingId, ...pricingData };
      mockAxiosInstance.put.mockResolvedValue({ data: mockUpdatedPricing });

      // Act
      const result = await pricingService.update(pricingId, pricingData);

      // Assert
      expect(mockAxiosInstance.put).toHaveBeenCalledWith(`pricings/${pricingId}`, pricingData);
      expect(result.data).toEqual(mockUpdatedPricing);
    });

    it('debería manejar errores al actualizar precio', async () => {
      // Arrange
      const pricingId = 1;
      const pricingData = { dailyRate: 55 };
      const mockError = new Error('Update failed');
      mockAxiosInstance.put.mockRejectedValue(mockError);

      // Act & Assert
      await expect(pricingService.update(pricingId, pricingData)).rejects.toThrow('Update failed');
    });
  });

  describe('delete', () => {
    it('debería eliminar un precio exitosamente', async () => {
      // Arrange
      const pricingId = 1;
      mockAxiosInstance.delete.mockResolvedValue({ data: { message: 'Pricing deleted successfully' } });

      // Act
      const result = await pricingService.delete(pricingId);

      // Assert
      expect(mockAxiosInstance.delete).toHaveBeenCalledWith(`pricings/${pricingId}`);
      expect(result.data).toEqual({ message: 'Pricing deleted successfully' });
    });

    it('debería manejar errores al eliminar precio', async () => {
      // Arrange
      const pricingId = 999;
      const mockError = new Error('Pricing not found');
      mockAxiosInstance.delete.mockRejectedValue(mockError);

      // Act & Assert
      await expect(pricingService.delete(pricingId)).rejects.toThrow('Pricing not found');
    });
  });
});
