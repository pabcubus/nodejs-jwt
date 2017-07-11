# NodeJS JWT Sample
This is the for a sample code on JWT using NodeJS on an API.

This project requires
- [Node.js (primarily NPM)](https://nodejs.org/) v4+ to run. Before running the project, you'll need to prepare the project for:
- PostgresSQL

And also inside, this project uses:
- Express
- JWT
- Lodash

## Installation
First you have to install [PostgreSQL](https://www.postgresql.org/) in case that you don't have it in your local machine.

Then, once installed, create a new DB called `nodejstest`. Then enter to that database and run from the SQL window the content of an SQL file called `dbbackup.sql`, which contains the Database Backup for this to run.

On the `config/db.properties` are the DB configuration params like username and password for you to put in.

Once the database is configured, installed and ready to use, run these commands from your Terminal or CMD:
```sh
$ cd /local/folder/to/your/project
$ npm run prepare-mac (or prepare-win)
```

After running the previous steps, to run the project simply do `npm start` or 'nodemon run-serve.js' from the Terminal or CMD, and then on your browser go to `http://localhost:3210/`.

## Endpoints
```bash
http://localhost:3210/api/person/register (POST)
```
This endpoint registers the user. On the body of the request you have to send an object like `{username: 'foo', username: 'bar'}`. It'll return OK if it was created and 500 if there was an error.

```bash
http://localhost:3210/api/person/login (POST)
```
This endpoint returns the info of the token that the user can use across all requests. On the body of the request you have to send an object like `{username: 'foo', username: 'bar'}`.

```bash
http://localhost:3210/api/person/profile?token=<token_string> (GET)
```
This endpoint returns the profile info of the user by passing the token on the URL

```bash
http://localhost:3210/api/person/logout (POST)
```
This endpoint logs the user our by giving an object like `{token: 'token_of_user'}`. This will blacklist the token for this user and it will have to be logged in again.
