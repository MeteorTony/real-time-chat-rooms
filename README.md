# Real Time Chat Rooms

A real time chat appplication with room support, created from socket.io and node.js.

## Installation

To run this page on your local machine, the required dependencies should be installed using following commands.

First command:

```
npm i express ejs socket.io
```

Second command:

```
npm i --save-dev nodemon
```
Make sure this is added to package.json (inside "scripts"):

```
"devStart": "nodemon server.js"
```

Then use this to run the web server:

```
npm run devStart
```
Go to http://localhost:3000 run the page locally on browser.

## Demonstration
Here is an example:

Home page:

<img src="https://user-images.githubusercontent.com/61377153/150095762-d4d74dbd-d828-4c05-8390-d1588782acee.png" alt="demo1" width="400px" />

View from the client who has already created a room (e.g. waiting room):

<img src="https://user-images.githubusercontent.com/61377153/150095771-b0f7e661-9bf1-441f-9205-91c9c68a3548.png" alt="demo2" width="800px" />

View from the client who entered a created room (e.g. waiting room):

<img src="https://user-images.githubusercontent.com/61377153/150095777-addf1cc8-02c6-49b3-933d-b7bc53ee3624.png" alt="demo3" width="800px" />
