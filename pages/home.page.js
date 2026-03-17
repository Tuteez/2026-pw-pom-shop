export class HomePage {
  constructor(page) {
    this.page = page;
    this.myAccountLink = page.locator('a[title="My Account"]');
    this.loginLink = page.locator('a', { hasText: 'Login' });
    this.registerLink = page.locator('a', { hasText: 'Register' });
    this.currencyDropdown = page.locator('#form-currency');
    this.currencyDropdownSign = this.currencyDropdown.locator("strong");
    this.currencyOption = (desiredCurrency) => page.locator(`button[name="${desiredCurrency}"]`);
    this.searchInput = page.locator('#search input');
    this.searchButton = page.locator('#search button');
  }

  async open() {
    // kad veiktu reikia url nurodyti playwright.config.js (defineConfig-use-baseURL)
    await this.page.goto('/');
  }

  async gotoLogin() {
    await this.myAccountLink.click();
    await this.loginLink.click();
  }
// TODO: create - registerPage.open()
  async gotoRegister() {
    await this.myAccountLink.click();
    await this.registerLink.click();
  }

  async changeCurrency(desiredCurrency) {
    await this.currencyDropdown.click();
    await this.currencyOption(desiredCurrency).click();
  }

    async submitSearch(desiredProduct) {
    await this.searchInput.fill(desiredProduct);
    await this.searchButton.click();
  }
}