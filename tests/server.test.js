const request = require("supertest");

// CAMBIO CLAVE: Renombramos la variable para que empiece con "mock"
const mockSendMail = jest.fn();

// Ahora Jest permite usar esta variable dentro del factory porque empieza con "mock"
jest.mock("nodemailer", () => ({
	createTransport: jest.fn().mockReturnValue({
		sendMail: mockSendMail,
	}),
}));

const app = require("../server");

describe("Pruebas del Servidor (Backend)", () => {
	beforeEach(() => {
		// Limpiamos el mock usando el nuevo nombre
		mockSendMail.mockClear();
	});

	test("GET / debe responder con status 200 (HTML)", async () => {
		const response = await request(app).get("/");
		expect(response.statusCode).toBe(200);
		expect(response.header["content-type"]).toMatch(/html/);
	});

	test("POST /enviar-correo debe rechazar bots si _gotcha tiene valor", async () => {
		const response = await request(app).post("/enviar-correo").send({
			nombre: "Robot",
			correo: "robot@spam.com",
			mensaje: "Hola",
			_gotcha: "Soy un bot",
		});
		expect(response.statusCode).toBe(400);
		expect(response.body.error).toBe("Bot detectado");
	});

	test("POST /enviar-correo debe fallar si faltan datos obligatorios", async () => {
		const response = await request(app).post("/enviar-correo").send({
			correo: "usuario@test.com",
			_gotcha: "",
		});
		expect(response.statusCode).toBe(400);
	});

	test("POST /enviar-correo debe enviar el email correctamente (Status 200)", async () => {
		// Usamos el nuevo nombre mockSendMail
		mockSendMail.mockImplementation((mailOptions, callback) => {
			callback(null, { response: "ok" });
		});

		const response = await request(app).post("/enviar-correo").send({
			nombre: "Cliente Feliz",
			correo: "cliente@ejemplo.com",
			mensaje: "Quiero contratar sus servicios",
			compania: "Mi Empresa SAC",
			_gotcha: "",
		});

		expect(response.statusCode).toBe(200);
		expect(response.body.success).toBeDefined();

		// Verificamos usando el nuevo nombre
		expect(mockSendMail).toHaveBeenCalled();
	});
});
