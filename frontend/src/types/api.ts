export enum APIResponseStatus {
  SUCCESS = 200,
  ERROR_INVALID_INPUT = 400,
  ERROR = 500,

  ACCESS_TOKEN_NOT_FOUND = 600,
  ACCESS_TOKEN_EXPIRED = 601,
  ACCESS_TOKEN_INVALID = 602,
  ACCESS_TOKEN_FORMAT_ERROR = 603,

  REFRESH_TOKEN_NOT_FOUND = 700,
  REFRESH_TOKEN_EXPIRED = 701,
  REFRESH_TOKEN_INVALID = 702,

  ERROR_EMAIL_EXIST = 1001,
  ERROR_EMAIL_NOT_EXIST = 1002,
  ERROR_PASSWORD_ERROR = 1003,

  ERROR_USER_NOT_EXIST = 2001,
}

export type APIResponse = {
  status: APIResponseStatus;
  message: string;
  data: unknown;
};

export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type UserInfo = {
  name: string;
  email: string;
  avatar: string;
};

export type ProjectResponse = {
  id: string;
  name: string;
  categoriesCount: number;
  imagesCount: number;
};
