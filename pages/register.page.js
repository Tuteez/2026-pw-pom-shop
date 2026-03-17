export class RegisterPage {
  constructor(page) {
    this.page = page;
    this.firstnameInput = page.locator("#input-firstname");
    this.lastnameInput = page.locator("#input-lastname");
    this.emailInput = page.locator('#input-email');
    this.phoneInput = page.locator('#input-telephone');
    this.passwordInput = page.locator('#input-password');
    this.passwordConfirmInput = page.locator('#input-confirm');
    this.passwordConfirmFormGroupItem = page.locator("//input[@id='input-confirm']/ancestor::div[contains(@class,'has-error')]");
    this.passwordConfirmFormGroupItemV2 = page.locator('.has-error', { has: this.passwordConfirmInput });
    this.subscribeYesRadio = page.locator("[name='newsletter'][value='1']");
    this.agreeCheckbox = page.locator("[name='agree']");
    this.continueButton = page.locator("input[value='Continue']");
  }
  async getFormItemLabel(input) {
    return this.page.locator('.has-error', { has: input });
  }

  async getErrorMessage(input){
    return input.locator("..").locator(".text-danger");
  }

  async fillFirstname(firstname) {
    await this.firstnameInput.fill(firstname);
  }

  async fillLastname(lastname) {
    await this.lastnameInput.fill(lastname);
  }

  async fillEmail(email) {
    await this.emailInput.fill(email);
  }

  async fillPhone(number) {
    await this.phoneInput.fill(number)
  }

  async fillPassword(pass) {
    await this.passwordInput.fill(pass);
  }

  async fillPasswordConfirm(pass) {
    await this.passwordConfirmInput.fill(pass);
  }

  async checkSubscribeYes() {
    await this.subscribeYesRadio.click();
  }

  async agreeToPrivacyPolicy() {
    await this.agreeCheckbox.check();
  }

  async clickContinue() {
    await this.continueButton.click();
  }
}