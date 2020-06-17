# auth-microapi
This is the microapi which is used to for authentication of users to access other microapis.


[![Build Status](https://travis-ci.org/hngi/fury-backend-auth.svg?branch=develop)](https://travis-ci.org/hngi/fury-backend-auth) [![Coverage Status](https://coveralls.io/repos/github/hngi/fury-backend-auth/badge.svg?branch=develop)](https://coveralls.io/github/hngi/fury-backend-auth?branch=develop)

## Getting Started


=======
Follow the right process when creating a Pull request (by Esi)
# fury-backend-auth

Auth-Micro API
     A backend project by HNG Interns in stage 3, however it is a stage two project that was 
rolled over due to incompletion. 


Since API is a profound entity with an external resource that has the capability of accepting and responding to protected resource requests by users and clients, they must be equipped to ensure that applications and clients trying to access data are authentic, so that they can proceed to authorized full access when identity is confirmed. The processes of certifying the identity of users trying to access resources on the server and this is what is known as API authentication. And, before we delve deeper into this topic, let’s differentiate between authentication and authorization.

Authentication is when an entity verifies the identity of a user. In other words, it proves that the clients trying to access a remote server are really who they say they are.

On the other hand, authorization is the next thing that happens after successful authentication. It is the approval that a certain client has the right to make a request. Simply, authorization is when an entity verifies that you have the right to access data or information on a given server.
However, as we scour through this topic of API authentication, it’s crucial to understand that we’re discussing a system that only proves identity (API Authentication).

One very common example is the Oauth Authentication;
OAuth Authentication
Technically, Oauth is a technique that does both authentication and authorization. It is a form of API authentication that gives applications with the ability to communicate with API server to provide access. When a user logs into the system, it requests authentication in the form of a token. The client is required to forward the request to an authentication server, which either allows or rejects this it. OAuth authentication is fundamentally a more secure and powerful system than the rests, and it’s quickly becoming the number one choice for many clients and applications.


### To Contribute:
Please always follow the right format in making pull request

* Clone the code to your Local
* Create a branch with the feature name you wish to work on
* Add any changes
* Make a pull request to develop branch


