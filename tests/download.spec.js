import { test, expect } from '@playwright/test';
import path from 'path';

test('Download files', async ({ page }) => {
  await page.goto('https://demoqa.com/upload-download');

  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.locator('#downloadButton').click()
  ]);

  const filePath = path.join(
    process.cwd(),
    'downloads',
    download.suggestedFilename()
  );
  await download.saveAs(filePath);
  console.log('Saved to:', filePath);
});
