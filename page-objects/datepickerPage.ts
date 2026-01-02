import { expect, Locator, Page } from '@playwright/test'

export class DatepickerPage {
  private readonly page: Page
  constructor (page: Page) {
    this.page = page
  }

  async selectCommonDatePickerDateFromToday (numberOfDaysFromToday: number) {
    const calendarInputField = this.page.getByPlaceholder('Form Picker')
    await calendarInputField.click()
    const dateToAssert = await this.selectDateinCalendar(numberOfDaysFromToday)
    await expect(calendarInputField).toHaveValue(dateToAssert)
  }

  async selectDatepickerWithRangeFromToday (
    startDayFromToday: number,
    endDayFromToday: number
  ) {
    const calendarInputField = this.page.getByPlaceholder('Range Picker')
    await calendarInputField.click()
    const startDay = await this.selectDateinCalendar(startDayFromToday)
    const endDay = await this.selectDateinCalendar(endDayFromToday)
    const dateToAssert = `${startDay} - ${endDay}`
    await expect(calendarInputField).toHaveValue(dateToAssert)
  }

  private async selectDateinCalendar (numberOfDaysFromToday: number) {
    let date: Date = new Date()
    const givenDate: Date = new Date(
      date.setDate(date.getDate() + numberOfDaysFromToday)
    )
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

    let calendarMonthYear = await this.page
      .locator('nb-calendar-view-mode')
      .textContent()

    while (!calendarMonthYear.includes(monthYear)) {
      await this.page
        .locator('nb-calendar-pageable-navigation [data-name="chevron-right"]')
        .click()
      calendarMonthYear = await this.page
        .locator('nb-calendar-view-mode')
        .textContent()
    }

    await this.page
      .locator('.day-cell.ng-star-inserted')
      .getByText(day, { exact: true })
      .click()

    return expectedDate
  }
}
