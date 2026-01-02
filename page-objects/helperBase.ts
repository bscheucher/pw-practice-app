import { Page } from '@playwright/test'

export class HelperBase {
  page: Page

  constructor (page: Page) {
    this.page = page
  }

  async waitForNumberOfSeconds(numberOfSeconds: number){
    await this.page.waitForTimeout(numberOfSeconds*1000)
  }
}
