import axios from 'axios';
import { UserLogin, UserRegister, AuthResponse, Workout, Nutrition, User, ExerciseDefinition } from '../types';

const api = axios.create({
  baseURL: '/', // Use root and specify full paths in requests
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const loginUser = async (credentials: UserLogin): Promise<AuthResponse> => {
  const params = new URLSearchParams();
  params.append('username', credentials.email);
  params.append('password', credentials.password);

  const response = await api.post<AuthResponse>('/api/auth/jwt/login', params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  return response.data;
};

export const registerUser = async (userData: UserRegister): Promise<User> => {
    const response = await api.post<User>('/api/auth/register', userData);
    return response.data;
};

export const createWorkout = async (workoutData: Workout): Promise<Workout> => {
    const response = await api.post<Workout>('/api/workouts/', workoutData);
    return response.data;
};

export const getWorkouts = async (): Promise<Workout[]> => {
    const response = await api.get<Workout[]>('/api/workouts/');
    return response.data;
};

export const createNutrition = async (nutritionData: Nutrition): Promise<Nutrition> => {
    const response = await api.post<Nutrition>('/api/nutrition/', nutritionData);
    return response.data;
};

export const getNutrition = async (): Promise<Nutrition[]> => {
    const response = await api.get<Nutrition[]>('/api/nutrition/');
    return response.data;
};

export const getMe = async (): Promise<User> => {
    const response = await api.get<User>('/api/users/me');
    return response.data;
};

export const getExerciseDefinitions = async (): Promise<ExerciseDefinition[]> => {
    const response = await api.get<ExerciseDefinition[]>('/api/exercise-definitions/');
    return response.data;
};

export const createExerciseDefinition = async (name: string): Promise<ExerciseDefinition> => {
    const response = await api.post<ExerciseDefinition>('/api/exercise-definitions/', { name });
    return response.data;
};

export const updateExerciseDefinition = async (id: number, name: string): Promise<ExerciseDefinition> => {
    const response = await api.patch<ExerciseDefinition>(`/api/exercise-definitions/${id}`, { name });
    return response.data;
};

export const deleteExerciseDefinition = async (id: number): Promise<void> => {
    await api.delete(`/api/exercise-definitions/${id}`);
};
