import { expect, test } from '@playwright/test'

test.describe('EventHub', () => {
    test('deve carregar a home e navegar para a busca', async ({ page }) => {
        await page.goto('/')

        await expect(
            page.getByRole('heading', { name: /descubra eventos incríveis perto de você/i })
        ).toBeVisible()

        await expect(
            page.getByRole('link', { name: /explorar eventos/i })
        ).toBeVisible()

        await Promise.all([
            page.waitForURL(/\/busca/),
            page.getByRole('link', { name: /explorar eventos/i }).click(),
        ])

        await expect(
            page.getByRole('heading', { name: /buscar eventos/i })
        ).toBeVisible()
    })

    test('deve abrir os filtros da busca e exibir os campos avançados', async ({ page }) => {
        await page.goto('/busca')

        await page.getByRole('button', { name: /filtros/i }).click()

        await expect(page.getByLabel(/cidade/i)).toBeVisible()
        await expect(page.getByLabel(/categoria/i)).toBeVisible()
        await expect(page.getByLabel(/data início/i)).toBeVisible()
        await expect(page.getByLabel(/data fim/i)).toBeVisible()
    })
})