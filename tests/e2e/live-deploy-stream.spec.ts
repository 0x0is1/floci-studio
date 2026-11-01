import { test, expect } from '@playwright/test';
import { resetStarterFixture } from './helpers/resetStarterFixture';

test.beforeEach(() => resetStarterFixture());

test.describe('Live deploy SSE progress stream E2E', () => {
  test('auto-switches to the Live tab and streams per-node status before settling on READY', async ({ page }) => {
    await page.goto('/?project=proj-starter');

    const stopBtn = page.getByRole('button', { name: 'Stop' });
    if (await stopBtn.isEnabled()) { await stopBtn.click(); await page.waitForTimeout(1000); }

    const ec2Node = page.locator('.react-flow__node').filter({ hasText: /Web Server/i }).first();
    await expect(ec2Node).toBeVisible();

    const deployBtn = page.getByRole('button', { name: 'Deploy' });
    await expect(deployBtn).toBeEnabled();
    await deployBtn.click();

    await expect(page.getByText('Starting Deployment')).toBeVisible();

    // Deploy auto-switches the bottom tray to Live Infrastructure; the SSE stream renders a
    // colored status dot per node (RUNNING/DEPLOYING/FAILED/SKIPPED) before the final toast lands.
    await expect(page.getByText(/DEPLOYING|RUNNING/).first()).toBeVisible({ timeout: 15000 });

    await expect(page.getByText('Deployment Complete')).toBeVisible({ timeout: 25000 });
    await expect(page.getByText('READY').first()).toBeVisible();

    await page.getByRole('button', { name: 'Stop' }).click();
    await expect(page.getByText('Playground Reset')).toBeVisible();
  });
});
