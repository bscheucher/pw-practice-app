import { Locator, Page } from '@playwright/test'

export class FormLayoutsPage {
  page: Page
  constructor (page: Page) {
    this.page = page
  }

  /**
   * 
   * @param email 
   * @param password 
   * @param optionText 
   */
  async submitUsingTheGridFormWithCredentialAndSelectOption (
    email: string,
    password: string,
    optionText: string
  ) {
    const usingGridForm = this.page.locator('nb-card', {
      hasText: 'Using the Grid'
    })
    await usingGridForm.getByRole('textbox', { name: 'Email' }).fill(email)
    await usingGridForm
      .getByRole('textbox', { name: 'Password' })
      .fill(password)
    await usingGridForm
      .getByRole('radio', { name: optionText })
      .check({ force: true })
    await usingGridForm.getByRole('button').click()
  }

  /**
   * 
   * @param name 
   * @param email 
   * @param rememberMe 
   */
  async submitInlineFormWithNameEmailAndCheckBox (
    name: string,
    email: string,
    rememberMe: boolean
  ) {
    const inlineForm = this.page.locator('nb-card', {
      hasText: 'Inline Form'
    })
    await inlineForm.getByRole('textbox', { name: 'Jane Doe' }).fill(name)
    await inlineForm.getByRole('textbox', { name: 'Email' }).fill(email)
    if (rememberMe) {
      await inlineForm.getByRole('checkbox').check({ force: true })
    }
    await inlineForm.getByRole('button').click()
  }
}
