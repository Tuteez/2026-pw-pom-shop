import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/home.page.js';
import { ProductCardPage } from '../pages/productCard.page.js';
import { ProductComparisonPage } from '../pages/productComparison.page.js';

test.use({ ignoreHTTPSErrors: true });
test('compare two products', async ({ page }) => {
  const homePage = new HomePage(page);
  const productCard = new ProductCardPage(page);
  const productComparisonPage = new ProductComparisonPage(page);
  await homePage.open();

// add to compare product 1
await productCard.compareButton.nth(0).click();
await expect(homePage.productComparisonLink).toBeVisible();
// add to compare product 2
await productCard.compareButton.nth(1).click();
await expect(homePage.productComparisonLink).toBeVisible();
// goto to compare page
await homePage.productComparisonLink.click();
// verify product 1 & product 2  
await expect(productComparisonPage.productTitle).toHaveCount(2);
});

