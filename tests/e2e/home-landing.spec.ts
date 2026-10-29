import { test, expect } from '@playwright/test';

test.describe('Floci Studio Landing & History Navigation E2E', () => {
  test('displays studio landing page and supports back/forward navigation', async ({ page }) => {
    // 1. Visit root landing page
    await page.goto('/');

    await expect(page.getByText('Floci Studio').first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Create New Project' })).toBeVisible();

    // 2. Click on a project card to open canvas
    await page.getByRole('button', { name: 'Open Canvas' }).first().click();

    // 3. Verify canvas is visible and URL has project parameter
    await expect(page.locator('.react-flow')).toBeVisible();
    await expect(page).toHaveURL(/\/projects\/.+\/editor/);

    // 4. Test browser back button returns to landing page
    await page.goBack();
    await expect(page.getByRole('button', { name: 'Create New Project' })).toBeVisible();
    await expect(page.locator('.react-flow')).not.toBeVisible();

    // 5. Test browser forward button returns to canvas
    await page.goForward();
    await expect(page.locator('.react-flow')).toBeVisible();
    await expect(page).toHaveURL(/\/projects\/.+\/editor/);
  });
});
