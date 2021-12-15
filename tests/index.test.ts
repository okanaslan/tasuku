import { Controller } from "../src/classes/controller";

test("should return a  number", async () => {
    const controller = new Controller();
    controller.enqueue("Some task", async () => 1 + 1);
    const response = await controller.run();
    expect(response[0]).toBe(2);
});
