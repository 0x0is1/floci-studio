import { test, expect } from '@playwright/test';

test.describe('Canvas Navigation & Inspector E2E', () => {
  test('filters AWS services and inspects rich dropdown configuration', async ({ page }) => {
    await page.goto('/?project=proj-starter');

    // Search for CloudFront in palette
    const searchInput = page.getByPlaceholder('Search components...');
    await searchInput.fill('CloudFront');
    await expect(page.getByText('CloudFront CDN').first()).toBeVisible();

    // Clear search
    await searchInput.fill('');
    await expect(page.locator('aside').first().getByText('EC2 Instance')).toBeVisible();

    // Click on Production Web Server node on canvas
    const ec2Node = page.locator('.react-flow__node').filter({ hasText: /Web Server/i }).first();
    await expect(ec2Node).toBeVisible();
    await ec2Node.click();

    // Verify rich configuration dropdowns appear in inspector
    await expect(page.getByText('Instance Type (vCPU / Memory)')).toBeVisible();
    await expect(page.getByText('Web Workload Stack')).toBeVisible();
    await expect(page.getByText('Public IP')).toBeVisible();

    // Verify link button is not in sidebar (dedicated component mode)
    await expect(page.locator('aside').last().getByRole('button', { name: 'Link' })).not.toBeVisible();
  });
});
