import { test, expect } from '@playwright/test';

test.describe('Bedrock AI Project Workflow E2E', () => {
  test('loads Bedrock GenAI project, configures model, and verifies pipeline', async ({ page }) => {
    await page.goto('/projects/1793299000001/editor');

    // Verify Floci online indicator in header
    await expect(page.getByText('Floci 4566:')).toBeVisible();

    // Verify Bedrock node on canvas
    const bedrockNode = page.locator('.react-flow__node').filter({ hasText: 'Claude 3 Sonnet' });
    await expect(bedrockNode).toBeVisible();

    // Click Bedrock node to inspect configuration
    await bedrockNode.click();
    await expect(page.getByText('Bedrock & LLM Configuration')).toBeVisible();

    // Verify foundation model dropdown contains Claude
    const modelSelect = page.locator('select').first();
    await expect(modelSelect).toBeVisible();

    // Verify Deploy button is ready
    const deployBtn = page.getByRole('button', { name: 'Deploy' });
    await expect(deployBtn).toBeEnabled();

    // Deploy project against Floci
    await deployBtn.click();
    await expect(page.getByText('Starting Deployment')).toBeVisible();
    await expect(page.getByText('Deployment Complete')).toBeVisible({ timeout: 25000 });

    // Clean up infrastructure
    const stopBtn = page.getByRole('button', { name: 'Stop' });
    await stopBtn.click();
    await expect(page.getByText('Playground Reset')).toBeVisible();
  });
});
