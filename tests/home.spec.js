const { test, expect } = require("@playwright/test");

test.describe("Pruebas Visuales del Home", () => {
	// Antes de cada test, ir a la página de inicio
	test.beforeEach(async ({ page }) => {
		await page.goto("/");
	});

	test("El título de la página debe ser correcto", async ({ page }) => {
		// Verificar que el título de la pestaña del navegador sea el esperado
		await expect(page).toHaveTitle(/Inicio - Grupo SP/);
	});

	test('Debe navegar a la versión en Inglés al hacer clic en "EN"', async ({
		page,
	}) => {
		// 1. Buscar el botón "EN" en el sidebar (versión escritorio o móvil)
		// Usamos un selector CSS específico para el enlace del sidebar
		const btnEnglish = page.locator(".sidebar__language", { hasText: "EN" });

		// 2. Si el sidebar está oculto (móvil), primero abrimos el menú
		if (await page.locator("#btnMenu").isVisible()) {
			await page.click("#btnMenu");
		}

		// 3. Hacer clic en EN
		await btnEnglish.click();

		// 4. Verificar que la URL cambió a /en
		await expect(page).toHaveURL(/.*\/en/);

		// 5. Verificar que el título ahora está en inglés
		await expect(page).toHaveTitle(/Home - Grupo SP/);
	});

	test("El formulario de contacto debe estar visible", async ({ page }) => {
		// Navegar a la sección de contacto
		await page.goto("/contacto");

		// Verificar que el input de nombre sea visible
		const inputNombre = page.locator('input[name="nombre"]');
		await expect(inputNombre).toBeVisible();

		// Verificar que el botón de enviar exista
		const btnEnviar = page.locator('button[type="submit"]');
		await expect(btnEnviar).toBeVisible();
	});
});
