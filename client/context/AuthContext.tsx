'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { useRouter } from 'next/navigation';


type User = {
  id: string;
  username: string;
};


type AuthResponse = {
  token: string;
  _id: string;
  username: string;
};

type ErrorResponse = {
  message?: string;
  error?: string;
};


type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
  clearError: () => void;
};


const AuthContext = createContext<AuthContextType | undefined>(undefined);


const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});


export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();


  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });


    const responseInterceptor = api.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError<ErrorResponse>) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          setUser(null);
          setToken(null);
          router.push('/login');
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [router]);


  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const { data } = await api.get<User>('/auth/user');
          setUser(data);
          setToken(storedToken);
        } catch (err) {
          localStorage.removeItem('token');
          const error = err as AxiosError<ErrorResponse>;
          setError(error.response?.data?.message || 'La sesión ha expirado');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);


  const handleApiError = (error: unknown): string => {
    const err = error as AxiosError<ErrorResponse>;
    return err.response?.data?.message || 
           err.response?.data?.error || 
           err.message || 
           'Error desconocido';
  };


  const login = async (username: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post<AuthResponse>('/auth/login', { username, password });
      localStorage.setItem('token', data.token);
      setUser({ id: data._id, username: data.username });
      setToken(data.token);
      router.push('/');
    } catch (error) {
      const errorMessage = handleApiError(error);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };


  const register = async (username: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post<AuthResponse>('/auth/register', { username, password });
      localStorage.setItem('token', data.token);
      setUser({ id: data._id, username: data.username });
      setToken(data.token);
      router.push('/');
    } catch (error) {
      const errorMessage = handleApiError(error);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };


  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
    router.push('/login');
  };


  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        loading,
        error,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};