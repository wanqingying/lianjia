"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const factory_1 = require("../utils/factory");
const bus_1 = require("./lib/bus");
const service_1 = require("../utils/service");
factory_1.house.run(main);
async function main() {
    let area = await service_1.findNextArea();
    let k = 0;
    while (area && k < 2) {
        await bus_1.syncAreaHouseInfo(area);
        area = await service_1.findNextArea();
        k++;
    }
}
//# sourceMappingURL=runHouse.js.map