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

test("toBeEmpty ", async ({ page }) => {
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

// toBeFocused -  elementas yra aktyvus ir pasiruošęs vartotojo įvestims.
// naudojamas inputams, textarea, contenteditable elementams(tikrina ar mirksi peles kursorius ant elemento, t.y. ar)
// galima ir kitiem elementams, kuriems galima suteikti fokusą, pvz. button, bet dažniausiai naudojamas formos elementams.
test("toBeFocused", async ({ page }) => {
    await page.goto("/index.php?route=account/register");
    const firstNameInput = page.locator("#input-firstname");

    await expect(firstNameInput).not.toBeFocused();
    await firstNameInput.focus();
    await expect(firstNameInput).toBeFocused();

    //  kitiems elementams, kuriems galima suteikti fokusą, pvz. button
    const continueButton = page.locator("input[type='submit']");
    await expect(continueButton).not.toBeFocused();
    await continueButton.focus();
    await expect(continueButton).toBeFocused();
});

// toBeHidden - elemento NERA DOM'e, arba jis nėra matomas vartotojui (arba elementas yra uždengtas kitu elementu)
// naudojamas tikrinti ar elementas yra paslėptas, bet vis dar egzistuoja DOM'e, o ne ar jis yra visiškai pašalintas iš DOM.
test("toBeHidden", async ({ page }) => {
    await page.goto("/index.php?route=account/register");
    const nonExistentSelector = page.locator("NERA-TOKIO-SELECTORIAUS");
    const visibleElement = page.locator("#input-firstname");

    await expect(nonExistentSelector).toBeHidden();
    await expect(visibleElement).not.toBeHidden();
});

// vienas is budu pakeisti narsykles dydi.
test.use({
    viewport: { width: 1000, height: 700 }
});
// toBeInViewport - elementas yra matomas vartotojui ir yra matomas ekrane, t.y. jis nėra uždengtas kitu elementu, nėra scrolled out of view, ir yra matomas vartotojui.
test("toBeInViewport", async ({ page }) => {
    await page.goto("/index.php?route=account/register");
    const firstNameInput = page.locator("#input-firstname");
    const footer = page.locator("footer");

    // // clickinti galima ir elementus kurie nera vewporte t.y. nematomi vartotojui (scrolint atskirai nereikia)
    // // panaudojus click, PW pats pacrolina iki elemento. 
    await expect(firstNameInput).toBeInViewport();
    await expect(footer).not.toBeInViewport();
});

// toContainClass - contains
// toHaveClass - equals
test("toContainClass, toHaveClass", async ({ page }) => {
    await page.goto("/index.php?route=account/register");
    // class="form-group required"
    const elementWithSeveralClasses = page.locator("//div[@id='account-register']//div[3]");

    await expect(elementWithSeveralClasses).toHaveClass("form-group required");
    // await expect(elementWithSeveralClasses).toHaveClass("form-group"); // failina, nes yra ne tik si klase

    await expect(elementWithSeveralClasses).toContainClass("form-group");
    await expect(elementWithSeveralClasses).toContainClass("required");

    await expect(elementWithSeveralClasses).not.toHaveClass("other-class");
    // toHaveId - analogiškai kaip toHaveClass, bet tikrina id atributą.
});

// toHaveValue - tikrina ar formos elementas (input, textarea, select) turi tam tikra ATRIBUTO value reiksme.
test("toHaveValue", async ({ page }) => {
    await page.goto("/index.php?route=account/register");
    const firstNameInput = page.locator("#input-firstname");

    await expect(firstNameInput).toHaveValue("");
    await firstNameInput.fill("John");
    await expect(firstNameInput).toHaveValue("John");

    // await expect(page.locator("div[id='content'] h1")).toHaveValue("Create Account"); // failina, nes h1 neturi value atributo
});

// toHaveValues - tikrina ar formos elementas (input, textarea, select) turi tam tikra ATRIBUTO value reiksmiu masyva. Naudojama kai yra keli elementai su tuo paciu name atributu, pvz. radio button'ai arba checkbox'ai.
test("toHaveValues", async ({ page }) => {
    await page.goto("https://demoqa.com/select-menu");
    const carsSelect = page.locator("#cars");
    carsSelect.selectOption(["volvo", "saab",]);
    await expect(carsSelect).toHaveValues(["volvo", "saab"]);
    // naudojmas su checkbox grupe arba multiple select.
});

// toHaveAttribute - 
test("toHaveAttribute", async ({ page }) => {
    await page.goto("/index.php?route=account/register");
    const firstNameInput = page.locator("#input-firstname");

    await expect(firstNameInput).toHaveAttribute("name", "firstname");
    await expect(firstNameInput).toHaveAttribute("placeholder", "First Name");
    await expect(firstNameInput).toHaveAttribute("type", "text");
    await expect(firstNameInput).toHaveAttribute("class", "form-control");// galima ir taip, bet logiskiau naudot toContainClass
    await expect(firstNameInput).toHaveAttribute("value"); //- tikrina ar yra value atributas, bet nekreipia demesio i jo reiksme
    await expect(firstNameInput).toHaveAttribute("value", ""); //- tikrina ar yra value atributas ir ar jo reiksme yra tuscias string
});

// toHaveCSS - tikrina ar elementas turi tam tikra CSS savybe su tam tikra reiksme
test("toHaveCSS", async ({ page }) => {
    await page.goto("/index.php?route=account/register");
    const firstNameInput = page.locator("#input-firstname");

    await expect(firstNameInput).toHaveCSS("display", "block");
    await expect(firstNameInput).toHaveCSS("width", "100%");
    await expect(firstNameInput).toHaveCSS("padding", "6px 12px");
});

// toHaveJSProperty
test("toHaveJSProperty", async ({ page }) => {
    await page.goto("/index.php?route=account/register");
    const firstNameInput = page.locator("#input-firstname");

    await expect(firstNameInput).toHaveJSProperty("nodeName", "INPUT");
    await expect(firstNameInput).toHaveJSProperty("type", "text");
    await expect(firstNameInput).toHaveJSProperty("value", "");
});

// toHaveCount - tikrina ar yra tam tikras elementų kiekis, atitinkantis locator'iu. Naudojama kai norime patikrinti ar yra tam tikras kiekis elementų, pvz. ar yra 5 produktai puslapyje, ar yra 3 error message'ai ir pan.
// toHaveCount vs hidden elements: nemato pasleptu elementu, t.y. jei yra 5 elementai, bet 2 paslepti, tai toHaveCount(5) failins, o toHaveCount(3) praeis. Jei norime tikrinti visus elementus, neatsižvelgiant ar jie paslepti ar ne, reikia naudoti locator.count() ir patikrinti ar jis lygus tam tikram skaiciui.
test("toHaveCount", async ({ page }) => {
    await page.goto("/index.php?route=account/register");
    const formGroups = page.locator(".form-group");

    await expect(formGroups).toHaveCount(8);
    await expect(page.locator("#content")).toHaveCount(1);
});

// toHaveRole - tikrina ar elementas turi tam tikra ARIA role atributą su tam tikra reiksme. Naudojama tikrinti ar elementai yra tinkamai sukurti pagal prieinamumo standartus, pvz. ar mygtukas turi role="button", ar inputas turi role="textbox" ir pan.
test("toHaveRole", async ({ page }) => {
    await page.goto("/index.php?route=account/register");
    const firstNameInput = page.locator("#input-firstname");

    await expect(firstNameInput).toHaveRole("textbox");
    await expect(page.locator("input[type='submit']")).toHaveRole("button");
    await expect(page.locator("footer")).toHaveRole("contentinfo");
    await expect(page.getByRole('radio', { name: 'Yes' })).toHaveRole("radio");
});

// toHaveAccessibleDescription vs toHaveAccessibleName - tikrina ar elementas turi tam tikra prieinamumo aprašą (description) arba pavadinimą (name). 
// Naudojama tikrinti ar elementai yra tinkamai sukurti pagal prieinamumo standartus, 
// pvz. ar mygtukas turi aria-label arba aria-labelledby atributą su tinkamu aprašu
test("toHaveAccessibleDescription, toHaveAccessibleName", async ({ page }) => {
    await page.goto("/index.php?route=account/register");
    const firstNameInput = page.locator("#input-firstname");

    await expect(firstNameInput).toHaveAccessibleName("* First Name");
    await expect(page.locator("input[type='submit']")).toHaveAccessibleName("Continue");
    await expect(page.locator("#search input")).toHaveAccessibleName("Search");

    // a11y = Accesability.
    // failin nes siame psl nera AccessibleDescription
    // await expect(page.locator("#search input")).toHaveAccessibleDescription("Type and press enter to search");
});

// toMatchAriaSnapshot - tikrina ar elementas atitinka tam tikra ARIA snapshot'ą, t.y. ar elementas turi tam tikrus ARIA atributus su tam tikromis reiksme, ir ar jie atitinka snapshot'e nurodytas reiksmes. Naudojama tikrinti ar elementai yra tinkamai sukurti pagal prieinamumo standartus, ir ar jie nepasikeite nuo paskutinio karto kai buvo sukurtas snapshot'as.
test("toMatchAriaSnapshot", async ({ page }) => {
    await page.goto("/index.php?route=account/register");
    const firstNameInput = page.locator("#input-firstname");

    await expect(firstNameInput).toMatchAriaSnapshot("firstNameInput");
    // jei snapshot'as jau yra sukurtas, tai tikrins ar elementas atitinka snapshot'ą, jei snapshot'as dar nėra sukurtas, tai jį sukurs su esamomis elemento ARIA savybėmis.
});

// toHaveScreenshot - tikrina ar elementas atitinka tam tikra screenshot'ą, t.y. ar elementas atrodo taip pat kaip ir screenshot'e. Naudojama tikrinti ar elementai atrodo taip kaip tikimasi, ir ar jie nepasikeite nuo paskutinio karto kai buvo sukurtas screenshot'as. Galima naudoti visam puslapiui arba konkretiems elementams.
test("toHaveScreenshot", async ({ page }) => {
    await page.goto("/index.php?route=account/register");
    const firstNameInput = page.locator("#input-firstname");

    await expect(firstNameInput).toHaveScreenshot("firstNameInput.png");
    // jei screenshot'as jau yra sukurtas, tai tikrins ar elementas atitinka screenshot'ą, jei screenshot'as dar nėra sukurtas, tai jį sukurs su esama elemento vizualine išvaizda.
});