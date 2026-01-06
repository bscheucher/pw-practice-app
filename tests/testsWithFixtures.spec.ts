import { test } from '../test-options'
import { faker } from '@faker-js/faker'

test.describe('Fixtures', () => {
  test('parametrized methods', async ({ pageManager }) => {
    const randomFirstName = faker.person.firstName()
    const randomLastName = faker.person.lastName()
    const randomFullName = faker.person.fullName({
      firstName: randomFirstName,
      lastName: randomLastName
    })
    const randomEmail = faker.internet.email({
      firstName: randomFirstName,
      lastName: randomLastName
    })

    await pageManager
      .onFormLayoutPage()
      .submitUsingTheGridFormWithCredentialAndSelectOption(
        `${randomEmail}`,
        'my secret',
        'Option 1'
      )
    await pageManager
      .onFormLayoutPage()
      .submitInlineFormWithNameEmailAndCheckBox(
        `${randomFullName}`,
        `${randomEmail}`,
        true
      )
  })
})
