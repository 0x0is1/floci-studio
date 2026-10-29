import { test, expect } from '@playwright/test';

test.describe('Deploy & Real Infrastructure Workflow E2E', () => {
  test('deploys graph against Floci and displays live local URL', async ({ page }) => {
    await page.goto('/?project=proj-starter');

    // Verify Floci online indicator in header
    await expect(page.getByText('Floci 4566:')).toBeVisible();

    // Wait for starter nodes to be mounted and visible on canvas
    const ec2Node = page.locator('.react-flow__node').filter({ hasText: 'Production Web Server' });
    await expect(ec2Node).toBeVisible();

    // If already deployed from previous run, stop first to reset canvas
    const stopBtn = page.getByRole('button', { name: 'Stop' });
    if (await stopBtn.isEnabled()) {
      await stopBtn.click();
      await page.waitForTimeout(1000);
    }

    // Click Deploy button
    const deployBtn = page.getByRole('button', { name: 'Deploy' });
    await expect(deployBtn).toBeEnabled();
    await deployBtn.click();

    // Verify starting deployment notification
    await expect(page.getByText('Starting Deployment')).toBeVisible();

    // Wait for deployment completion toast
    await expect(page.getByText('Deployment Complete')).toBeVisible({ timeout: 25000 });

    // Switch to Live Infrastructure tab in bottom tray
    await page.getByRole('button', { name: 'Live Infrastructure' }).first().click();
    await expect(page.getByText('READY').first()).toBeVisible();

    // Click Stop button to reset
    await page.getByRole('button', { name: 'Stop' }).click();
    await expect(page.getByText('Playground Reset')).toBeVisible();
  });
});
