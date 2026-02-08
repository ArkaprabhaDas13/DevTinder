START the server: npm run start/dev

What are dependencies

What is the use of "-g" while npm install

Difference between caret and tilde ( ^ vs ~ )

initialize git


//----------------------------------------------//

*Routes:*

## Auth
POST /signup
POST /login
POST /logout

## Profile
GET /profile/view
PATCH /profile/edit
PATCH /profile/password

## Connection Req
POST /request/send/:status/:id (interested/ignored)
POST /request/review/:status/:requestId (accepted/rejected)

## User Router
GET /connections
GET /requests/received
GET /feed           ***  (explored SET , $nin, $ne query operators)

//----------------------------------------------//

`PAGINATION:`
    /feed?page=1&limit=10 (return the first 10 users)
    For this we use `.skip(10)` and `.limit(10)`
    `.skip()` means how many data we are leaving out at the beginning



