export interface User {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

export interface Admin {
  id: string;
  user_id: string;
  created_at: string;
}

export interface AuthState {
  user: User | null;
  admin: Admin | null;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AdminLoginCredentials {
  user_id: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
}
