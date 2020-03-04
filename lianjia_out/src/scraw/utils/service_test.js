"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const factory_1 = require("./factory");
const service_1 = require("./service");
factory_1.house.run(main);
async function main() {
    const house = await service_1.findNextHouse();
    console.log(house.houseDetailId);
}
//# sourceMappingURL=service_test.js.map