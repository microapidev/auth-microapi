# Auth-Micro API
A microapi to allow easy integration of authentication into your service

## Usage 
[Go to support website](https://auth.microapi.dev) 🎈

## Contributions
https://docs.google.com/spreadsheets/d/1aNd-d2mQIOHOYnCLvG1wHn7pYS2XqHnmDSzABABQTBI/edit?usp=sharing

## Features
- [x] Login/logout/register + session expiry
- [x] Secure routing
- [x] Email verification
- [x] Password recovery
- [ ] Password reset
- [ ] Social authentication
- [ ] Rate limiting
- [ ] Persistent login

## Prerequisites:
- Node v~12.16.0
- npm v~6.14.5
- MongoDB Atlas URI
- Sendgrid APIKEY
- Clone repo

## Setup:
- `cd auth-microapi`
- `cp sample.env .env`
- `add MongoDB URI, and Sengrid APIkey in .env`
- `npm install`
- `npm run dev`

## Test
Use Postman to test endpoints

## API
| Method | URI                                      | PARAMS                                  | HEADERS                                       |
| :---   | :----                                    | :----:                                  | :----:                                        | 
| POST   | api/admin/auth/reigster                  | email, username, password, phone_number | application/json                              |
|     |   |                   -                     |             -                                 |
|     |  |                   -                     |             -                                 |
| POST   | api/admin/auth/getkey                    | email, password                         | application/json                              |
| *POST  | api/auth/register                        | email, username, password, phone_number | application/json, Authorization: Bearer token |
| POST   | api/auth/email/verification:token        |               -                         | application/json, Authorization: Bearer token |
| GET    | api/auth/email/resend/verification       |                   -                     | application/json, Authorization: Bearer token |
| *POST  | api/auth/login                           | email, password                         | application/json, Authorization: Bearer token |
| *GET   | api/auth/logout                          |                -                        |             Authorization: Bearer token       |
*(get Authorization token from api/admin/auth/getkey)

## Contribution Guide:
Please always follow the right format before making pull request

* Fork this repository into your remote repository
* Clone the code from your remote repository into your local machine `git clone <url>`
* Create a branch with the feature name you wish to work on `git checkout -b <name_of_feature>`
* Add any changes
* Create an upstream on your local machine to pull the latest code from the develop branch of this repository `git remote add upstream develop` and `git pull upstream develop`
* Push to the remote branch which you forked `git add .` | `git commit -m "cool feature"` | `git push origin <name_of_feature>`
* Make a pull request to the develop branch of this repository
