import { test, expect } from '@playwright/test';

test.describe('Canvas Shortcuts, History, & React Flow Controllers E2E', () => {
  test('handles Ctrl+S save, Shift+Delete, Ctrl+Z undo, theme toggle, and minimap controls', async ({ page }) => {
    await page.goto('/?project=proj-starter');

    // 1. Verify React Flow default controllers (MiniMap removed, Controls visible)
    await expect(page.locator('.react-flow__minimap')).not.toBeVisible();
    await expect(page.locator('.react-flow__controls')).toBeVisible();

    // Verify canvas panning with drag
    const pane = page.locator('.react-flow__pane');
    const initialTransform = await page.locator('.react-flow__viewport').getAttribute('style');
    await pane.dragTo(pane, { sourcePosition: { x: 200, y: 200 }, targetPosition: { x: 300, y: 300 } });
    const movedTransform = await page.locator('.react-flow__viewport').getAttribute('style');
    expect(movedTransform).not.toEqual(initialTransform);

    // 2. Test Ctrl + S to save project
    await page.locator('.react-flow__pane').click();
    await page.keyboard.press('Control+s');
    await expect(page.getByText('Project Saved')).toBeVisible();

    // 3. Test Theme Toggle (monochrome LuContrast icon, no yellow sun emoji)
    const themeBtn = page.getByRole('button', { name: 'Toggle Theme' });
    await expect(themeBtn).toBeVisible();
    await themeBtn.click();
    await expect(page.getByText('LIGHT', { exact: false })).toBeVisible();
    // Switch back to Dark
    await themeBtn.click();
    await expect(page.getByText('DARK', { exact: false })).toBeVisible();

    // 4. Test Shift + Delete component deletion
    const ec2Node = page.locator('.react-flow__node').filter({ hasText: 'Production Web Server' }).first();
    await expect(ec2Node).toBeVisible();
    await ec2Node.click();

    // Press Shift+Delete to delete the selected node
    await page.keyboard.press('Shift+Delete');
    await expect(page.getByText('Component Deleted')).toBeVisible();
    await expect(ec2Node).not.toBeVisible();

    // 5. Test Ctrl + Z to Undo deletion
    await page.keyboard.press('Control+z');
    await expect(page.locator('.react-flow__node').filter({ hasText: 'Production Web Server' }).first()).toBeVisible();
  });
});
