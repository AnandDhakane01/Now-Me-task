import { Users } from "../entities/users";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        username: string;
        password: string;
        email: string;
      };
    }
  }
}
