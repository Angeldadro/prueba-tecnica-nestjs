export class InvalidCardDetailsException extends Error {
  constructor(message: string = 'Invalid card details provided.') {
    super(message);
    this.name = 'InvalidCardDetailsException';
  }
}
