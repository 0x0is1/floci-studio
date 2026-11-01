import { test, expect } from '@playwright/test';

test.describe('EC2 Session State & Standby Reconciliation E2E', () => {
  test('reconciles session state, shows standby before deploy, and connects on deploy', async ({ page }) => {
    await page.goto('/?project=proj-starter');

    // Wait for canvas nodes to be visible
    await expect(page.locator('.react-flow__node').filter({ hasText: 'Production Web Server' })).toBeVisible();

    // Reset if previous test left infrastructure running
    const stopBtn = page.getByRole('button', { name: 'Stop' });
    if (await stopBtn.isEnabled()) {
      await stopBtn.click();
      await expect(page.getByText('Playground Reset')).toBeVisible();
    }

    // Switch to Live Cluster tab to access EC2 Shell before deploying
    await page.getByRole('button', { name: 'Live Cluster Runtime' }).click();
    await page.getByRole('button', { name: 'EC2 Shell' }).click();

    // Verify standby state message and disabled input
    await expect(page.getByText('Container Offline / Standby')).toBeVisible();
    await expect(page.getByText('STANDBY', { exact: true })).toBeVisible();
    const input = page.getByPlaceholder(/Deploy instance to enable terminal shell/i);
    await expect(input).toBeDisabled();

    // Click Deploy in header
    const deployBtn = page.getByRole('button', { name: 'Deploy' });
    await expect(deployBtn).toBeEnabled();
    await deployBtn.click();

    // Wait for deployment completion
    await expect(page.getByText('Deployment Complete')).toBeVisible({ timeout: 25000 });

    // Switch back to EC2 Shell tab
    await page.getByRole('button', { name: 'EC2 Shell' }).click();

    // Instance should now be RUNNING and input enabled
    await expect(page.getByText('RUNNING').first()).toBeVisible();
    const activeInput = page.getByPlaceholder('Run remote command in container...');
    await expect(activeInput).toBeEnabled();

    // Clean up
    await page.getByRole('button', { name: 'Stop' }).click();
    await expect(page.getByText('Playground Reset')).toBeVisible();
  });
});
