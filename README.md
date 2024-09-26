# chip-in

## Description
Insert description here
View live app at [chipin.vercel.app](https://chipin.vercel.app/)

## Set up

### Server
Starting in root directory:
```
cd server/
```

Install dependencies
```
npm i
```

Set up .env file
```
touch config.env
```

Log in to the chip-in project on Vercel, navigate to Settings -> Environment Variables. Copy and paste the **mongoDB connection string (MONGO_DB_URI)** and **port number (PORT)** into config.env.

Should look something like this:
```
    PORT=6969
    MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.<projectId>.mongodb.net/?retryWrites=true&w=majority&appName=<appName>
```

Replace < username >, < password >, < cluster >, < projectId >, < appName > with your own.

### Client
Mostly same as server, slight differences. 

Starting in root directory:
```
cd client/
```

Install dependencies
```
npm i
```

Set up .env file
```
touch .env
```

Log in to the chip-in project on Vercel, navigate to Settings -> Environment Variables. Copy and paste the **react port number (REACT_APP_PORT)** into .env.

Should look something like this:
```
    REACT_APP_PORT=6969
```

This will connect your frontend to the local dev server if you have it running. If you want to connect to the most recently deployed server, add the **server url (REACT_APP_SERVER_URL)** to .env.

Should look something like this:
```
    REACT_APP_PORT=6969
    REACT_APP_SERVER_URL=https://chip-in-backend.onrender.com
```

## To run dev environment

### Server
```
cd server/
npm start
```

### Client
Open up another terminal window:
```
cd client/
npm run dev
```

## Workflow

### Make a new branch
```
git checkout -b <your-name>/<feature-name>
```
For example:
```
git checkout -b lettuce/burn-down-the-house
```

If you need to switch between branches:
```
git checkout <branch-name>
```

### Periodically pull from main on your branch 
```
git fetch origin main
git pull origin main
```
Resolve merge conflicts if necessary, then push changes to your branch
```
git push origin <branch-name>
```

### Before commiting 
```
npm run build
```
Fix any build errors