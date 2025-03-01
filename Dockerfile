ARG NODE_VERSION=22.14.0

FROM node:${NODE_VERSION}-alpine AS base

WORKDIR /usr/src/app

# Stage 1: Install dependencies
FROM base AS deps
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm install -g @angular/cli && \
    npm ci --omit=dev

FROM base AS build
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm install -g @angular/cli && \
    npm ci
COPY . .
RUN npm install -g @angular/cli
RUN npm run build

FROM base AS production
ENV NODE_ENV production

USER node

COPY package.json .
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
EXPOSE 4200

CMD ["npm", "start"]