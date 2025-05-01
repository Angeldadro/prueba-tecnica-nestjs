export class OrderNotFoundException extends Error {
  constructor(orderId: string) {
    super(`Order with id ${orderId} not found`);
  }
}
