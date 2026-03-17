import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/home.page.js'
import { ProductCardPage } from '../pages/productCard.page.js';

test.use({ ignoreHTTPSErrors: true });
test('change currency', async ({ page }) => {
    const homePage = new HomePage(page);
    const productCard = new ProductCardPage(page);
    await homePage.open();
    // Test:change currency

    //    home: change to EU
    await homePage.changeCurrency("EUR")

    //    home: verify on header
    await expect(homePage.currencyDropdownSign).toHaveText("€");
    //    productCard:  verify on item card
    //  3 vienod asertai bet skirtingai realizuoti
    await expect(productCard.price.first()).toContainText("€")
    await expect(productCard.price.nth(0)).toContainText("€")
    await expect(await productCard.getPrice(1)).toContainText("€")
});

