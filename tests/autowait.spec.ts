import test, { chromium, expect } from '@playwright/test'

test.describe('autowaiting suite', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://uitestingplayground.com/ajax')
    await page.getByText('Button Triggering AJAX Request').click()
  })

  test('autowaiting', async ({ page }) => {
    const success = page.locator('.bg-success')

    // await success.click();
    // const text = await success.first().textContent();

    // await success.waitFor({state: "attached"});

    //const text = await success.allTextContents();
    // expect(text).toEqual("Data loaded with AJAX get request.");
    // expect(text).toContain("Data loaded with AJAX get request.");

    await expect(success).toHaveText('Data loaded with AJAX get request.', {
      timeout: 20000
    })
  })

  test('alternative waits', async ({ page }) => {
    const success = page.locator('.bg-success')

    // wait for selector
    // await page.waitForSelector('.bg-success')

    // wait for particular response
    //await page.waitForResponse('http://uitestingplayground.com/ajaxdata')

    // wait for network calls to be completed - not recomemnded
    await page.waitForLoadState('networkidle')

    const text = await success.allTextContents()

    expect(text).toContain('Data loaded with AJAX get request.')
  })

  test('timeouts', async ({ page }) => {
    test.setTimeout(10000)
    test.slow()
    const success = page.locator('.bg-success')
    await success.click({ timeout: 16000 })
  })
})
