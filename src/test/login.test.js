/**
 * Test de login correcto (admin)
 */

const fs = require("fs");
const path = require("path");

function loadHtmlFromFile(fileName) {
	const filePath = path.resolve(__dirname, "..", "..", fileName);
	const html = fs.readFileSync(filePath, "utf8");
	document.documentElement.innerHTML = html;
}

describe("Login", () => {
	beforeEach(() => {
		loadHtmlFromFile("index.html");
		sessionStorage.clear();
		window.location.replace = jest.fn();

		delete require.cache[require.resolve("../core/login")];
		require("../core/login");
	});

	test("debería loguear al admin correctamente", () => {
		const form = document.getElementById("loginForm");
        const usuario = form.querySelector('input[name="usuario"]');
        const password = form.querySelector('input[name="password"]');
		form.usuario = usuario;
		form.password = password;
        usuario.value = "admin";
		password.value = "veterinaria";

		form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));

		expect(sessionStorage.getItem("huellas_role")).toBe("admin");
	});
});
