export class ColumnRightPage {
  constructor(page) {
    this.page = page;
    this.logoutLink = page.locator("#column-right a[href*='/logout']");
  }
}