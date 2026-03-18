import { test, expect } from '@playwright/test';

test("toHaveTitle, toHaveURL, toBeAttached", async ({ page }) => {
    await page.goto("/");
    // tikrinu kad url yra pagrindinis puslapis
    await expect(page).toHaveURL("/");
    // tikrinu kad title yra pagrindinis puslapis
    await expect(page).toHaveTitle("Your Store");
    // toBeAttached vs toBeVisible
    // toBeAttached - elementas yra DOM'e, bet gali būti nematomas (display:none, visibility:hidden, opacity:0, uždengtas kitu elementu)
    // toBeVisible - elementas yra DOM'e ir matomas vartotojui
    await expect(page.locator("[name='EUR']")).toBeAttached();
});

test("toBeChecked, toBeDisabled (toBeEnabled), toBeEditable (+not)", async ({ page }) => {
    await page.goto("/index.php?route=account/register");
    const newsletterYes = page.locator("input[name='newsletter'][value='1']");
    const newsletterNo = page.locator("input[name='newsletter'][value='0']");
    const continueButton = page.locator("input[type='submit']");

    //   not - neigiamas tikrinimas, t.y. tikrinu kad newsletterYes nera pazymetas, o newsletterNo yra pazymetas
    await expect(newsletterYes).not.toBeChecked();
    await expect(newsletterNo).toBeChecked();

    await newsletterYes.check();
    await expect(newsletterYes).toBeChecked();
    await expect(newsletterNo).not.toBeChecked();

    await expect(continueButton).not.toBeDisabled();
    await expect(continueButton).toBeEnabled();

    //   tikrinu kad newsletterYes yra editable, 
    await expect(newsletterYes).toBeEditable();
    await expect(page.locator("#input-firstname")).toBeEditable();

    //   toBeEnabled vs toBeEditable
// tobeEnabled: tikrina ar elementas turi atributa disabled, bet elementas gali buti readonly,
// toBeEditable: tikrina ar elementas nera disabled ir nera readonly, ar nera uzdengtas kitu elementu, ar nera kitu priezasciu del ko vartotojas negali su juo bendrauti.
});

test("toBeEmpty ",   async  ({ page }) => {
    await page.goto("/index.php?route=account/register");
    const firstNameInput = page.locator("#input-firstname");
//  toBeEmpty - tikrina ar inputas yra tuscias, t.y. nera teksto (arba value) ir nera vaiku.
    await expect(firstNameInput).toBeEmpty();
   
    await firstNameInput.fill("John");

    await expect(firstNameInput).not.toBeEmpty();

    // yra value - not empty
    await expect(page.locator("[value='Continue']")).not.toBeEmpty();

    // nera value, nera teksto, nera vaiku - empty
    await expect(page.locator(".fa-search")).toBeEmpty();

});