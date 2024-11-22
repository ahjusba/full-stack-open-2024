const { test, expect, describe, beforeEach } = require('@playwright/test')
const { before } = require('node:test')

describe('Blog app', () => {
  beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173')
  })

  test('front page can be opened', async ({ page }) => {
    const locator = await page.getByText('Blogs')
    await expect(locator).toBeVisible()
    // await expect(page.getByText('')).toBeVisible()
  })

  test('login from can be opened', async ({ page }) => {
    await page.getByTestId('username').fill('007')
    await page.getByTestId('password').fill('MI5')
    await page.getByRole('button', { name: "login"}).click()
    await expect(page.getByText('Logged in as James Bond')).toBeVisible()
  })

  describe('when logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByTestId('username').fill('007')
      await page.getByTestId('password').fill('MI5')
      await page.getByRole('button', { name: "login"}).click()
    })

    test('a new blog can be created', async ({ page }) => {
      const title = 'How to maximise your 24 hours3'
      await page.getByRole('button', { name: 'add new note' }).click()
      await page.getByTestId('title').fill(title)
      await page.getByTestId('author').fill('Jack Bauer2')
      await page.getByTestId('url').fill('www.24hours.com2')
      await page.getByRole('button', { name: "Create" }).click()
      await expect(page.getByText(`Added new blog: ${title}`)).toBeVisible()
    
    })
  })
})
