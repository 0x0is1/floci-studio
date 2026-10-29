import { test, expect } from '@playwright/test';

test.describe('Node Tail Branching & Valid Next Nodes E2E', () => {
  test('hovers on tail, displays + button, filters valid next nodes, and branches canvas', async ({ page }) => {
    await page.goto('/?project=proj-starter');

    // Locate EC2 node on canvas
    const ec2Node = page.locator('.react-flow__node').filter({ hasText: 'Production Web Server' });
    await expect(ec2Node).toBeVisible();

    const stopBtn = page.getByRole('button', { name: 'Stop' });
    if (await stopBtn.isEnabled()) {
      await stopBtn.click();
      await page.waitForTimeout(1000);
    }

    // Deploy button initially enabled (not deployed yet)
    const deployBtn = page.getByRole('button', { name: 'Deploy' });
    await expect(deployBtn).toBeEnabled({ timeout: 10000 });
    await expect(stopBtn).toBeDisabled();

    // Hover over node to reveal tail add button
    await ec2Node.hover();
    const addBtn = ec2Node.getByTitle('Add connected AWS resource');
    await expect(addBtn).toBeVisible();

    // Click the tail add button
    await addBtn.click();

    // Menu should open displaying only valid downstream AWS targets
    await expect(page.getByText('Next Valid AWS Nodes')).toBeVisible();

    // For EC2: S3, RDS, DynamoDB, SQS are valid; VPC and ALB are NOT allowed
    await expect(page.locator('.react-flow__node').getByText('S3 Bucket', { exact: false })).toBeVisible();
    await expect(page.locator('.react-flow__node').getByText('Virtual Private Cloud')).not.toBeVisible();

    // Select S3 Bucket to branch
    const s3Option = page.locator('.react-flow__node button').filter({ hasText: 'S3 Bucket' }).first();
    await s3Option.click();

    // Verify toast notification for architectural branching
    await expect(page.getByText('Architecture Branched')).toBeVisible();

    // Verify a new S3 node exists
    await expect(page.locator('.react-flow__node').filter({ hasText: 'S3 Bucket' }).first()).toBeVisible();
  });
});

