import { test, expect } from '@playwright/test';

// fill
test('Fill', async ({ page }) => {
    await page.goto('http://opencart.abstracta.us/');
    await page.locator('#search input').fill('MacBook');
    await page.locator('#search input').fill('1');
    // bus "1" nes fill istryna esama tekata ir iraso kita.
});

// check
test('Check', async ({ page }) => {
    await page.goto('/index.php?route=account/register');
    await page.locator("[name='agree']").check();
    // nes check yra skirtas checkboxams ir radio buttonams, o input type="text" neturi tokio elemento, tai testas nepavyks.
    await expect(page.locator("[name='agree']")).toBeChecked();
    await page.locator("[name='agree']").check(); //naudojant checked elementui - nieko nedaro. 
    await expect(page.locator("[name='agree']")).toBeChecked();
    await page.locator("[name='agree']").uncheck();
    await expect(page.locator("[name='agree']")).not.toBeChecked()
});

// kai yra "select" tagas
// oldStyle selectOption (https://demoqa.com/select-menu)
test('oldStyle SelectOption', async ({ page }) => {
    await page.goto('https://demoqa.com/select-menu');
    await page.locator('#oldSelectMenu').selectOption('2'); //pasirenka antra elementa pagal value
    await expect(page.locator('#oldSelectMenu')).toHaveValue('2');
    await page.locator('#oldSelectMenu').selectOption({ label: 'Purple' }); //pasirenka elementa pagal label
    await expect(page.locator('#oldSelectMenu')).toHaveValue('4');
    await page.locator('#oldSelectMenu').selectOption({ index: 5 }); //pasirenka elementa pagal index (nuo 0)
    await expect(page.locator('#oldSelectMenu')).toHaveValue('5');
});
// Kai ne "select" o pvz "div". Tada reikia paciam.
test('div SelectOption', async ({ page }) => {
    await page.goto('https://demoqa.com/select-menu');
// click to open
    await page.locator('#withOptGroup').click();
// click to select
await page.locator('#withOptGroup').getByText('Group 1, option 2').click();
await expect(page.locator('#withOptGroup [class*="singleValue"]')).toHaveText('Group 1, option 2');
});