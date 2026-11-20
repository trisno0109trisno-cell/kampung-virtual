FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev || npm install --omit=dev

COPY . .

# Hugging Face Spaces menjalankan container sebagai UID 1000 (non-root)
RUN chown -R 1000:1000 /app

USER 1000

ENV NODE_ENV=production
ENV PORT=7860
ENV ADMIN_PIN=1234

EXPOSE 7860

CMD ["npm", "start"]
