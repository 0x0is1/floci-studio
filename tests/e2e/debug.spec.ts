import { test } from '@playwright/test';

test('debug project starter', async ({ page }) => {
  await page.goto('/?project=proj-starter');
  await page.waitForSelector('.react-flow__node');
  await page.getByRole('button', { name: 'Live Cluster Runtime' }).click();
  await page.waitForTimeout(500);
  console.log('--- DEPLOYED TAB NODES ---');
  for (const n of await page.locator('.react-flow__node').all()) {
    console.log(await n.innerText());
  }
});
