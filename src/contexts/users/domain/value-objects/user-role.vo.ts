export enum UserRoleEnum {
  ADMIN = 'ADMIN',
  CUSTOMER = 'CUSTOMER',
}

export class UserRole {
  private constructor(private readonly value: UserRoleEnum) {}

  static create(value: UserRoleEnum): UserRole {
    return new UserRole(value);
  }

  getValue(): UserRoleEnum {
    return this.value;
  }

  isAdmin(): boolean {
    return this.value === UserRoleEnum.ADMIN;
  }

  isCustomer(): boolean {
    return this.value === UserRoleEnum.CUSTOMER;
  }
} 