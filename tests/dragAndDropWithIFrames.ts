import test, { chromium, expect } from '@playwright/test'

test('drag and drop with iframe', async ({page}) => {
    await page.goto('https://www.globalsqa.com/demo-site/draganddrop/')

    await page.locator('li', {hasText: "High Tatras"}).click()
})