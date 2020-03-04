"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const factory_1 = require("./factory");
factory_1.house.run(main);
async function main() {
    let c = await resetTime();
}
async function resetTime() {
    await factory_1.house.HouseInfoProject.update({ fetchAt: new Date(0) }, {
        where: {
            cityEn: 'cq'
        }
    });
}
//# sourceMappingURL=service_test.js.map