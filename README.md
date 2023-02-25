# SyncChimp

<p align="center">
  
  <img src="SyncChimpLogo.png" width="500" height="300">
  
</p>
<p align="center"><i>This image was generated with Dall-e 2 AI</i></p>

<br><br><br>

SyncChimp syncs contacts from MockAPI to Mailchimp. It retrieves contact data from MockAPI and creates new members in a new Mailchimp list. Keep your email lists updated in real-time with SyncChimp.



# Structure tree:



├── src

│   ├── api

│   │   ├── controllers/

│   │   │   └── syncController.ts

│   │   ├── routes/

│   │   │   ├── api/

│   │   │   │   ├── v1/

│   │   │   │   │   └── routes.ts

│   │   ├── services/

│   │   │   └── syncService.ts

│   ├── database/

│   │   └── config.ts

│   ├── docker/

│   │   ├── db/

│   │   │   └── Dockerfile
 
│   │   ├── api/

│   │   │   └── Dockerfile 

│   │   ├── docker-compose.yml

│   ├── tests/

│   │   ├── api/

│   │   │   └── sync.test.ts

│   │   ├── database/

│   │   │   └── config.test.ts

├── .dockerignore

├── .gitignore

├── Dockerfile

├── index.ts

├── LICENSE

├── package.json

├── README.md

└── tsconfig.json

