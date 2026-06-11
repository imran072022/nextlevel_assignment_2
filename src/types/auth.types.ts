export interface JwtUserPayload {
  id: number;
  name: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}
