export interface AddressPrimitives {
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
    if (!street || !city || !state || !zipCode || !country) {
      throw new Error('Address must have street, city, state, zip code, and country.');
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

  public static fromPrimitives(data: AddressPrimitives): Address {
    return new Address(
      data.street,
      data.city,
      data.state,
      data.zipCode,
      data.country,
    );
  }

  public toPrimitives(): AddressPrimitives {
    return {
      street: this.street,
      city: this.city,
      state: this.state,
      zipCode: this.zipCode,
      country: this.country,
    };
  }

}
