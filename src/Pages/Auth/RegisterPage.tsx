import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, message } from 'antd';
import { useAuth } from '../../contexts/AuthContext';
import { register } from '../../services/auth';

const Register: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth(); // Add this to use your login function
  const navigate = useNavigate();

  const onFinish = async (values: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    setLoading(true);
    try {
      const { confirmPassword, ...registerData } = values;

      // Register the user
      await register(registerData);
      message.success('Account created successfully!');

      // Automatically log in the user
      const loginResponse = await login(registerData.email, registerData.password);
      if (loginResponse) {
        message.success('Logged in successfully!');
        navigate('/dashboard'); // Redirect to the dashboard
      } else {
        message.error('Login failed after registration. Please log in manually.');
        navigate('/login');
      }
    } catch (error: any) {
      message.error(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-200 to-gray-300 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 shadow-md rounded-lg">
        <h2 className="text-center text-3xl font-bold text-gray-900">Crear una Cuenta</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Ya te registrastes?{' '}
          <a href="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Inicia Sesion
          </a>
        </p>
        <Form name="register" onFinish={onFinish} className="mt-6">
          <Form.Item
            name="name"
            rules={[{ required: true, message: 'Por favor ingrese su nombre' }]}
          >
            <Input placeholder="Nombre" />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Por favor ingrese su email' },
              { type: 'email', message: 'Ingrese un email valido' },
            ]}
          >
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Por Favor ingrese su password' },
              { min: 6, message: 'El password debe contener al menos 6 caracteres' },
            ]}
            hasFeedback
          >
            <Input.Password placeholder="Password" />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            hasFeedback
            rules={[
              { required: true, message: 'Por Favor ingrese su confirmacion del password' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Los Passwords no coinciden'));
                },
              }),
            ]}
          >
            <Input.Password placeholder="Confirmar Password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full" loading={loading}>
              Registrar
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Register;
