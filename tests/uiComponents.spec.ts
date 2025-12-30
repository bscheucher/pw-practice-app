import test, { chromium, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:4200/')
})

test.describe('Form Layouts Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.getByTitle('Forms').click()
    await page.getByRole('link', { name: 'Form Layouts', exact: true }).click()
  })

  test('input fields', async ({ page }) => {
    const emailInputField = page
      .locator('nb-card', { hasText: 'Using the Grid' })
      .getByRole('textbox', { name: 'Email' })

    await emailInputField.fill('test@email.com')
    await emailInputField.clear()
    await emailInputField.pressSequentially('test@email.com', {
      delay: 500,
      timeout: 10000
    })

    // generic assertions
    const emailInputFieldValue = await emailInputField.inputValue()
    expect(emailInputFieldValue).toEqual('test@email.com')

    // locator assertions
    await expect(emailInputField).toHaveValue('test@email.com')
  })

  test('radio buttons', async ({ page }) => {
    const usingGridForm = page.locator('nb-card', { hasText: 'Using the Grid' })
    await usingGridForm.getByLabel('Option 1').check({ force: true })
    await usingGridForm
      .getByRole('radio', { name: 'Option 2' })
      .check({ force: true })

    const isRadioButton1Checked = await usingGridForm
      .getByLabel('Option 1')
      .isChecked()
    const isRadioButton2Checked = await usingGridForm
      .getByRole('radio', { name: 'Option 2' })
      .isChecked()

    expect(isRadioButton1Checked).toBeFalsy()
    expect(isRadioButton2Checked).toBeTruthy()

    await expect(usingGridForm.getByLabel('Option 1')).not.toBeChecked()
    await expect(
      usingGridForm.getByRole('radio', { name: 'Option 2' })
    ).toBeChecked()
  })
})

test('checkboxes', async ({ page }) => {
  await page.getByText('Modal & Overlays').click()
  await page.getByText('Toastr').click()

  await page
    .getByRole('checkbox', { name: 'Hide on click' })
    .uncheck({ force: true })

  await page
    .getByRole('checkbox', { name: 'Prevent arising of duplicate toast' })
    .check({ force: true })

  const allBoxes = page.getByRole('checkbox')
  for (const box of await allBoxes.all()) {
    await box.uncheck({force: true})
    expect(await box.isChecked()).toBeFalsy()
  }
})

test("lists and dropdowns", async ({page}) => {
  
})
