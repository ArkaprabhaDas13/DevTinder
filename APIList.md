API List:

AUTH ROUTER: 
/POST : signup      DONE
/POST : login       DONE
/POST : logout      DONE


PROFILE ROUTER:
/GET : /profile/view                DONE
/PATCH : /profile/edit              DONE
/PATCH : /profile/password                         // this is for Forget Password
(Validate and sanitize data in post/patch apis)

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



Homework:

keep the top 6 APIs ready before moving to the next episode