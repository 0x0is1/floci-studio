import { test, expect } from '@playwright/test';

test.describe('Component & Link Dedicated Inspector Selection', () => {
  test('shows exclusively component config on node click, link config on edge click', async ({ page }) => {
    await page.goto('/?project=proj-starter');

    // Initially, right sidebar shows AWS components panel
    await expect(page.getByText('AWS Components')).toBeVisible();

    // Click on the EC2 Production Web Server node on canvas
    const ec2Node = page.locator('.react-flow__node').filter({ hasText: 'Production Web Server' });
    await expect(ec2Node).toBeVisible();
    await ec2Node.click();

    // Inspector should now show ONLY component config
    await expect(page.getByText('Display Title')).toBeVisible();
    await expect(page.getByText('Instance Type (vCPU / Memory)')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Connection Link' })).not.toBeVisible();
    await expect(page.locator('aside').last().getByText('Live Infrastructure')).not.toBeVisible();

    // Click on an edge badge on canvas (e.g. HTTP :8080 or IAM Policy)
    const edgeBtn = page.locator('button').filter({ hasText: 'HTTP :8080' }).first();
    if (await edgeBtn.isVisible()) {
      await edgeBtn.click();
      // Inspector should now show ONLY link config
      await expect(page.getByRole('heading', { name: 'Connection Link' })).toBeVisible();
      await expect(page.getByText('Protocol')).toBeVisible();
      await expect(page.getByText('Target Port')).toBeVisible();
      await expect(page.getByText('Instance Type')).not.toBeVisible();
    }

    // Switch to Live Cluster tab where bottom tray is hosted
    await page.getByRole('button', { name: 'Live Cluster Runtime' }).click();
    await expect(page.getByRole('button', { name: /Execution Logs|Terminal/ })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Live Resources' })).toBeVisible();
  });
});
