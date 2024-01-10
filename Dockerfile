# syntax=docker/dockerfile:1

ARG NODE_VERSION=18.17.1

FROM node:${NODE_VERSION}-alpine

# Use production node environment by default.
ENV NODE_ENV production

WORKDIR /usr/src/app

# Install the dotenv package to handle environment variables.
RUN npm install dotenv

# Copy package files to leverage Docker caching.
COPY package*.json ./

# Install dependencies.
RUN npm ci --omit=dev

# Copy the rest of the source files into the image.
COPY . .

# Copy the .env file into the container.
COPY .env .

# Expose the port that the application listens on.
EXPOSE 3000

# Load environment variables using dotenv and run the application.
CMD node -r dotenv/config src/app.js
