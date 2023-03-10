# SyncChimp v1.0.0

<p align="center">
  
  <img src="SyncChimpLogo.png" width="500" height="400">
  
</p>
<p align="center"><i>This image was generated with Dall-e 2 AI</i></p>

<br><br><br>

SyncChimp syncs contacts from MockAPI to Mailchimp. It retrieves contact data from MockAPI and creates new members in a new Mailchimp list. Keep your email lists updated in real-time with SyncChimp.


# Architecture:

This architecture provides a separation of concerns, making the application more modular and maintainable. In this project, this architecture is being used to create a backend system that processes requests from a user and interacts with the database to return a response.

* The presentation layer (api/):
Is responsible for containing the logic for receiving and processing API requests, passing them to the controller layer, and returning responses back to the user. It's the interface between the user and the system.

* The application layer (services/):
Contains the application logic that processes the integration requests. It communicates with the data layer to perform CRUD operations on the Mailchimp API. It's responsible for implementing business rules and orchestrating the data retrieval and data processing.

* The controller layer (controller/): Contains the controller that handle HTTP requests and responses. In this project, the syncController.js file is responsible for handling the request to sync contacts from MockAPI to Mailchimp.

* The routes layer (routes/): Contains the routes that define the API endpoints and their corresponding controllers. In this project, the routes.js file defines the /api/v1/contacts/sync endpoint and maps it to the syncController.js controller.

* The testing layer (tests/): Contains the files needed for automated testing of the application. It includes tests of the application layer and the controller layer.


# Rest of the structure explanation:

### .gitignore: 
File that specifies the files and directories to be ignored by Git.

### README.md: 
File containing the project documentation.

### package.json: 
NPM configuration file that specifies the dependencies and scripts of the project.

### Dockerfile: 
The Dockerfile specifies how to build the Docker image for the application in this project. It defines the environment and dependencies needed to run the application, and packages them into a container that can be easily deployed and run in different environments.

### The index.js:
Is file is entry point of the application that starts the local server, specifies API routes, and set the CORS, Helmet and Winston configuration.

### jest.config.js:
Configuration file for Jest, the testing framework used in this project. It is also configured with Babel to work with the project's codebase.

### .babelrc:
This configuration file is used to transpile modern JavaScript code to be compatible with older environments, allowing  the code to use new language features while ensuring that their code will run on a wide range of platforms. In this project, Babel is configured to transpile the code for the test files to ensure compatibility with the testing environment set up by Jest.

### .dockerignore:
File specifies the files and directories to be ignored when building the Docker image for the application, making the image smaller and faster to build.


# Requirements:

* [NodeJS](https://nodejs.org/en/download "NodeJS")
* [Docker](https://docs.docker.com/engine/install/ubuntu/)
* [Javascript](https://www.npmjs.com/package/javascript)

# Dependencies description in this project

* Jest: A testing library for JavaScript code. It will be used to write unit and integration tests to ensure the quality and correctness of the code in this project.

* Morgan: 
A middleware that logs HTTP requests and responses for Node.js. It will be used to log incoming requests and responses in the server's console for debugging and monitoring purposes.

* Nodemon: 
A tool that watches for file changes and automatically restarts the Node.js server. It will be used to speed up development by automatically restarting the server when code changes are made.

* Standard: 
A JavaScript linter that helps to enforce consistent style and good practices in the code. It will be used to ensure that the code in this project adheres to the Standard style and best practices.

* Winston: 
A versatile logging library for Node.js. It will be used to log server events and errors to different transports (such as console, file, or third-party services) for debugging and monitoring purposes.

* Cors: 
A middleware that enables Cross-Origin Resource Sharing (CORS) in the server. It will be used to allow requests from different domains or origins to access the API endpoints in this project.

* Express: 
A minimalist web framework for Node.js. It will be used to create the API endpoints, handle incoming requests, and send responses.

* Helmet: 
A middleware that provides security features for Express. It will be used to add headers and prevent common web vulnerabilities, such as XSS and CSRF.

* babel/cli:
A command-line interface for using Babel, a tool for transpiling JavaScript code to improve cross-platform compatibility. It will be used to compile the code from ES6+ to ES5, allowing it to run on older versions of Node.js.

* babel/core:
The core of the Babel compiler, which transpiles JavaScript code. It will be used to transpile the code in this project.

* babel/preset-env:
A Babel preset that automatically determines the Babel plugins needed based on the targeted environment. It will be used to configure Babel for this project.

* dotenv: A zero-dependency module that loads environment variables from a .env file into process.env. It will be used to store sensitive information like API keys and database credentials.

* mailchimp/mailchimp_marketing: The official Node.js client library for the Mailchimp API. It will be used to interact with the Mailchimp API and create new contacts.

* axios: A promise-based HTTP client for Node.js and the browser. It will be used to make HTTP requests to external APIs.

* uuidv4: A library for generating random UUIDs. It will be used to create unique IDs for new contacts.

* winston-daily-rotate-file: A transport for the Winston logging library that rotates log files based on a customizable schedule. It will be used to store logs in a rotating file and prevent the log file from growing too large.

## Before start, to use the project locally install npm:

You have to use the following command to start a development server:

```sh
npm install
```

## To run development mode:

You have to use the following command to start a development server:

```sh
npm run dev
```


To run the code in production mode locally:

```sh
npm start
```

Trigger the endpoint GET contacts/sync on local server:

```sh
http://localhost:3000/api/v1/contacts/sync
```

* *This will create a synchronization with the backend and will fetch the mock api contact list and will format to a JSON structure in local mode.*

See `package.json` for more details.

To test the production ready code hosted in Railway:

```sh
https://syncchimp-production.up.railway.app/api/v1/contacts/sync
```
* *This will trigger a GET petition to the server and will initiate a syncronization between the Trio Mock API and Mailchimp API. You will receive a list of all the contacts recently synced and created. And this will show you their names.*

* *Make sure you have the api parser installed, and in case you dont, download:
https://chrome.google.com/webstore/detail/json-formatter-viewer-and/infnlhnhibphpaljmnnadaldibggkokb*

# Tests:

Following tests libraries are used for unit/integration tests:
* [Jest](https://www.npmjs.com/package/jest)


Tests are kept next to source with following pattern *.test.js

Use following command to run tests:

```sh
npm test
```


## Docker:


* To create de Docker image:

```sh
docker build -t syncchimp .
```

This will create our docker image.

* Run the container

```sh
docker run -p 3000:3000 syncchimp
```

See `Dockerfile` and for more details.

Google docs documentation:

