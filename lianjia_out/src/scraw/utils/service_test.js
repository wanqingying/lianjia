"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const factory_1 = require("./factory");
factory_1.house.run(main);
async function main() {
    let c = await factory_1.house.HouseInfoProject.count();
    console.log(c);
}
async function resetTime() {
    await factory_1.house.HouseInfoProject.update({ fetchAt: new Date(Date.now()) }, {
        where: {
            cityEn: 'cq'
        }
    });
}
//# sourceMappingURL=service_test.js.map