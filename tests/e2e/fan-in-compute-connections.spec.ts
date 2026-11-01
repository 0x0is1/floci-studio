import { test, expect, Page, Locator } from '@playwright/test';
import { resetStarterFixture } from './helpers/resetStarterFixture';

test.beforeEach(() => resetStarterFixture());

async function dragHandleToHandle(page: Page, source: Locator, target: Locator) {
  const from = await source.boundingBox();
  const to = await target.boundingBox();
  if (!from || !to) throw new Error('Handle not visible for drag');
  await page.mouse.move(from.x + from.width / 2, from.y + from.height / 2);
  await page.mouse.down();
  await page.mouse.move(to.x + to.width / 2, to.y + to.height / 2, { steps: 12 });
  await page.mouse.up();
}

// Playwright's locator.dragTo() simulates mouse-only movement and is unreliable against this
// app's native HTML5 dataTransfer drop handler; dispatch a real DataTransfer manually instead
// (the documented Playwright workaround for apps that read event.dataTransfer on drop).
async function dropPaletteItem(page: Page, itemName: string, dropX: number, dropY: number) {
  await page.getByPlaceholder('Search components...').fill(itemName);
  const card = page.locator('[draggable="true"]').filter({ hasText: itemName }).first();
  await expect(card).toBeVisible();
  const box = (await card.boundingBox())!;
  await page.evaluate(
    ({ sx, sy, tx, ty }) => {
      const source = document.elementFromPoint(sx, sy) as HTMLElement;
      const target = document.querySelector('.react-flow__pane') as HTMLElement;
      const dt = new DataTransfer();
      const fire = (el: HTMLElement, type: string, x: number, y: number) => {
        const ev = new DragEvent(type, { bubbles: true, cancelable: true, clientX: x, clientY: y });
        Object.defineProperty(ev, 'dataTransfer', { value: dt });
        el.dispatchEvent(ev);
      };
      fire(source, 'dragstart', sx, sy);
      fire(target, 'dragenter', tx, ty);
      fire(target, 'dragover', tx, ty);
      fire(target, 'drop', tx, ty);
      fire(source, 'dragend', tx, ty);
    },
    { sx: box.x + box.width / 2, sy: box.y + box.height / 2, tx: dropX, ty: dropY },
  );
  // The drop auto-selects the new node, which swaps the sidebar to the inspector (search box
  // disappears), so there is nothing left to clear here.
}

test.describe('Compute-to-compute and fan-in connection E2E', () => {
  test('connects two compute nodes directly via the right/top peer handles', async ({ page }) => {
    await page.goto('/?project=proj-starter');
    const stopBtn = page.getByRole('button', { name: 'Stop' });
    if (await stopBtn.isEnabled()) { await stopBtn.click(); await page.waitForTimeout(1000); }

    const ec2Node = page.locator('.react-flow__node').filter({ hasText: /Web Server/i }).first();
    await expect(ec2Node).toBeVisible();

    await dropPaletteItem(page, 'Lambda Function', 800, 500);
    const lambdaNode = page.locator('.react-flow__node').filter({ hasText: 'Lambda Function' }).first();
    await expect(lambdaNode).toBeVisible();
    await page.waitForTimeout(300);

    await dragHandleToHandle(
      page,
      ec2Node.locator('.react-flow__handle-right').first(),
      lambdaNode.locator('.react-flow__handle-top').first(),
    );

    await expect(page.getByText('Connection Configured')).toBeVisible();
  });

  test('fans in two independent ingress sources onto the same EC2 node', async ({ page }) => {
    await page.goto('/?project=proj-starter');
    const stopBtn = page.getByRole('button', { name: 'Stop' });
    if (await stopBtn.isEnabled()) { await stopBtn.click(); await page.waitForTimeout(1000); }

    // CloudFront -> ec2-1 already exists in the starter fixture as the first ingress source.
    const ec2Node = page.locator('.react-flow__node').filter({ hasText: /Web Server/i }).first();
    await expect(ec2Node).toBeVisible();

    await dropPaletteItem(page, 'Client', 800, 650);
    const clientNode = page.locator('.react-flow__node').filter({ hasText: 'Client' }).first();
    await expect(clientNode).toBeVisible();
    await page.waitForTimeout(300);

    await dragHandleToHandle(
      page,
      clientNode.locator('.react-flow__handle-right').first(),
      ec2Node.locator('.react-flow__handle-top').first(),
    );

    // Second independent ingress edge accepted onto the same compute node: a true fan-in.
    await expect(page.getByText('Connection Configured')).toBeVisible();
  });
});
