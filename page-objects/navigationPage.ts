import { Locator, Page } from '@playwright/test'
import { HelperBase } from './helperBase'

export class NavigationPage extends HelperBase {
  readonly formLayoutMenuItem: Locator
  readonly datePickerMenuItem: Locator
  readonly smartTableMenuItem: Locator
  readonly toastrMenuItem: Locator
  readonly tooltipMenuItem: Locator

  constructor (page: Page) {
    super(page)
    this.formLayoutMenuItem = page.getByText('Form Layouts')
    this.datePickerMenuItem = page.getByText('Datepicker')
    this.smartTableMenuItem = page.getByText('Smart Table')
    this.toastrMenuItem = page.getByText('Toastr')
    this.tooltipMenuItem = page.getByText('Tooltip')
  }

  async formsLayoutPage () {
    await this.selectGroupMenuItem('Forms')
    await this.formLayoutMenuItem.click()
    await this.page.waitForURL('**/pages/forms/layouts')
    await this.waitForNumberOfSeconds(1)
  }

  async datePickerPage () {
    await this.selectGroupMenuItem('Forms')
    await this.datePickerMenuItem.click()
    await this.page.waitForURL('**/pages/forms/datepicker')
  }

  async smartTablePage () {
    await this.selectGroupMenuItem('Tables & Data')
    await this.smartTableMenuItem.click()
    await this.page.waitForURL('**/pages/tables/smart-table')
  }

  async toastrPage () {
    await this.selectGroupMenuItem('Modal & Overlays')
    await this.toastrMenuItem.click()
    await this.page.waitForURL('**pages/modal-overlays/toastr')
  }

  async toolTipPage () {
    await this.selectGroupMenuItem('Modal & Overlays')
    await this.tooltipMenuItem.click()
    await this.page.waitForURL('**/pages/modal-overlays/tooltip')
  }

  private async selectGroupMenuItem (groupItemTitle: string) {
    const groupMenuItem = this.page.getByTitle(groupItemTitle)
    const expanded = await groupMenuItem.getAttribute('aria-expanded')

    if (expanded == 'false') {
      groupMenuItem.click()
    }
  }
}
