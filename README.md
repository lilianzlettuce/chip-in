# chip-in

## Description
Insert description here

## Set up
Starting in root directory:

Install dependencies
`npm i`

Set up .env file
```
cd server/
```
```
mkdir config.env
```

Copy and paste mongoDB connection string and port number into the file, should look something like the following: 

```
    ATLAS_URI=mongodb+srv://<username>:<password>@<cluster>.<projectId>.mongodb.net/?retryWrites=true&w=majority&appName=<appName>
    PORT=6969
```

Replace < username >, < password >, < cluster >, < projectId >, < appName > with your own.

## To run dev environment
Starting in root directory:
```
cd server/
node --env-file=config.env server.js
```

Open up another terminal window:
```
cd client/
npm run dev
```