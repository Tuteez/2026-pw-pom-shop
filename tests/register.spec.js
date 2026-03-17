import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/home.page.js';
import { RegisterPage } from '../pages/register.page.js';
import { YourAccountHasBeenCreatedPage } from '../pages/yourAccountHasBeenCreated.page.js';
import { ColumnRightPage } from '../pages/columnRight.page.js';

test.use({ ignoreHTTPSErrors: true });
test('register', async ({ page }) => {
  const homePage = new HomePage(page);
  const registerPage = new RegisterPage(page);
  const columnRightPage = new ColumnRightPage(page);
  const yourAccountHasBeenCreatedPage = new YourAccountHasBeenCreatedPage(page);
  let randomEmail = `automation-test${Date.now()}@test.lt`;
  let pass = "dsfasdfasdf";

  await homePage.open();
  await homePage.gotoRegister();

  await registerPage.fillFirstname("Fname");
  await registerPage.fillLastname("Last name");
  await registerPage.fillEmail(randomEmail);
  await registerPage.fillPhone("312456");
  await registerPage.fillPassword(pass);
  await registerPage.fillPasswordConfirm(pass);
  await registerPage.checkSubscribeYes();
  await registerPage.agreeToPrivacyPolicy();
  await registerPage.clickContinue();

  await expect(yourAccountHasBeenCreatedPage.content)
    .toContainText('Your new account has been successfully created!');

  await expect(columnRightPage.logoutLink).toBeVisible();
});
// register.spec.js -> todo: add negative test:
test('register - negative - password confirmation matching', async ({ page }) => {
  const homePage = new HomePage(page);
  const registerPage = new RegisterPage(page);

  await homePage.open();
  await homePage.gotoRegister();

  await registerPage.fillPasswordConfirm("aaaa");
  await registerPage.fillPassword("bbbb");
  await registerPage.clickContinue();

  // Password Confirm is red
  // V1 tikrint kad turi klase has-error (reikes parento)
  // V1.1 old style xpath
  await expect(registerPage.passwordConfirmFormGroupItem).toBeVisible();
  // V1.2 playwright style
  await expect(registerPage.passwordConfirmFormGroupItemV2).toBeVisible();
// V1.3 jei reiktu daug tokiu forn group item
  const passwordConfirmFormItemLabel = await registerPage.getFormItemLabel(registerPage.passwordConfirmInput);
  await expect(passwordConfirmFormItemLabel).toBeVisible();

  // v2 tikrinti kad realiai naudojama spalva #010000
// await expect(passwordConfirmFormItemLabelColor).


  //  Password confirmation does not match password! is red
  // v1 turi klase text-danger. Sukurt helperi analogiska getFormGroupItem
const passwordConfirmErrorMessage = await registerPage.getErrorMessage(registerPage.passwordConfirmInput);
await expect(passwordConfirmErrorMessage).toBeVisible();
  // V2 tikrint realiai spalva #a94442
await expect(passwordConfirmErrorMessage).toHaveCSS("color","rgb(169, 68, 66)")
await expect(passwordConfirmErrorMessage).toHaveText("Password confirmation does not match password!")
});
// 2. Same email cannot be used
// 3. wrong email format (example without @)
test('register - negative - wrong email format', async ({ page }) => {
  const homePage = new HomePage(page);
  const registerPage = new RegisterPage(page);
  const invalidEmail = "dsafasdfadfasdfasdf";

  await homePage.open();
  await homePage.gotoRegister();

  await registerPage.fillEmail(invalidEmail);
  await registerPage.clickContinue();

  let expectedMessage = "Please include an '@' in the email address. '" + invalidEmail + "' is missing an '@'.";
  await expect(registerPage.emailInput).toHaveJSProperty("validationMessage", expectedMessage);
});
// 4. Click continute on blank form
// 5. Warning: You must agree to the Privacy Policy!
