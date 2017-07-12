const Nightmare = require('nightmare');

let inputData;
let browser;

beforeAll(() => {
    inputData = require('./inputData.json');
});

beforeEach(() => {
    browser = Nightmare({ show: true }); //false to run as a headless browser
});

afterEach(async () => {
    await browser.end();
});

//these tests are not exhaustive, they're meant as a general starting point

test('signup button state is correct typing email first, password second', async () => {
    const isSignupDisabled = await browser.goto('http://localhost:3000/')
        .type('input[id="emailinput"]', inputData.emailInput)
        .type('input[id="passwordinput"]', inputData.passwordInput)
        .evaluate(() => document.querySelector('input[type="submit"]').disabled);

    expect(isSignupDisabled).toBe(inputData.signupShouldBeDisabled);
});

test('signup button state is correct typing password first, email second', async () => {
    const isSignupDisabled = await browser.goto('http://localhost:3000/')
        .type('input[id="passwordinput"]', inputData.passwordInput)
        .type('input[id="emailinput"]', inputData.emailInput)
        .evaluate(() => document.querySelector('input[type="submit"]').disabled);

    expect(isSignupDisabled).toBe(inputData.signupShouldBeDisabled);
});