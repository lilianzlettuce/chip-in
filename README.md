# ChipIn

<div align="center">
  <img src="https://github.com/user-attachments/assets/d0c325c8-155a-4bfc-bed6-cffc2ea33ce8" alt="chipinlogo" width="300"/>
</div>

## Description
Managing a household with multiple roommates presents various challenges, with one of the most pressing being the need for an accurate inventory of shared items. From personal and shared groceries to cleaning and pet supplies, keeping track of what needs to be purchased, replaced, or discarded helps prevent unnecessary spending and reduces the frequency of trips to the store. In addition to inventory management, tracking who owes whom can be a complex and time-consuming task. Unlike traditional financial management tools like Splitwise or shared grocery list apps such as AnyList, ChipIn is a web application designed to not only track expenses but also provide valuable insights into the actual shared products within a household. By streamlining both cost-sharing and inventory management, ChipIn offers a more comprehensive solution for managing household dynamics. Developed for the CS307: Software Engineering I course, ChipIn addresses these everyday challenges with a user-friendly interface and efficient features.

View the live app at [chipin.vercel.app](https://chipin.vercel.app/)

## Features

1. **Household Management:**  
   Users can create new households and invite others to join, enabling collaborative management of shared items, expenses, and household responsibilities.

   <img width="1386" height="857" alt="image" src="https://github.com/user-attachments/assets/97726ee3-e092-449a-99e1-5d1413326c6d" />
   

3. **Household Dashboard:**  
   The household dashboard features filterable and searchable sections for managing shared grocery and inventory lists, each populated with item cards. These cards display key details such as price, expiration date, and category. The "shared by" list shows which users share each item, and hovering over their usernames reveals how much each person contributed. Users can easily add or delete items from both lists, move items between them, or add items back to the grocery list from inventory. The dashboard also includes a corkboard where users can post announcements visible to all household members.

   <img width="1383" height="856" alt="image" src="https://github.com/user-attachments/assets/20ff25a6-a03b-4af0-882b-57693a29e395" />

     
   <img width="550" height="678" alt="image" src="https://github.com/user-attachments/assets/8c34424a-52cb-46c9-a17d-e4eb86bb0b57" />
   

5. **My Expenses Page:**  
   The expense page tracks debts owed between housemates, with an individual expense card for each member. The amounts on these cards are automatically updated after purchases, returns, or payments, and the system balances the debts, ensuring that only one final transaction is required to settle all amounts.

   <img width="1296" height="856" alt="image" src="https://github.com/user-attachments/assets/62dbb1c6-ea78-47b5-8d5d-5f8162552e58" />


6. **AI-Generated Meal Suggestions:**  
   Users can generate AI-suggested meal ideas based on the ingredients they own and additional ingredients they can choose to add. Users can save their favorite recipes to the Recipes page, making meal planning more efficient and personalized.

   <img width="1386" height="858" alt="image" src="https://github.com/user-attachments/assets/eab776b0-8ad2-41a9-94cc-64521252a05e" />


8. **Notifications:**  
   ChipIn notifies users when items are nearing their expiration date, with the option to export these dates as reminders to external calendar apps for better tracking. Users also receive notifications for payments made and can send "Nudges" to other housemates to request payments.

   <img width="437" height="773" alt="image" src="https://github.com/user-attachments/assets/2b32c45f-a958-4e16-9174-4ddbe3d6b7b6" />


9. **User & Household Statistics:**  
   Users can view statistics, such as the top-purchased items and purchase history, for both individual users and the entire household. This feature allows for better tracking of spending and shared item usage.

   <img width="550" height="809" alt="image" src="https://github.com/user-attachments/assets/7991d61c-ef72-4a47-a6c1-b1807f19c467" />

## Design Outline
The ChipIn platform has a client-side interface built with React, which allows users to manage grocery items and costs, sending and receiving data to update the interface. The servers use Node.js/Flask to handle client requests, communicate with the database, and interface with external APIs and the GPT model. The database is managed with MongoDB, storing collections such as households, items, and users, while verifying and executing queries based on server requests to update data.

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

Log in to the chip-in project on Vercel, navigate to Settings -> Environment Variables. Copy and paste the **mongoDB connection string (MONGODB_URI)** and **port number (PORT)** into config.env.

NB: Make sure to specify the database name ('chipin') in the URI.

Should look something like this:
```
    PORT=6969
    MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.<projectId>.mongodb.net/chipin?retryWrites=true&w=majority&appName=<appName>
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
### Flask Server
NB: Make sure your python/pip versions are more fairly recent (> 3.8)

If Rust is not installed (check by running 'rustc' in terminal, if output is empty then it isn't), run the following to install a Rust compiler (needed for transformers library):
```
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```
Create a python virtual environment: 
```
cd recipes-server/
python -m venv env
```
Activate the envrionemnt:
```
source env/bin/activate
```
Install packages:
```
pip install -r requirements.txt
```
Run server:
```
python app.py
```
Add to server/config.env so Express server can make requests:
```
FLASK_PORT=4200
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
