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

// click + keyboard press
// ControlOrMeta - tai yra modifikatorius, kuris atitinka "Control" klavišą Windows ir Linux operacinėse sistemose, o "Meta" (Command) klavišą MacOS operacinėje sistemoje. Tai leidžia rašyti vieną testą, kuris veiks abiejose platformose, nes jis automatiškai naudos tinkamą modifikatorių priklausomai nuo to, kur testas yra vykdomas.
test('click + ControlOrMeta', async ({ page }) => {
    await page.goto('https://demoqa.com/select-menu');
    await page.locator('#cars [value="volvo"]').click();
    await page.locator('#cars [value="opel"]').click({ modifiers: ['ControlOrMeta'] });
});

//  click({ position: { x: 0, y: 0 } });
// be position - clickas bus viduryje elemento,
// su position - clickas bus nurodytu koordinaciu elemente. 
test('click with position', async ({ page }) => {
    await page.goto('https://demoqa.com/select-menu');
    await page.locator('#selectMenuContainer').click({ position: { x: 1, y: 500 } });
});

// open https://demoqa.com/buttons
// double click - verify text "You have done a double click"
// etc (click - verify)
test('clicks', async ({ page }) => {
    await page.goto('https://demoqa.com/buttons');
    await page.locator('#doubleClickBtn').dblclick();
    await expect(page.locator('#doubleClickMessage')).toHaveText('You have done a double click');
    await page.locator('#rightClickBtn').click({ button: 'right' });
    await expect(page.locator('#rightClickMessage')).toHaveText('You have done a right click');
    await page.locator('//button[.="Click Me"]').click();
    await expect(page.locator('#dynamicClickMessage')).toHaveText('You have done a dynamic click');

    await page.locator('//button[.="Click Me"]').hover();
});

// https://demoqa.com/radio-button click disabled
// force click - kai elementas yra uzdengtas kitu elementu, arba yra disabled, bet mes norime vis tiek paspausti.
// naudoti reikia atsargiai, nes tai gali sukelti netiketu elgesi aplikacijoje.
test('click disabled', async ({ page }) => {
    await page.goto('https://demoqa.com/radio-button');
    await page.locator('#noRadio').click({ force: true });
});

// Keys and shortcuts
test('Keys and shortcuts', async ({ page }) => {
    await page.goto('https://demoqa.com/text-box');
    await page.locator('#currentAddress').fill('123 Main St, Anytown, USA');
    await page.locator('#currentAddress').press('ControlOrMeta+A'); //pasirenka visa teksta
    await page.locator('#currentAddress').press('ControlOrMeta+C'); //kopijuoja teksta
    await page.locator('#permanentAddress').press('ControlOrMeta+V'); //ikelia teksta
    await expect(page.locator('#permanentAddress')).toHaveValue('123 Main St, Anytown, USA');
});

// Upload files: setInputFiles(element, file)
test('Upload files', async ({ page }) => {
    await page.goto('https://demoqa.com/upload-download');
    const filePath = 'tests/files/sample.txt';
    await page.setInputFiles('#uploadFile', filePath);
    await expect(page.locator('#uploadedFilePath')).toHaveText(/sample.txt/);
});
// Upload files: element.setInputFiles(file)
test('Upload multiple files', async ({ page }) => {
    await page.goto('https://demoqa.com/upload-download');
    // jei inputas leidzia, galima uploadinti ir kelis failus vienu metu, tada reikia perduoti masyva su keliomis file path reiksmemis.
    const filePaths = ['tests/files/sample.txt'];
    await page.locator('#uploadFile').setInputFiles(filePaths);
    await expect(page.locator('#uploadedFilePath')).toHaveText(/sample.txt/);
});

// // Download files
// test('Download files', async ({ page, context }) => {
//     await page.goto('https://demoqa.com/upload-download');
//     // kai paspaudziame download mygtuka, atsiranda download eventas, kuris grazina download objekta. 
//     const [download] = await Promise.all([
//         page.waitForEvent('download'),
//         page.locator('#downloadButton').click()
//     ]);
//     // download.path() grazina file path, kur failas buvo issaugotas po downloado. 
//     const filePath = await download.path();
//     console.log('Downloaded file path:', filePath);
// });

// Drag and Drop
test('Drag and Drop', async ({ page }) => {
    await page.goto('https://www.w3schools.com/html/html5_draganddrop.asp');
    const source = page.locator('#div1');
    const target = page.locator('#div2');
    await source.dragTo(target);
});
// Drag and Drop manual
test('Drag and Drop manual', async ({ page }) => {
    await page.goto('https://www.w3schools.com/html/html5_draganddrop.asp');
    await page.locator('#div1 img').hover();
    await page.mouse.down();
    await page.locator('#div2').hover();
    await page.mouse.up();
});

// scrollIntoViewIfNeeded - cia neveikia, reikia infinity scroll testams, kur reikia scrollinti iki elemento, kuris yra uzkrautas tik scrollinant.
test('scrollIntoViewIfNeeded', async ({ page }) => {
    await page.goto('https://playwright.dev/docs/input#mouse-click');
    await page.getByRole('link', { name: 'Previous « Accessibility' }).scrollIntoViewIfNeeded();
    // await page.getByRole('link', { name: 'Previous « Accessibility' }).click();
});

// await page.mouse.wheel(0, 10);
test('mouse wheel', async ({ page }) => {
    await page.goto('https://playwright.dev/docs/input#mouse-click');
    await page.mouse.wheel(0, 500);
});

test('scrollTo', async ({ page }) => {
    await page.goto('https://playwright.dev/docs/input#mouse-click');
    await page.evaluate(() => {
        window.scrollTo(0, -5000);
    });

});