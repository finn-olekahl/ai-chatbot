import { expect, test } from '@nuxt/test-utils/playwright'

test('has title', async ({ page }) => {
  await page.goto('/', { waitUntil: 'load' });

  // Expect a title to be BUGLAND - Chatbot.
  await expect(page).toHaveTitle('BUGLAND - Chatbot');
});


test('Chatbot interaction test', async ({ page }) => {
  // Navigate to the page with the chatbot (Replace with your actual URL)
  await page.goto('/', { waitUntil: 'load' });

  // Check if the chatbot is present on the page
  await expect(page.locator('text=BUGBOT Timo')).toBeVisible();

  // Click on the chat input field
  await page.click('input[placeholder="Type something..."]');

  // Type a message to the chatbot
  await page.fill('input[placeholder="Type something..."]', 'Hello, Timo!');

  // Press Enter to send the message
  await page.press('input[placeholder="Type something..."]', 'Enter');

  // Wait for the response from the chatbot
  await expect(page.locator('text=Hello')).toContainText('Hello, Timo!', { timeout: 5000 });

  // Verify the chatbot's helpful response
  //await expect(page.locator('div.chat-messages')).toContainText('Wie kann ich dir denn weiterhelfen?', { timeout: 5000 });

  // End of the test
});