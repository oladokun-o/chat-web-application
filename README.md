# chat-web-application
Chat web application where two or more users can chat with each other in a group.

## <a href="https://chat-web--app.herokuapp.com/">DEMO</a>

Users can create, join and chat in groups
Chat features:
Text format options
preview of web links
file upload

## Installation

Clone repository into a newly created folder

```
git clone https://github.com/honcho-man/chat-web-application

```
Run the command to install required packages
 
```
npm install 

```

## Deploy & Run

If mongodb is available locally, create a new database with any name, then create a new .env file in the root directory of the application folder and add the following environment details:
    
    PORT=3500 or any port numer
    MONGODB_URI_DEV=mongodb://localhost:27017/database-name goes here!

Then edit the index.js file in the config folder and set application mode to development (i.e `return config[env] || config.development`)

Or if mongodb is not available locally, a cluster has been provided, create a new .env file with the following environment details

    PORT=3500 or any port numer
    MONGODB_URI=mongodb+srv://users:iamawesome!@pro-finders.kv9fa.mongodb.net/chat-app?retryWrites=true&w=majority

Then edit the index.js file in the config folder and set application mode to production (i.e `return config[env] || config.production`)

run the command to start the server:
```
$ npm start

```
open the link in your browser:

http://localhost:3500 or any port number that must be the same as the one in the .env file

## Usage 

Special codes are required to join a group chat

Create a group by entering any desired group name and your personal name

After entering you can open another tab to join in using the same code as another user or share the code for any other user to join the group chat (group codes can also be found and copied by clicking in the three dotted button in the top right corner of the group chat)

Users can now chat with other in different groups

## License

MIT © [Oladokun]
