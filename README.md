# Auth-Micro API
Auth-Micro API allows for easy integration of authentication services into applications. The process flow is simple: an adminUser plugs this auth service into their app by firstly registering an account; whereby a confirmation email will be sent to them. On confirmation, an API_KEY is given to them - this API_KEY will be signed with their unique ID which will be used to identify all requests to auth-microapi made from their app. Examples of requests made from their app to auth-microapi are registration and login of a new user on their app platform; these resgistration and login requests will be authorized and granted authentication if they are sent with the adminUser's API_KEY, thereby creating a guestUser on their app which is stored in the adminUser's database collection.
---
## Usage 
[Go to support website](auth.microapi.dev) 🎈

## Installation:
- Node v~12.16.0
- npm v~6.14.5
- Create MongoDB Cluster and get its URI
- Clone repo

## How to:
---
### ::start server, run in terminal:
- `cd auth-microapi`
- `npm install`
- `npm start`

### To Contribute:
Please always follow the right format in making pull request

* Fork this repository into your remote repository
* Clone the code from your remote repository into your local machine `git clone <url>`
* Create a branch with the feature name you wish to work on `git checkout -b <name_of_feature>`
* Add any changes
* Add tests with jest and make sure they pass `npm run test`
* Create an upstream on your local machine to pull the latest code from the develop branch of this repository `git remote add upstream develop` and `git pull upstream develop`
* Push to the remote branch which you forked `git add .` | `git commit -m "cool feature"` | `git push origin <name_of_feature>`
* Make a pull request to the develop branch of this repository
