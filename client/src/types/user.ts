export type User = {
  id: string;
  email: string;
  displayName: string;
  token: string;
  imageUrl?: string;
}

export type LoginCreds = {
    email: string;
    password: string;
}

export type RegisterCreds = {
    displayName: string;
    email: string;
    password: string;
    gender: string;
    dateOfBirth: string;
    city: string;
    country: string;
}