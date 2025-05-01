export interface AddressData {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export class Address {
  constructor(
    public readonly street: string,
    public readonly city: string,
    public readonly state: string,
    public readonly zipCode: string,
    public readonly country: string,
  ) {
    if (!street || !city || !zipCode || !country) {
      throw new Error('Address must have street, city, zip code, and country.');
    }
  }

  equals(address: Address): boolean {
    return (
      this.street === address.street &&
      this.city === address.city &&
      this.state === address.state &&
      this.zipCode === address.zipCode &&
      this.country === address.country
    );
  }

  public static fromObject(
    data: AddressData | null | undefined,
  ): Address | null {
    if (!data) return null;
    return new Address(
      data.street,
      data.city,
      data.state,
      data.zipCode,
      data.country,
    );
  }

  public toObject(): AddressData {
    return {
      street: this.street,
      city: this.city,
      state: this.state,
      zipCode: this.zipCode,
      country: this.country,
    };
  }

  toString(): string {
    return `${this.street}, ${this.city}, ${this.state} ${this.zipCode}, ${this.country}`;
  }
}
