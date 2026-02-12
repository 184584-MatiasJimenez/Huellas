let reserva = require("../core/reserva");


describe("Reserva", () => {
    it("Debería inicializar la reserva", () => {
        expect(reserva.init()).toBeDefined();
    });
});

