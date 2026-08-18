import { apiRequest } from './api';
import { User, Token } from '../types';

export async function registerUser(payload: {
  email: string;
  username: string;
  password: string;
}): Promise<User> {
  return apiRequest<User>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function loginUser(credentials: {
  username: string;
  password: string;
}): Promise<Token> {
  // FastAPI OAuth2PasswordRequestForm requires application/x-www-form-urlencoded
  const formData = new URLSearchParams();
  formData.append('username', credentials.username);
  formData.append('password', credentials.password);

  return apiRequest<Token>('/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData.toString(),
  });
}

export async function getMe(): Promise<User> {
  return apiRequest<User>('/auth/me', {
    method: 'GET',
  });
}
