import { User } from "@prisma/client";

export class ReturnLoginDto {
  access_token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  }

  constructor (accessToken: string, user: User) {
    this.access_token = accessToken;
    this.user = user;
  }
}

export class ReturnRegisterDto {
  access_token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  }

  constructor (accessToken: string, user: User) {
    this.access_token = accessToken;
    this.user = user;
  }
}