FROM node:20-alpine AS builder
WORKDIR /app
RUN apk add --no-cache openssl libaio
COPY package*.json ./
RUN npm ci --legacy-peer-deps
COPY . .
RUN npm run build
RUN npx prisma generate

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
RUN apk add --no-cache openssl libaio libnsl libc6-compat wget unzip && \
  wget -q https://download.oracle.com/otn_software/linux/instantclient/2112000/instantclient-basic-linux.x64-21.12.0.0.0dbru.zip -O /tmp/ic.zip && \
  unzip /tmp/ic.zip -d /opt/oracle && \
  rm /tmp/ic.zip && \
  ln -s /opt/oracle/instantclient_21_12 /opt/oracle/instantclient && \
  sh -c "ln -s /lib/libresolv.so.2 /usr/lib/libresolv.so.2 || true"

ENV LD_LIBRARY_PATH=/opt/oracle/instantclient
ENV PATH=$PATH:/opt/oracle/instantclient

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src/modules/integrador-dms-nbs/sql ./src/modules/integrador-dms-nbs/sql

EXPOSE 3000
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/main.js"]