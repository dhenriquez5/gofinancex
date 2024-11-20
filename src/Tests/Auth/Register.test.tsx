import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { message } from 'antd';
import { useAuth } from '../../contexts/AuthContext';
import { register } from '../../services/auth';
import Register from '../../Pages/Auth/RegisterPage';

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

// Mock the register API
jest.mock('../../services/auth', () => ({
  register: jest.fn(),
}));

describe('Register Component', () => {
  const mockRegister = register as jest.Mock;
  const mockLogin = jest.fn();
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({
      login: mockLogin,
    });
    const { useNavigate } = jest.requireMock('react-router-dom');
    useNavigate.mockReturnValue(mockNavigate);
  });

  it('renders the registration form correctly', () => {
    render(<Register />);

    expect(screen.getByText(/Crear una Cuenta/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Nombre/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Confirmar Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Registrar/i })).toBeInTheDocument();
  });

  it('validates form fields before submission', async () => {
    render(<Register />);

    fireEvent.click(screen.getByRole('button', { name: /Registrar/i }));

    await waitFor(() => {
      expect(screen.getByText(/Por favor ingrese su nombre/i)).toBeInTheDocument();
      expect(screen.getByText(/Por favor ingrese su email/i)).toBeInTheDocument();
      expect(screen.getByText(/Por Favor ingrese su password/i)).toBeInTheDocument();
    });
  });

  it('shows error if passwords do not match', async () => {
    render(<Register />);

    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Confirmar Password/i), {
      target: { value: 'password124' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Registrar/i }));

    await waitFor(() => {
      expect(screen.getByText(/Los Passwords no coinciden/i)).toBeInTheDocument();
    });
  });

  it('registers successfully and logs in the user', async () => {
    mockRegister.mockResolvedValue({ success: true });
    mockLogin.mockResolvedValue(true);

    render(<Register />);

    fireEvent.change(screen.getByPlaceholderText(/Nombre/i), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Email/i), {
      target: { value: 'john@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Confirmar Password/i), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Registrar/i }));

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      });
      expect(mockLogin).toHaveBeenCalledWith('john@example.com', 'password123');
      expect(message.success).toHaveBeenCalledWith('Account created successfully!');
      expect(message.success).toHaveBeenCalledWith('Logged in successfully!');
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('shows error message when registration fails', async () => {
    mockRegister.mockRejectedValue(new Error('Registration failed'));

    render(<Register />);

    fireEvent.change(screen.getByPlaceholderText(/Nombre/i), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Email/i), {
      target: { value: 'john@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Confirmar Password/i), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Registrar/i }));

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      });
    });

    await waitFor(() => {
      expect(message.error).toHaveBeenCalledWith('Registration failed');
    });
  });
});
