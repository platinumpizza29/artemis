# Specify the base image. Here, we're using the latest LTS (Long Term Support) version of Node.js.
FROM --platform=linux/arm64/v8 node:16

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available) to the container
COPY package*.json ./

# Install dependencies defined in package.json
RUN npm install

# If you're building your code for production, you can use:
# RUN npm ci --only=production

# Copy the rest of your application's source code from your host to your container
COPY . .

# Run Prisma generate to generate Prisma client
RUN npx prisma generate

# Your application binds to port 3000, so you'll use the EXPOSE instruction to have it mapped by the docker daemon
EXPOSE 3000

# Use an environment variable for the database URL
ENV DATABASE_URL="postgresql://casaos:casaos@192.1.168.2:5432/artemisdb?schema=public"

# Define the command to run your app using CMD which defines your runtime. Here we will use node server.js to start your server
CMD ["node", "app.js"]
