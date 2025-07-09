import { describe, it, expect, vi, beforeEach } from 'vitest';
import userService from '@/shared/services/user-api.service.js';

// Mock del módulo API
vi.mock('@/api/apiAuthService.js', () => {
  return {
    default: {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    }
  };
});

import api from '@/api/apiAuthService.js';

describe('User API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAll', () => {
    it('debería obtener todos los usuarios exitosamente', async () => {
      // Arrange
      const mockUsers = [
        { id: 1, name: 'Usuario 1', email: 'user1@test.com' },
        { id: 2, name: 'Usuario 2', email: 'user2@test.com' }
      ];
      api.get.mockResolvedValue({ data: mockUsers });

      // Act
      const result = await userService.getAll();

      // Assert
      expect(api.get).toHaveBeenCalledWith('/users');
      expect(result).toEqual(mockUsers);
    });

    it('debería manejar errores al obtener todos los usuarios', async () => {
      // Arrange
      const mockError = { response: { data: 'Error del servidor' } };
      api.get.mockRejectedValue(mockError);

      // Act & Assert
      await expect(userService.getAll()).rejects.toThrow('Error del servidor');
      expect(api.get).toHaveBeenCalledWith('/users');
    });

    it('debería manejar errores de red', async () => {
      // Arrange
      const mockError = new Error('Network Error');
      api.get.mockRejectedValue(mockError);

      // Act & Assert
      await expect(userService.getAll()).rejects.toThrow('Error de red o del servidor');
    });
  });

  describe('getById', () => {
    it('debería obtener un usuario por ID exitosamente', async () => {
      // Arrange
      const userId = 1;
      const mockUser = { id: 1, name: 'Usuario Test', email: 'test@example.com' };
      api.get.mockResolvedValue({ data: mockUser });

      // Act
      const result = await userService.getById(userId);

      // Assert
      expect(api.get).toHaveBeenCalledWith(`/AuthUser/${userId}`);
      expect(result).toEqual(mockUser);
    });

    it('debería manejar errores al obtener usuario por ID', async () => {
      // Arrange
      const userId = 999;
      const mockError = { response: { data: 'Usuario no encontrado' } };
      api.get.mockRejectedValue(mockError);

      // Act & Assert
      await expect(userService.getById(userId)).rejects.toThrow('Usuario no encontrado');
    });
  });

  describe('create', () => {
    it('debería crear un usuario exitosamente', async () => {
      // Arrange
      const userData = { name: 'Nuevo Usuario', email: 'nuevo@test.com' };
      const mockCreatedUser = { id: 3, ...userData };
      api.post.mockResolvedValue({ data: mockCreatedUser });

      // Act
      const result = await userService.create(userData);

      // Assert
      expect(api.post).toHaveBeenCalledWith('/users', userData);
      expect(result).toEqual(mockCreatedUser);
    });

    it('debería manejar errores al crear usuario', async () => {
      // Arrange
      const userData = { name: 'Usuario Inválido' };
      const mockError = { response: { data: 'Datos de usuario inválidos' } };
      api.post.mockRejectedValue(mockError);

      // Act & Assert
      await expect(userService.create(userData)).rejects.toThrow('Datos de usuario inválidos');
    });
  });

  describe('update', () => {
    it('debería actualizar un usuario exitosamente', async () => {
      // Arrange
      const userId = 1;
      const userData = { name: 'Usuario Actualizado', email: 'actualizado@test.com' };
      const mockUpdatedUser = { id: userId, ...userData };
      api.put.mockResolvedValue({ data: mockUpdatedUser });

      // Act
      const result = await userService.update(userId, userData);

      // Assert
      expect(api.put).toHaveBeenCalledWith(`/users/${userId}`, userData);
      expect(result).toEqual(mockUpdatedUser);
    });

    it('debería manejar errores al actualizar usuario', async () => {
      // Arrange
      const userId = 1;
      const userData = { name: 'Usuario Actualizado' };
      const mockError = { response: { data: 'Error al actualizar usuario' } };
      api.put.mockRejectedValue(mockError);

      // Act & Assert
      await expect(userService.update(userId, userData)).rejects.toThrow('Error al actualizar usuario');
    });
  });

  describe('delete', () => {
    it('debería eliminar un usuario exitosamente', async () => {
      // Arrange
      const userId = 1;
      api.delete.mockResolvedValue({ data: { message: 'Usuario eliminado' } });

      // Act
      const result = await userService.delete(userId);

      // Assert
      expect(api.delete).toHaveBeenCalledWith(`/users/${userId}`);
      expect(result).toEqual({ message: 'Usuario eliminado' });
    });

    it('debería manejar errores al eliminar usuario', async () => {
      // Arrange
      const userId = 999;
      const mockError = { response: { data: 'Usuario no encontrado' } };
      api.delete.mockRejectedValue(mockError);

      // Act & Assert
      await expect(userService.delete(userId)).rejects.toThrow('Usuario no encontrado');
    });
  });
});
