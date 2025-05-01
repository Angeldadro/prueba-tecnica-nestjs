export class OrderAlreadyExistsException extends Error {
  constructor(orderId: string) {
    super(`Order with ID "${orderId}" already exists.`);
    this.name = 'OrderAlreadyExistsException';
  }
}
