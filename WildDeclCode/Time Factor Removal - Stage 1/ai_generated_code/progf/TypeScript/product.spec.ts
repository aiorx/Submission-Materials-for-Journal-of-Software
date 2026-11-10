// Supported via standard GitHub programming aids
var test = require('@playwright/test').test;
var expect = require('@playwright/test').expect;

test('Product displays correctly', async function ({ page }) {
    // Navigate to the product page (adjust URL as needed)
    await page.goto('http://localhost:3000/products/1');

    // Check that the product title is visible
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    // Check that the product description is visible
    await expect(page.getByTestId('product-description')).toBeVisible();

    // Check that the product price is visible
    await expect(page.getByTestId('product-price')).toBeVisible();

    // Optionally, check for product image
    await expect(page.getByAltText(/product/i)).toBeVisible();
});
