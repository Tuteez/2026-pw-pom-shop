import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/home.page.js'
import { ProductCardPage } from '../pages/productCard.page.js';
import { SearchPage } from '../pages/search.page.js';

test.use({ ignoreHTTPSErrors: true });
test('search product by title', async ({ page }) => {
    const homePage = new HomePage(page);
    const productCard = new ProductCardPage(page);
    await homePage.open();

    const expectedProduct = await productCard.title.first().textContent();
    await homePage.submitSearch(expectedProduct);

    await expect(productCard.title.first()).toHaveText(expectedProduct)
});

test('search product by description', async ({ page }) => {
    const homePage = new HomePage(page);
    const productCard = new ProductCardPage(page);
    const searchPage = new SearchPage(page);

    await homePage.open();
    let decs = await productCard.getProductDescription(1).innerText();
    let trimedDesc = decs.slice(0, 10);

    await homePage.submitSearch(trimedDesc);
    await expect(searchPage.yourShoppingCartEmptyText).toHaveText("Your shopping cart is empty!");
    await expect(productCard.title).toHaveCount(0)

    await searchPage.searchInProductDescriptionsCheckbox.click();
    await searchPage.searchButton.click();
    await expect(productCard.description).toContainText(trimedDesc);
});

test('example how open search page', async ({ page }) => {
    const searchPage = new SearchPage(page);
    await searchPage.open();
    // toks atidarymas netestuoja ar useriui veikia linkai/butonai naviguojantis i reikiama  vieta
    // bet taip greiciau 
    // Variantas: bent karta patesuoti navigacija per ui, o kitur galima atidaryt url.
});