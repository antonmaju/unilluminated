The Unilluminated
=============

The Unilluminated is a simple 2d HTML5 game. You can try the demo page [here](http://www.unilluminated.com) . 

The user documentation is [here](http://antonmaju.github.io/unilluminated) .

## Requirements ##
- Mongo Db 2.2 or higher
- Node.js 0.8 or higher
- Browserify 
- Uglify js
- Redis (only if you choose redis to store session and/or socket.io state)
   
## Instructions ##
- Download the source code and navigate to src directory
- Open command line and type "npm install". You may need administrator permission.
- Creates a copy of _config.json and rename it to config.json. Edit its content based on your environment.
- Type "node app.js --port 8000" to run the server at port 8000. If port parameter is not supplied then it will use port 3000. 




