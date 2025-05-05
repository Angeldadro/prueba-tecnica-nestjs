export class InsufficientStockException extends Error {
  constructor(itemId: string, requested: number, available: number) {
    super(
      `Insufficient stock for item "${itemId}". Requested: ${requested}, Available: ${available}.`,
    );
    this.name = 'InsufficientStockException';
  }
}
