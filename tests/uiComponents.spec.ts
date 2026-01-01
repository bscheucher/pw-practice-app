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

  await page
    .getByRole('table')
    .locator('tr', { hasText: 'mdo@gmail.com' })
    .locator('.nb-trash')
    .click()

  page.on('dialog', dialog => {
    expect(dialog.message).toEqual('Are you sure you want to delete?')
    dialog.accept()
  })

  await expect(page.locator('table tr').first()).not.toHaveText('mdo@gmail.com')
  const txtContent = await page.locator('table tr').first().textContent()
  console.log(txtContent)
})

test('web tables', async ({ page }) => {
  await page.getByText('Tables & Data').click()
  await page.getByText('Smart Table').click()

  // get the row by any text in the row
  const targetRow = page.getByRole('row', { name: 'twitter@outlook.com' })
  await targetRow.locator('.nb-edit').click()
  await page.locator('input-editor').getByPlaceholder('Age').clear()
  await page.locator('input-editor').getByPlaceholder('Age').fill('35')
  await page.locator('.nb-checkmark').click()

  // get the row based on the value in the specific column
  await page.locator('.ng2-smart-pagination-nav').getByText('2').click()
  const targetRowById = page
    .getByRole('row', { name: '11' })
    .filter({ has: page.locator('td').nth(1).getByText('11') })
  await targetRowById.locator('.nb-edit').click()
  await page.locator('input-editor').getByPlaceholder('E-mail').clear()
  await page
    .locator('input-editor')
    .getByPlaceholder('E-mail')
    .fill('test@email.com')
  await page.locator('.nb-checkmark').click()
  await expect(targetRowById.locator('td').nth(5)).toHaveText('test@email.com')

  // test filter of the table
  const ages = ['20', '30', '40', '200']

  for (let age of ages) {
    await page.locator('input-filter').getByPlaceholder('Age').clear()
    await page.locator('input-filter').getByPlaceholder('Age').fill(age)
    await page.waitForTimeout(500)

    const ageRows = page.locator('tbody tr')

    for (let row of await ageRows.all()) {
      const cellValue = await row.locator('td').last().textContent()

      if (age == '200') {
        expect(await page.getByRole('table').textContent()).toContain(
          'No data found'
        )
      } else {
        expect(cellValue).toEqual(age)
      }
    }
  }
})
test('date picker', async ({ page }) => {
  await page.getByTitle('Forms').click()
  await page.getByRole('link', { name: 'Datepicker', exact: true }).click()

  const calendarInputField = page.getByPlaceholder('Form Picker')
  await calendarInputField.click()

  let date: Date = new Date()
  const givenDate: Date = new Date(date.setDate(date.getDate() + 1))
  const shortMonth = givenDate
    .toLocaleString('en-US', { month: 'short' })
    .toString()

  const longMonth = givenDate
    .toLocaleString('en-US', { month: 'long' })
    .toString()
  const day = givenDate.getDate().toString()
  const year = givenDate.getFullYear().toString()
  const monthYear = ` ${longMonth} ${year}`
  const expectedDate = `${shortMonth} ${day}, ${year}`

  let calendarMonthYear = await page
    .locator('nb-calendar-view-mode')
    .textContent()

  while (!(await calendarMonthYear).includes(monthYear)) {
    await page
      .locator('nb-calendar-pageable-navigation [data-name="chevron-right"]')
      .click()
    calendarMonthYear = await page
      .locator('nb-calendar-view-mode')
      .textContent()
  }

  await page
    .locator('[class="day-cell ng-star-inserted"]')
    .getByText(day, { exact: true })
    .click()

  await expect(calendarInputField).toHaveValue(expectedDate)
})

test('sliders', async ({ page }) => {
  // update attribute
  const temperatureGauge = page.locator(
    '[tabtitle="Temperature"] ngx-temperature-dragger circle'
  )
  await temperatureGauge.evaluate(node => {
    node.setAttribute('cx', '232.630')
    node.setAttribute('cy', '232.630')
  })
  await temperatureGauge.click()

  // mouse movement
  const temperatureBox = page.locator(
    '[tabtitle="Temperature"] ngx-temperature-dragger'
  )
  await temperatureBox.scrollIntoViewIfNeeded()
  const box = await temperatureBox.boundingBox()
  const x = (box.x = box.x + box.width / 2)
  const y = (box.y = box.y + box.height / 2)

  await page.mouse.move(x, y)
  // click mouse button
  await page.mouse.down()
  await page.mouse.move(x + 100, y)
  await page.mouse.move(x + 100, y + 100)
  // release mouse button
  await page.mouse.up()
  await expect(temperatureBox).toContainText('30')
})

