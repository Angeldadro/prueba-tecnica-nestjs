FROM node:lts-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npx prisma generate

RUN npm run build

FROM node:lts-alpine as runner

WORKDIR /app

COPY --from=builder /app/package*.json ./

RUN npm install --production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma


EXPOSE 3000

CMD [ "node", "dist/main.js" ]

