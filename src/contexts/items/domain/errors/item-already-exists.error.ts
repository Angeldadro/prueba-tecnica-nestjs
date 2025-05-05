export class ItemAlreadyExistsException extends Error {
  constructor(itemId: string) {
    super(`Item with ID "${itemId}" already exists.`);
    this.name = 'ItemAlreadyExistsException';
  }
}
