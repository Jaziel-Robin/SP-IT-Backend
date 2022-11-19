# SP-IT-Backend
## Description
### E-Commerce Backend API Using Express
## Set-Up
1.  Modify <b>databaseConfig.js</b> (port number, MySQL account username and password) and <b>config.js</b> (secret key)
2.	Open command prompt and ```cd``` into directory of folder
3.	Run ```npm install``` to install Nodemon, Express, MySQL, body-parser and Multer
4.	Create new schema called 'sp_it_api' in MySQL Workbench
5.  Double click schema and select <em>Open SQL Script In New Query Tab</em>
6.	Navigate to SQL folder. Open all SQL files in MySQL Workbench
7.	Execute files in this order: ```user``` --> ```category``` --> ```product``` --> ```review``` --> ```interest``` --> ```discount``` 
8.  Right click schema and select <em>Refresh All</em>
##  Run Server
1.  Open command prompt and ```cd``` into directory of folder
2.	Start server with ```nodemon server.js```
