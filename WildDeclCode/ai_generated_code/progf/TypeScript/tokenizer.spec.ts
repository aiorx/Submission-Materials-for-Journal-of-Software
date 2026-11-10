// Assisted using common GitHub development utilities
import { test, expect } from '@playwright/test';

test('Tokenizer renders correctly', async ({ page }) => {
    // Go to the page where Tokenizer is rendered (adjust path if needed)
    await page.goto('http://localhost:3000/');

    // Check for the main heading
    await expect(page.getByRole('heading', { name: /tokenizer/i })).toBeVisible();

    // Check for the model selection buttons
    await expect(page.getByRole('button', { name: /gpt-4o/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /gpt-3.5/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /gpt-3 \(legacy\)/i })).toBeVisible();

    // Check for the textarea with the example text
    await expect(page.getByPlaceholder('Enter text here...')).toHaveValue('300000');

    // Check for the "Clear" and "Show example" buttons
    await expect(page.getByRole('button', { name: /clear/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /show example/i })).toBeVisible();

    // Check for the tokens and characters count
    await expect(page.getByText('Tokens')).toBeVisible();
    await expect(page.getByText('Characters')).toBeVisible();

    // Check that at least one token is rendered
    await expect(page.locator('span', { hasText: '300000' })).toBeVisible();
});
