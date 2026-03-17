import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/home.page.js';
import { LoginPage } from '../pages/login.page.js';
import { ColumnRightPage } from '../pages/columnRight.page.js';

let validEmail = "kedata60195@gmail.com";
let validPass = "kedata60195@gmail.com";
let invalidPass = "sdafasdfs";
test.use({ ignoreHTTPSErrors: true });
test('login', async ({ page }) => {
  const homePage = new HomePage(page);
  const loginPage = new LoginPage(page);
  const columnRightPage = new ColumnRightPage(page);

  await homePage.open();
  await homePage.gotoLogin();

  await loginPage.login(validEmail, validPass)

  // asertas išskirtinis: gaunam info is page object, ir aserta (expect) darom teste
  await expect(columnRightPage.logoutLink).toBeVisible();
});

test('login - negative', async ({ page }) => {
  const homePage = new HomePage(page);
  const loginPage = new LoginPage(page);
  const expectedNoMatchForEmailError = "Warning: No match for E-Mail Address and/or Password.";

  await homePage.open();
  await homePage.gotoLogin();

  await loginPage.login(validEmail, invalidPass)

  // Tikrinu tik teksta
  await expect(page.getByText(expectedNoMatchForEmailError)).toBeVisible();
  // Tikrinu tik kad yra klase .alert-danger
  await expect(loginPage.noMatchForEmailError).toBeVisible();
  // Tikrinu ir klase ir teksta
  await expect(loginPage.noMatchForEmailError).toContainText(expectedNoMatchForEmailError);
// Pakanka vieno, rodau skirtingus variantus
});