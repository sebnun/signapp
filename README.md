## An experiment showing a way to validate emails in signup forms.

This signup form will prevent a user from typing a wrong e-mail (e-mail with a typo). 
For example, “user@gnail.com” is a typo, user probably meant “user@gmail.com”. 
In “abcgmail.com” user probably meant “abc@gmail.com”.

So, this user interface will:
* Visually indicate if user is trying to use wrong email
* Prevent user from clicking “Submit” button with wrong email
* Provide a “good user experience”, solving a problem of typing incorrect email

[Live demo!](https://sebnun.github.io/signapp/)

### Run locally

You will need Node and Git installed beforehand, these instructions are tested on macOS, but they should work on other systems with minor modifications.

1. run in your terminal `git clone https://github.com/sebnun/signapp.git`
2. then `cd signapp`
3. install dependencies with `npm install` and wait a while .. 
4. then `npm start`

You should see a tab with the app running.

Protip: If you want to test the app from a mobile device that is connected to your local network, use the url "On Your Network" shown in the terminal from your mobile device.

### Run Tests

There are 2 types of tests included: a React unit test, and 2 end-to-end tests.
To run them:

 1. keep the local server running and open a new terminal
 2. run `npm run test`
 3. type `a`
 4. quit the test runner typing `q`
 5. modify the json file signapp/src/tests/inputData.json, go to step 2 
