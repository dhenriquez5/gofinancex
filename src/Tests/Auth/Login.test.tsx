import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { message } from 'antd';
import { useAuth } from '../../contexts/AuthContext';
import Login from '../../Pages/Auth/LoginPage';

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

// Mock the useAuth hook
jest.mock('../../contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

// Mock the Ant Design message module
jest.mock('antd', () => ({
  ...jest.requireActual('antd'),
  message: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('Login Component', () => {
  const mockLogin = jest.fn(() => new Promise((resolve) => setTimeout(resolve, 500)));

  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({
      login: mockLogin,
      isAuthenticated: false,
    });
    const { useNavigate } = jest.requireMock('react-router-dom');
    useNavigate.mockReturnValue(mockNavigate);
  });

  it('renders the login form correctly', () => {
    render(<Login />);

    expect(screen.getByText(/Iniciar Sesion GoFinanceX/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Usuario/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Iniciar Sesion/i })).toBeInTheDocument();
    expect(screen.getByText(/Crear nueva cuenta/i)).toBeInTheDocument();
  });

  it('navigates to the dashboard if the user is authenticated', () => {
    (useAuth as jest.Mock).mockReturnValue({
      login: mockLogin,
      isAuthenticated: true,
    });

    render(<Login />);

    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  it('shows error message for invalid credentials', async () => {
    mockLogin.mockResolvedValue(false);

    render(<Login />);

    fireEvent.change(screen.getByPlaceholderText(/Usuario/i), {
      target: { value: 'invalidUser' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), {
      target: { value: 'wrongPassword' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Iniciar Sesion/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('invalidUser', 'wrongPassword');
      expect(message.error).toHaveBeenCalledWith('Invalid username or password');
    });
  });

  it('logs in successfully and navigates to the dashboard', async () => {
    mockLogin.mockResolvedValue(true);

    render(<Login />);

    fireEvent.change(screen.getByPlaceholderText(/Usuario/i), {
      target: { value: 'validUser' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), {
      target: { value: 'correctPassword' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Iniciar Sesion/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('validUser', 'correctPassword');
      expect(message.success).toHaveBeenCalledWith('Login successful');
    });
  });

  it('shows an error message when login throws an error', async () => {
    mockLogin.mockRejectedValue(new Error('Server error'));

    render(<Login />);

    fireEvent.change(screen.getByPlaceholderText(/Usuario/i), {
      target: { value: 'validUser' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), {
      target: { value: 'correctPassword' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Iniciar Sesion/i }));
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('validUser', 'correctPassword');
      expect(message.error).toHaveBeenCalledWith('An error occurred during login');
    });
  });
});
