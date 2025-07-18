export interface JwtSign {
  access_token: string;
  refresh_token: string;
}

export interface JwtPayload {
  sub: string;
  email: string;
}

export interface Payload {
  userId: string;
  email: string;
}
