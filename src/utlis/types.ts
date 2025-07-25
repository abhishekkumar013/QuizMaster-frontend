export interface SigninFormData {
  email: string;
  password: string;
  role: string;
}
export interface SignupFormData {
  name: string;
  email: string;
  password: string;
  role: string;
  parentEmail: string;
  phone: string;
  experienceYears: number;
}
export interface UpdateFormData {
  name: string;
  email: string;
  role: string;
  parentEmail: string;
  phone: string;
  experienceYears: number;
  id: string;
}
