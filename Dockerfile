FROM node:18.13.0-alpine3.16

COPY package*.json ./

RUN npm install
# Copy the rest of the app's source code
COPY . .

# Expose the ports the app and the database will run on
EXPOSE 3000

# Run the app
CMD ["npm", "run", "dev"]