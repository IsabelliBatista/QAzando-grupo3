const { test: base } = require('@playwright/test');
const { LoginPage }  = require('../pages/LoginPage');
const { HomePage }   = require('../pages/HomePage');
const { AuthPage }   = require('../pages/AuthPage');

const test = base.extend({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },

  authPage: async ({ page }, use) => {
    await use(new AuthPage(page));
  },
});

const { expect } = require('@playwright/test');

module.exports = { test, expect };
