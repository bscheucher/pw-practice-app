import test, { expect } from '@playwright/test'
import { PageManager } from '../page-objects/pageManager'


test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4200/')
    
  })

  test('navigate to form page', async ({ page }) => {
    const pm: PageManager = new PageManager(page)
    await pm.navigateTo().formsLayoutPage()

    expect(page.url()).toBe('http://localhost:4200/pages/forms/layouts')
  })

  test('navigate to date picker page', async ({ page }) => {
    const pm: PageManager = new PageManager(page)
    await pm.navigateTo().datePickerPage()
    expect(page.url()).toBe('http://localhost:4200/pages/forms/datepicker')
  })

  test('navigate to date smart table page', async ({ page }) => {
    const pm: PageManager = new PageManager(page)
    await pm.navigateTo().smartTablePage()
    expect(page.url()).toBe('http://localhost:4200/pages/tables/smart-table')
  })
  test('navigate to date toastr page', async ({ page }) => {
   const pm: PageManager = new PageManager(page)
    await pm.navigateTo().toastrPage()
    expect(page.url()).toBe('http://localhost:4200/pages/modal-overlays/toastr')
  })
  test('navigate to tooltip page', async ({ page }) => {
    const pm: PageManager = new PageManager(page)
    await pm.navigateTo().toolTipPage()
    expect(page.url()).toBe(
      'http://localhost:4200/pages/modal-overlays/tooltip'
    )
  })

  test('parametrized methods', async ({ page }) => {
    const pm: PageManager = new PageManager(page)
   
    await pm.navigateTo().formsLayoutPage()
    await pm.onFormLayoutPage().submitUsingTheGridFormWithCredentialAndSelectOption('test@email.com', 'my secret', 'Option 1')
    await pm.onFormLayoutPage().submitInlineFormWithNameEmailAndCheckBox('Ano Nym', 'ano.nym@test.com', true)
    await pm.navigateTo().datePickerPage()
    await pm.onDatePickerPage().selectCommonDatePickerDateFromToday(14)
    await pm.onDatePickerPage().selectDatepickerWithRangeFromToday(6, 10)
  })
})
