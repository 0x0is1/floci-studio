import { test, expect } from '@playwright/test';

test.describe('Edge Cases & Resiliency', () => {
  test('displays Backend Unresponsive Screen when backend is down and dismisses to read-only', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=Backend Service Unresponsive')).toBeVisible();
    await expect(page.locator('text=Retry Connection')).toBeVisible();

    await page.locator('text=Inspect Canvas (Read-Only)').click();
    await expect(page.locator('text=Backend Service Unresponsive')).not.toBeVisible();
    await expect(page.locator('text=Backend server unreachable')).toBeVisible();
  });

  test('renders custom 404 page for unknown routes', async ({ page }) => {
    await page.goto('/unknown-nonexistent-path');
    if (await page.locator('text=Inspect Canvas (Read-Only)').isVisible()) {
      await page.locator('text=Inspect Canvas (Read-Only)').click();
    }
    await expect(page.locator('text=Page Not Found')).toBeVisible();
    await expect(page.locator('text=Return to Projects')).toBeVisible();
  });
});
