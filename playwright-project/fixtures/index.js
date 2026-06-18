const { test: base } = require('@playwright/test');
const { LoginPage }   = require('../pages/LoginPage');
const { InterviewPage }  = require('../pages/InterviewPage');
const { ChatbotPage } = require('../pages/ChatbotPage');
const { PronunciationPage } = require('../pages/PronunciationPage');
const { HomePage }    = require('../pages/HomePage');
const { AuthPage }    = require('../pages/AuthPage');
const { TrailPage }   = require('../pages/TrailPage');
const { RankingPage } = require('../pages/RankingPage');
const { QuizPage }    = require('../pages/QuizPage');

const test = base.extend({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  interviewPage: async ({ page }, use) => {
    await use(new InterviewPage(page));
  },

  chatbotPage: async ({ page }, use) => {
    await use(new ChatbotPage(page));
  },

  pronunciationPage: async ({ page }, use) => {
    await use(new PronunciationPage(page));
  },

  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },

  authPage: async ({ page }, use) => {
    await use(new AuthPage(page));
  },

  trailPage: async ({ page }, use) => {
    await use(new TrailPage(page));
  },

  rankingPage: async ({ page }, use) => {
    await use(new RankingPage(page));
  },

  quizPage: async ({ page }, use) => {
    await use(new QuizPage(page));
  },
});

const { expect } = require('@playwright/test');

module.exports = { test, expect };
