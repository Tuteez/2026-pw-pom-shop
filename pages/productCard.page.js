export class ProductCardPage {
  constructor(page) {
    this.page = page;
    this.productCard = page.locator(".product-layout");
    this.price = page.locator('.price');
    this.title = page.locator(".product-layout h4");
    this.description = page.locator(".product-layout p").first();
    this.compareButton = page.locator("[data-original-title='Compare this Product']");
  }

  // lengviau skaitoma
  async getPrice(productNumber) {
    return await this.price.nth(productNumber - 1);
  }

  // sunkiau skaitomas
  //   async getPrice(index) {
  //   return await this.price.nth(index);
  // }


  getProduct(productNumber) {
    return this.productCard.nth(productNumber - 1);
  }

  getProductDescription(productNumber) {
    return this.getProduct(productNumber).locator('p').first();
  }

}