"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const factory_1 = require("../utils/factory");
const bus_1 = require("./lib/bus");
const service_1 = require("../utils/service");
factory_1.house.run(main);
async function main() {
    let area = await service_1.findNextOne();
    let k = 0;
    while (area && k < 4555) {
        await bus_1.syncCityHouseInfo(area);
        area = await service_1.findNextOne();
        k++;
    }
}
//# sourceMappingURL=runHouse.js.map