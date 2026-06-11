export interface UserLogin {
  email: string;
  password: string;
}

export interface UserRegister extends UserLogin {
  // Add any other registration fields if necessary
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface User {
  id: number;
  email: string;
  is_active: boolean;
}

export interface Exercise {
  id?: number;
  name: string;
  sets: number;
  reps: number;
  weight: number;
  comment?: string;
  workout_id?: number;
}

export interface Workout {
  id?: number;
  name: string;
  exercises: Exercise[];
  user_id?: number;
}

export interface Nutrition {
  id?: number;
  date: string; // YYYY-MM-DD
  calories: number;
  protein: number;
  user_id?: number;
}

export interface ExerciseDefinition {
  id: number;
  name: string;
  user_id?: number;
}

export interface WorkoutUpdate {
  name: string;
}

export interface ExerciseUpdate {
  name?: string;
  sets?: number;
  reps?: number;
  weight?: number;
  comment?: string;
}
