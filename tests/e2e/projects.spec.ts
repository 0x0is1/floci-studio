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

    // Verify starter boilerplate nodes appear on the canvas
    const canvas = page.locator('.react-flow');
    await expect(canvas.locator('.react-flow__node').filter({ hasText: 'CloudFront CDN' })).toBeVisible();
    await expect(canvas.locator('.react-flow__node').filter({ hasText: 'Production Web Server' })).toBeVisible();
    await expect(canvas.locator('.react-flow__node').filter({ hasText: 'Static Media Bucket' })).toBeVisible();
    await expect(canvas.locator('.react-flow__node').filter({ hasText: 'Background Job Queue' })).toBeVisible();

    // Click Save button
    await page.getByRole('button', { name: 'Save' }).click();
  });
});
