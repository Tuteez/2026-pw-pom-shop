export class ProductComparisonPage{
    constructor(page){
        this.page = page;
        this.productTitle = page.locator("table a strong");
    }
}