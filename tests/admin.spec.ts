import { expect, test } from '@nuxt/test-utils/playwright'


test('admin dashboard test', async ({ page }) => {
  await page.goto('http://localhost:3000/admin/login', { waitUntil: 'load' });

  await expect(page.getByRole('heading', { name: 'SIGN IN.' })).toBeVisible();

  await page.getByPlaceholder('E-mail').click();
  await page.getByPlaceholder('E-mail').fill('admin@bugland.com');
  await page.getByPlaceholder('Password').click();
  await page.getByPlaceholder('Password').fill('123456');

  await page.getByRole('button', { name: 'Sign In' }).click();

  await expect(page.getByRole('heading', { name: 'Admin Dashboard' })).toBeVisible({ timeout: 150000 });
  await page.getByRole('button', { name: 'LOGOUT' }).click();

  await expect(page.getByText('BUGBOT Timo')).toBeVisible({ timeout: 150000 });

});