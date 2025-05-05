// La idea de la transaccion es que sea algo que se use en el dominio sin contaminar directamente, pero que en
// la infaestructura se castee como de prisma o si se usa otro orm pues otro.
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface Transaction {}
