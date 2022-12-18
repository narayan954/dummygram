
Project uses Google's Firebase to store data and information.

For setting up database on your local machine follow below mentioned steps

- Go to [Firebase console](https://console.firebase.google.com/u/0/?utm_source=firebase.google.com&utm_medium=referral) start a new project
- On the home screen click on </> icon, create app follow the instructions.
- At last step you'll get API key for connection. 
- The API key will be in the format

`

const firebaseApp = firebase.initializeApp({

  apiKey: "",
  
  authDomain: "",
  
  projectId: "",
  
  storageBucket: "",
  
  messagingSenderId: "",
  
  appId: "",
  
  measurementId: "",
});
`

- Go to build-> Authentication, Keep sign-in method as email and password
 
- 
![Screenshot 2022-12-11 014039](https://user-images.githubusercontent.com/91470808/206876160-5bdd2718-2460-4d3a-9238-cd29ec25a9ea.png)
![Screenshot 2022-12-11 014148](https://user-images.githubusercontent.com/91470808/206876162-c44b93e1-8b68-46d2-98b7-97cf4ed90357.png)

- Now go to build->FireStore Database.
- Then click on **start in test mode** .If you fail to do so you won't be able to access your database remember to do this.
- Next go to build->Storage and follow the similar steps


Now your database is ready to configure into your app.


Copy this API key and go to your project files

- src->lib->firebase.js replace original key with your key
- **VOILA** you have database setup on your local machine
