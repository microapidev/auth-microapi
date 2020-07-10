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
- [x] Password recovery ("forgot password")
- [ ] Password reset ("update password")
- [x] Social authentication ("twitter, facebook, github, google")
- [x] Rate limiting ("lockout on unsuccessful login attempts")
- [ ] Persistent login ("remember me")

## Prerequisites:
- node v~12.16.0
- npm v~6.14.5
- MongoDB Atlas URI, Sendgrid APIKEY, Social Auth keys

## Setup:
- `cd auth-microapi`
- `cp sample.env .env`
- `add MongoDB URI, and Sengrid APIkey in .env`
- `npm install`
- `npm run dev`

## Test
Use Postman to test endpoints

## API
| Method | URI                                      | PARAMS                                  | HEADERS                                       | Services |
| :---   | :----                                    | :----:                                  | :----:                                        | :----           |
| POST   | api/auth/admin/register                  | email, username, password, phone_number | application/json                              | Register as new admin/service user|  
| POST   |  api/auth/admin/getkey                   |               email, password           |             application/json                  | Get APIkey for admin |
| POST   | api/auth/admin/reset-password            |       email                             |             application/json                  | Make request to reset admin password if forgotten |
| PATCH  | api/auth/admin/reset-password/:token     |      password, password_confirmation    | application/json                              | Reset admin password |
| POST   | api/auth/user/register                   | email, username, password, phone_number | application/json, Authorization: Bearer token | As an admin, register your user |
| GET    | api/auth/user/email-verification/:token  |               -                         | application/json, Authorization: Bearer token | Verify user email |
| GET    | api/auth/user/email-verification/resend  |                   -                     | application/json, Authorization: Bearer token | Resend email verification link for user | 
| POST   | api/auth/user/login                      | email, password                         | application/json, Authorization: Bearer token | Login user |
| POST   | api/auth/user/password/reset             | email                                   | application/json, Authorization: Bearer token | Request to reset password for user in case of forgotten password |
| PATCH  | api/auth/user/password/:token            | password, password_confirmation         | application/json, Authorization: Bearer token | Reset user password |
| GET    | api/auth/user/logout                     |                -                        |             Authorization: Bearer token       | Logout user |
| GET    | api/auth/facebook                        | ------                                  | Authorization: Bearer token                   | Register/Login with facebook |
| GET    | api/auth/twitter                         |  ------                                 | Authorization: Bearer token                   | Register/Login with twitter |
| GET    | api/auth/github                          |      ------                             | Authorization: Bearer token                   | Register/Login with github |
| GET    | api/auth/google                          |      ------                             | Authorization: Bearer token                   | Register/Login with google |

* *(get Authorization token from api/admin/auth/getkey)


## Contribution Guide:
Please always follow the right format before making pull request

* Fork this repository into your remote repository
* Clone the code from your remote repository into your local machine `git clone <url>`
* Create a branch with the feature name you wish to work on `git checkout -b <name_of_feature>`
* Add any changes
* Create an upstream on your local machine to pull the latest code from the develop branch of this repository `git remote add upstream develop` and `git pull upstream develop`
* Push to the remote branch which you forked `git add .` | `git commit -m "cool feature"` | `git push origin <name_of_feature>`
* Make a pull request to the develop branch of this repository
