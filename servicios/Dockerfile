FROM node:24-alpine
WORKDIR /app/servicios

COPY servicios/package.json servicios/package-lock.json ./
RUN npm ci

COPY servicios/ ./
COPY datos/ ../datos/

EXPOSE 3001 3002
CMD ["node", "libros.mjs"]