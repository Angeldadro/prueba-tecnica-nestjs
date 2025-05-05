export class OrderNotApprovedException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'OrderNotApprovedException';
  }
} 