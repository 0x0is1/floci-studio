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

// Native HTML5 dataTransfer drop, dispatched manually (locator.dragTo() is mouse-only and
// unreliable against this app's onDrop handler reading event.dataTransfer).
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

test.describe('ECS inspector parity E2E', () => {
  test('ECS config form exposes cluster/launch/image fields and real env injection like EC2/Lambda', async ({ page }) => {
    await page.goto('/?project=proj-starter');
    const stopBtn = page.getByRole('button', { name: 'Stop' });
    if (await stopBtn.isEnabled()) { await stopBtn.click(); await page.waitForTimeout(1000); }

    const ec2Node = page.locator('.react-flow__node').filter({ hasText: /Web Server/i }).first();
    await expect(ec2Node).toBeVisible();

    await dropPaletteItem(page, 'ECS Container', 800, 450);

    const ecsNode = page.locator('.react-flow__node').filter({ hasText: 'ECS Container' }).first();
    await expect(ecsNode).toBeVisible();
    await ecsNode.click();

    await expect(page.getByText('Cluster Name')).toBeVisible();
    await expect(page.getByText('Launch Type')).toBeVisible();
    await expect(page.getByText('Container Image')).toBeVisible();
    await page.waitForTimeout(300);

    // Wire ECS -> S3 (its resource/BOTTOM dependency) to prove env var injection parity with EC2/Lambda.
    const s3Node = page.locator('.react-flow__node').filter({ hasText: /Bucket/i }).first();
    await dragHandleToHandle(
      page,
      ecsNode.locator('.react-flow__handle-bottom').first(),
      s3Node.locator('.react-flow__handle-left').first(),
    );
    await expect(page.getByText('Connection Configured')).toBeVisible();

    await ecsNode.click();
    await expect(page.getByText('Injected Environment Variables')).toBeVisible();
    await expect(page.getByText('S3_BUCKET_NAME=')).toBeVisible();
  });
});
