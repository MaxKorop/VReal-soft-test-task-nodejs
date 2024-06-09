# Management API

## Deployment

The project is deployed on the [render.com] (https://render.com) service. [Deployed Project URL](https://vreal-soft-test-task-nodejs.onrender.com/api/docs)

<small>This is a free instance, and free instances terminate after periods of inactivity, so initial requests may take a long time to process.</small>

## Local launch

To run the project locally, you need to:

### Installation

In the project folder, run the following command

```bash
$ npm install
```

### Configuration

You need to create an `.env` file in the project folder. This project uses MongoDB as the database, so you need to start and connect to the mongodb server.

In the `.env` file, you need to create a `CONNECTION_STRING` variable and set your database connection string as the value of this variable. Its value should look like this
```.env
CONNECTION_STRING = '<YOUR_CONNECTION_STRING>'
```

After that you need to set the JWT secret key in this file in `JWT_SECRET_KEY` variable.

So the final `.env` file should look like this:
```environment
CONNECTION_STRING = '<YOUR_CONNECTION_STRING>'
JWT_SECRET_KEY = '<YOUR_JWT_SECRET_KEY>'
```

### Run

You can run this project after the previous steps with the following command:
```bash
$ npm run start
```