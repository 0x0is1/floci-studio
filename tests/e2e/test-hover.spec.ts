import { test, expect } from '@playwright/test';

test('verifies cloudfront connected origin in editor and runtime', async ({ page }) => {
  await page.goto('/?project=proj-starter');
  await page.waitForTimeout(500);

  // In editor mode, verify CloudFront card shows target connection badge
  const cfNode = page.locator('.react-flow__node').filter({ hasText: 'CloudFront CDN' }).first();
  await expect(cfNode).toBeVisible();
  await expect(cfNode.getByText(/-> EC2/i)).toBeVisible();

  // Click CloudFront to inspect sidebar
  await cfNode.click();
  await expect(page.getByText('Connected Origin')).toBeVisible();
  await expect(page.getByText('CONNECTED', { exact: true })).toBeVisible();
  await expect(page.locator('aside').getByText(/Production Web Server/i)).toBeVisible();
});
