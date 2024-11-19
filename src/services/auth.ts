import { User } from '../interfaces/User';
import fetchService from './fetch';

export const register = (values: User) => {
  return fetchService('auth/register', 'POST', values);
};

export const loginApi = (username: string, password: string) => {
  return fetchService('auth/login', 'POST', { password, username });
};
