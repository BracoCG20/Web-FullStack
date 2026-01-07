const { defineConfig } = require("@playwright/test");

module.exports = defineConfig({
	testDir: "./tests", // Carpeta donde buscaremos los tests
	// Solo correr archivos que terminen en .spec.js (para no confundirse con los de Jest)
	testMatch: "**/*.spec.js",
	timeout: 30000,
	use: {
		baseURL: "http://localhost:4001", // Tu puerto local
		trace: "on-first-retry", // Si falla, guarda un reporte visual
		screenshot: "only-on-failure", // Toma foto si falla
	},

	// Esto es CLAVE: Playwright encenderá tu servidor automáticamente
	webServer: {
		command: "npm start",
		url: "http://localhost:4001",
		reuseExistingServer: !process.env.CI,
		timeout: 120 * 1000,
	},
});
