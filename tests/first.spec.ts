import test, { chromium, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:4200/')
})

test.describe('Suite 1', () => {
  test('forms test', async ({ page }) => {
    await page.getByTitle('Forms').click()
  })

  test('charts test', async ({ page }) => {
    await page.getByRole('link', { name: 'Charts', exact: true }).click()
  })
})

test.describe('Suite 2', () => {
  test.beforeEach(async ({ page }) => {
    await page.getByTitle('Forms').click()
    await page.getByRole('link', { name: 'Form Layouts', exact: true }).click()
  })

  test('form elements test', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Email' }).first().click()
    await page.getByRole('button', { name: 'Sign in' }).first().click()
    await page.getByLabel('Email').first().click()
    await page.getByPlaceholder('Jane Doe').click()
    await page.getByText('Using the Grid').click()
    await page.getByTestId('SignIn').click()
    await page.getByTitle('IoT Dashboard').click()
  })

  test('get child elements', async ({ page }) => {
    await page.locator("nb-card nb-radio :text-is('Option 1')").click()
    await page
      .locator('nb-card')
      .locator('nb-radio')
      .locator(":text-is('Option 1')")
      .click()
    await page
      .locator('nb-card')
      .getByRole('button', { name: 'Sign in' })
      .first()
      .click()
    await page
      .locator('nb-card')
      .nth(3)
      .getByRole('button', { name: 'Submit' })
      .click()
  })

  test('get parent elements', async ({ page }) => {
    await page
      .locator('nb-card', { hasText: 'Using the Grid' })
      .getByRole('button', { name: 'Sign in' })
      .click()
    await page
      .locator('nb-card', { has: page.locator('#inputEmail1') })
      .getByRole('textbox', { name: 'Email' })
      .click()
    await page
      .locator('nb-card')
      .filter({ hasText: 'Basic Form' })
      .getByRole('textbox', { name: 'Email' })
      .click()
    await page
      .locator('nb-card')
      .filter({ has: page.locator('.status-danger') })
      .getByRole('textbox', { name: 'Password' })
      .click()
    await page
      .locator('nb-card')
      .filter({ has: page.locator('nb-checkbox') })
      .filter({ has: page.getByRole('button', { name: 'Sign in' }) })
      .getByRole('textbox', { name: 'Email' })
      .click()
    await page
      .locator(":text-is('Using the Grid')")
      .locator('..')
      .getByRole('textbox', { name: 'Email' })
      .click()
  })

  test('reusing locators', async ({ page }) => {
    const basicForm = page.locator('nb-card').filter({ hasText: 'Basic Form' })
    const emailField = basicForm.getByRole('textbox', { name: 'Email' })
    const passwordField = basicForm.getByRole('textbox', { name: 'Password' })
    const basicFormCheckBox = basicForm.locator('nb-checkbox')
    const basicFormSubmitButton = basicForm.getByRole('button')
    await emailField.fill('name.name@email.com')
    await passwordField.fill('my secret')
    await basicFormCheckBox.click()
    await basicFormSubmitButton.click()

    await expect(emailField).toHaveValue('name.name@email.com')
  })

  test('extract values', async ({ page }) => {
    // single value
    const basicForm = page.locator('nb-card').filter({ hasText: 'Basic Form' })
    const buttonText = await basicForm.getByRole('button').textContent()
    expect(buttonText).toEqual('Submit')

    // multiple values
    const allRadioButtonsTextContent = await page
      .locator('nb-radio')
      .allTextContents()
    console.log(allRadioButtonsTextContent)

    expect(allRadioButtonsTextContent).toContain('Option 1')

    // input value
    const emailInput = basicForm.getByRole('textbox', { name: 'Email' })
    await emailInput.fill('name@email.com')
    const emailInputTextContent = await emailInput.inputValue()
    expect(emailInputTextContent).toEqual('name@email.com')

    // placeholder value
    const placeholder = await emailInput.getAttribute('placeholder')
    expect(placeholder).toEqual('Email')
  })

  test('assertions', async ({ page }) => {
    // general assertions
    const value = 5
    expect(value).toEqual(5)

    const basicFormSubmitButton = page
      .locator('nb-card')
      .filter({ hasText: 'Basic Form' })
      .locator('button')

    const text = await basicFormSubmitButton.textContent()
    console.log(text)
    expect(text).toEqual('Submit')

    // locator assertion: not a value but a locator is in the center of the assertion, other methods
    expect(basicFormSubmitButton).toHaveText('Submit')

    // soft assertions: test will continue even after assertion failure
    await expect.soft(basicFormSubmitButton).toHaveText('Submit')
    await basicFormSubmitButton.click()
  })
})
