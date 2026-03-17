export class LoginPage {
  constructor(page) {
    this.page = page;
    this.email = page.locator('#input-email');
    this.password = page.locator('#input-password');
    this.loginBtn = page.locator('input[value="Login"]');
    this.noMatchForEmailError = page.locator('for.alert-danger');
  }

  async login(email, password) {
    await this.email.fill(email);
    await this.password.fill(password)
    await this.loginBtn.click();
  }
}