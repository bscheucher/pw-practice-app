import { Attribute } from '@angular/core'
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
    await box.uncheck({ force: true })
    expect(await box.isChecked()).toBeFalsy()
  }
})

test('lists and dropdowns', async ({ page }) => {
  const dropdownMenu = page.locator('ngx-header nb-select')
  const header = page.locator('nb-layout-header')
  const optionList = page.locator('nb-option-list nb-option')

  // await dropdownMenu.click()

  // page.getByRole('list') when ul tag
  // page.getByRole('list-item') when li tag

  // const optionList = page.getByRole('list').locator('nb-option');

  // await expect(optionList).toHaveText(['Light', 'Dark', 'Cosmic', 'Corporate'])
  // await optionList.getByText('Dark').click()
  // await page.screenshot({ path: 'dark-clicked.png', fullPage: true })
  // await expect(header).toHaveCSS('background-color', 'rgb(34, 43, 69)')

  const colors = {
    Light: 'rgb(255, 255, 255)',
    Dark: 'rgb(34, 43, 69)',
    Cosmic: 'rgb(50, 50, 89)',
    Corporate: 'rgb(255, 255, 255)'
  }

  await dropdownMenu.click()
  for (const color in colors) {
    await optionList.filter({ hasText: color }).click()
    await expect(header).toHaveCSS('background-color', colors[color])
    if (color !== 'Corporate') {
      await dropdownMenu.click()
    }
  }
})

test('tooltips', async ({ page }) => {
  await page.getByText('Modal & Overlays').click()
  await page.getByText('Tooltip').click()

  const tooltipCard = page.locator('nb-card', { hasText: 'Tooltip' })
  await tooltipCard.getByRole('button', { name: 'Top' }).hover()
  const tooltip = await page.locator('nb-tooltip').textContent()

  expect(tooltip).toEqual('This is a tooltip')
})

test('dialog box', async ({ page }) => {
  await page.getByText('Tables & Data').click()
  await page.getByText('Smart Table').click()

  
})
