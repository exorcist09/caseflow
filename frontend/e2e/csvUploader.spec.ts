import { test, expect } from '@playwright/test';

test.describe('CSV Uploader', () => {
  
  test.beforeEach(async ({ page }) => {
    // 1. Navigate to upload page
    await page.goto('http://localhost:5173/upload');

    const heading = page.locator('h2', { hasText: 'Import Cases' });
    
    try {
      await heading.waitFor({ state: 'visible', timeout: 3000 });
    } catch (e) {

      console.log('Not on Upload page. Attempting Login...');
      await page.goto('http://localhost:5173/login');
      await page.fill('input[type="email"]', 'test@example.com'); // Update selector if needed
      await page.fill('input[type="password"]', 'password');      // Update selector if needed
      await page.click('button[type="submit"]');
      await page.waitForURL('**/upload', { timeout: 5000 }); // Ensure we get back to upload
    }
  });

  test('should show drag & drop area', async ({ page }) => {
    // We look for the text inside the drop zone to confirm it rendered
    // Note: This text must match exactly what is in your <CSVUploader> component
    const dropZone = page.locator('div', { hasText: 'Supports files up to' });
    await expect(dropZone).toBeVisible();
  });

  test('should allow uploading a CSV file', async ({ page }) => {

    const filePath = './e2e/cleanCSV.csv';
    
    const input = page.locator('input[type="file"]');
    await input.setInputFiles(filePath);

    await expect(page.getByText('sample-cases.csv')).toBeVisible();
  });

  test('should show validation errors after upload', async ({ page }) => {
    // FIX: Use string path
    const filePath = './e2e/errorsCSV.csv';
    
    const input = page.locator('input[type="file"]');
    await input.setInputFiles(filePath);

    // Check for the error message
    await expect(page.locator('text=Error')).toBeVisible();
  });
});