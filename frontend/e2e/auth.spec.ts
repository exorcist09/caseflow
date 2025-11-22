import { test, expect } from "@playwright/test";

test("User can login and reach upload page", async ({ page }) => {
  await page.goto("http://localhost:5173/upload");

  await page.getByPlaceholder("Email address").fill("caseflowtest@gmail.com");
  await page.getByPlaceholder("Password").fill("Superpass123@");

  await page.getByRole("button", { name: "Sign In" }).click();

  await page.waitForURL("**/upload");

  expect(page.url()).toContain("/upload");
});
