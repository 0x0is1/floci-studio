import { test, expect } from '@playwright/test';
import { resetStarterFixture } from './helpers/resetStarterFixture';

test.beforeEach(() => resetStarterFixture());

test.describe('Test Runner node E2E', () => {
  test('branches a Test Runner node off EC2 and shows its upload/run inspector form', async ({ page }) => {
    await page.goto('/?project=proj-starter');
    const stopBtn = page.getByRole('button', { name: 'Stop' });
    if (await stopBtn.isEnabled()) { await stopBtn.click(); await page.waitForTimeout(1000); }

    const ec2Node = page.locator('.react-flow__node').filter({ hasText: /Web Server/i }).first();
    await expect(ec2Node).toBeVisible();

    await ec2Node.hover();
    await ec2Node.getByTitle('Add connected AWS resource').click();
    await expect(page.getByText('Next Valid AWS Nodes')).toBeVisible();

    const testRunnerOption = page.locator('.react-flow__node button').filter({ hasText: 'Test Runner' }).first();
    await expect(testRunnerOption).toBeVisible();
    await testRunnerOption.click();
    await expect(page.getByText('Architecture Branched')).toBeVisible();

    const testRunnerNode = page.locator('.react-flow__node').filter({ hasText: 'Test Runner' }).first();
    await expect(testRunnerNode).toBeVisible();
    await testRunnerNode.click();

    // Inspector shows the Test Runner config form: network selector, empty file list, disabled Run button.
    await expect(page.getByText('Network Accessibility')).toBeVisible();
    await expect(page.getByText('No test files uploaded yet.')).toBeVisible();
    await expect(page.getByRole('button', { name: /Run Tests/i })).toBeDisabled();
  });
});
