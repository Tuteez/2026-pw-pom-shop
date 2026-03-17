export class SearchPage {
  constructor(page) {
    this.page = page;
    this.yourShoppingCartEmptyText = page.locator('#content p:last-child');
    this.searchInProductDescriptionsCheckbox = page.locator("#description");
    this.searchButton = page.locator("#button-search");
  }

    async open() {
    await this.page.goto('/index.php?route=product/search');
  }
}