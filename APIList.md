API List:

AUTH ROUTER: 
/POST : signup
/POST : login
/POST : logout


PROFILE ROUTER:
/GET : /profile/view
/PATCH : /profile/edit
/PATCH : /profile/password


CONNECTION REQUEST ROUTER:
/POST : /request/send/interested/:userID
/POST : /request/send/ignored/:userID
/POST : /request/review/accepted/:requestID
/POST : /request/review/rejected/:requestID


USER ROUTER:
/GET : /user/connections
/GET : /user/requests/received
/GET : /user/feed

(status : ignored , interested , accepted , rejected)