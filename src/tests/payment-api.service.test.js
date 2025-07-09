import { describe, it, expect, vi, beforeEach } from 'vitest';


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


import paymentService from '@/shared/services/payment-api.service.js';
import axios from 'axios';

describe('Payment API Service', () => {
  let mockAxiosInstance;

  beforeEach(() => {
    vi.clearAllMocks();
    // Obtenemos la instancia mockeada que se creó
    mockAxiosInstance = axios.create();
  });

  describe('getAll', () => {
    it('debería obtener todos los métodos de pago exitosamente', async () => {
      // Arrange
      const mockPayments = [
        { id: 1, type: 'credit_card', user_id: 1, card_number: '**** **** **** 1234' },
        { id: 2, type: 'debit_card', user_id: 2, card_number: '**** **** **** 5678' }
      ];
      mockAxiosInstance.get.mockResolvedValue({ data: mockPayments });

      // Act
      const result = await paymentService.getAll();

      // Assert
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('payment-methods');
      expect(result.data).toEqual(mockPayments);
    });

    it('debería manejar errores al obtener métodos de pago', async () => {
      // Arrange
      const mockError = new Error('Server Error');
      mockAxiosInstance.get.mockRejectedValue(mockError);

      // Act & Assert
      await expect(paymentService.getAll()).rejects.toThrow('Server Error');
    });
  });

  describe('getById', () => {
    it('debería obtener un método de pago por ID exitosamente', async () => {
      // Arrange
      const paymentId = 1;
      const mockPayment = { id: 1, type: 'credit_card', user_id: 1, card_number: '**** **** **** 1234' };
      mockAxiosInstance.get.mockResolvedValue({ data: mockPayment });

      // Act
      const result = await paymentService.getById(paymentId);

      // Assert
      expect(mockAxiosInstance.get).toHaveBeenCalledWith(`payment-methods/${paymentId}`);
      expect(result.data).toEqual(mockPayment);
    });

    it('debería manejar errores al obtener método de pago por ID', async () => {
      // Arrange
      const paymentId = 999;
      const mockError = new Error('Payment not found');
      mockAxiosInstance.get.mockRejectedValue(mockError);

      // Act & Assert
      await expect(paymentService.getById(paymentId)).rejects.toThrow('Payment not found');
    });
  });

  describe('getByUserId', () => {
    it('debería obtener métodos de pago por ID de usuario exitosamente', async () => {
      // Arrange
      const userId = 1;
      const mockPayments = [
        { id: 1, type: 'credit_card', user_id: 1, card_number: '**** **** **** 1234' },
        { id: 3, type: 'debit_card', user_id: 1, card_number: '**** **** **** 9876' }
      ];
      mockAxiosInstance.get.mockResolvedValue({ data: mockPayments });

      // Act
      const result = await paymentService.getByUserId(userId);

      // Assert
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('payment-methods', { params: { user_id: userId } });
      expect(result.data).toEqual(mockPayments);
    });

    it('debería manejar errores al obtener métodos de pago por usuario', async () => {
      // Arrange
      const userId = 999;
      const mockError = new Error('User not found');
      mockAxiosInstance.get.mockRejectedValue(mockError);

      // Act & Assert
      await expect(paymentService.getByUserId(userId)).rejects.toThrow('User not found');
    });
  });

  describe('create', () => {
    it('debería crear un método de pago exitosamente', async () => {
      // Arrange
      const paymentData = {
        type: 'credit_card',
        user_id: 1,
        card_number: '1234567890123456',
        expiry_date: '12/25',
        cvv: '123'
      };
      const mockCreatedPayment = { id: 3, ...paymentData };
      mockAxiosInstance.post.mockResolvedValue({ data: mockCreatedPayment });

      // Act
      const result = await paymentService.create(paymentData);

      // Assert
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('payment-methods', paymentData);
      expect(result.data).toEqual(mockCreatedPayment);
    });

    it('debería manejar errores al crear método de pago', async () => {
      // Arrange
      const paymentData = { type: 'credit_card' }; // datos incompletos
      const mockError = new Error('Invalid payment data');
      mockAxiosInstance.post.mockRejectedValue(mockError);

      // Act & Assert
      await expect(paymentService.create(paymentData)).rejects.toThrow('Invalid payment data');
    });
  });

  describe('update', () => {
    it('debería actualizar un método de pago exitosamente', async () => {
      // Arrange
      const paymentId = 1;
      const paymentData = {
        type: 'credit_card',
        user_id: 1,
        card_number: '1234567890123456',
        expiry_date: '12/26' // fecha actualizada
      };
      const mockUpdatedPayment = { id: paymentId, ...paymentData };
      mockAxiosInstance.put.mockResolvedValue({ data: mockUpdatedPayment });

      // Act
      const result = await paymentService.update(paymentId, paymentData);

      // Assert
      expect(mockAxiosInstance.put).toHaveBeenCalledWith(`payment-methods/${paymentId}`, paymentData);
      expect(result.data).toEqual(mockUpdatedPayment);
    });

    it('debería manejar errores al actualizar método de pago', async () => {
      // Arrange
      const paymentId = 1;
      const paymentData = { type: 'credit_card' };
      const mockError = new Error('Update failed');
      mockAxiosInstance.put.mockRejectedValue(mockError);

      // Act & Assert
      await expect(paymentService.update(paymentId, paymentData)).rejects.toThrow('Update failed');
    });
  });

  describe('delete', () => {
    it('debería eliminar un método de pago exitosamente', async () => {
      // Arrange
      const paymentId = 1;
      mockAxiosInstance.delete.mockResolvedValue({ data: { message: 'Payment method deleted' } });

      // Act
      const result = await paymentService.delete(paymentId);

      // Assert
      expect(mockAxiosInstance.delete).toHaveBeenCalledWith(`payment-methods/${paymentId}`);
      expect(result.data).toEqual({ message: 'Payment method deleted' });
    });

    it('debería manejar errores al eliminar método de pago', async () => {
      // Arrange
      const paymentId = 999;
      const mockError = new Error('Payment method not found');
      mockAxiosInstance.delete.mockRejectedValue(mockError);

      // Act & Assert
      await expect(paymentService.delete(paymentId)).rejects.toThrow('Payment method not found');
    });
  });
});
