# ---- Stage 1: Build React App ----
FROM node:22-alpine AS build

WORKDIR /app
COPY package*.json ./

RUN npm ci
COPY . .

# Accept Render env vars as build args
ARG REACT_APP_API_BASE
ENV REACT_APP_API_BASE=$REACT_APP_API_BASE

RUN npm run build

# ---- Stage 2: Serve with Nginx ----
FROM nginx:1.27-alpine

# Copy built React files from build stage
COPY --from=build /app/dist /usr/share/nginx/html


# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
