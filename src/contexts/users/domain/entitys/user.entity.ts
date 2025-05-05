import { UserRole } from "@users/domain/value-objects/user-role.vo";
export interface UserData {
  id: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
}

export class User {
  private constructor(
    private readonly id: string,
    private readonly email: string,
    private readonly password: string,
    private readonly role: UserRole,
    private readonly createdAt: Date,
  ) {}

  static create(data: Omit<UserData, 'id' | 'createdAt'>): User {
    return new User(
      crypto.randomUUID(),
      data.email,
      data.password,
      data.role,
      new Date(),
    );
  }

  static fromPrimitives(data: UserData): User {
    return new User(
      data.id,
      data.email,
      data.password,
      data.role,
      data.createdAt,
    );
  }

  toPrimitives(): UserData {
    return {
      id: this.id,
      email: this.email,
      password: this.password,
      role: this.role,
      createdAt: this.createdAt,
    };
  }

  getId(): string {
    return this.id;
  }

  getEmail(): string {
    return this.email;
  }

  getPassword(): string {
    return this.password;
  }

  getRole(): UserRole {
    return this.role;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }
} 