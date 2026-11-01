import { test, expect } from '@playwright/test';

test.describe('Project Lifecycle & Boilerplate E2E', () => {
  test('creates new project, displays starter boilerplate and saves', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByText('Floci Studio').first()).toBeVisible();

    // Click Create New Project button on home page
    await page.getByRole('button', { name: 'Create New Project' }).first().click();

    // Enter project name and create
    const projectName = `Production Cloud ${Date.now()}`;
    await page.getByPlaceholder('e.g. Serverless Order Pipeline').fill(projectName);
    await page.getByRole('button', { name: /Create & Launch/i }).click();

    await expect(page.locator('header').getByText(projectName)).toBeVisible();

    // Verify default network foundation appears on the canvas
    const canvas = page.locator('.react-flow');
    await expect(canvas.locator('.react-flow__node').filter({ hasText: 'Default VPC' })).toBeVisible();
    await expect(canvas.locator('.react-flow__node').filter({ hasText: 'Default Subnet' })).toBeVisible();
    await expect(canvas.locator('.react-flow__node').filter({ hasText: 'Browser Client' })).toHaveCount(0);
    await expect(canvas.locator('.react-flow__node').filter({ hasText: 'Web Server' })).toHaveCount(0);

    // Click Save button
    await page.getByRole('button', { name: 'Save' }).click();
  });
});
