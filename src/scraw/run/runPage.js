"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const factory_1 = require("../utils/factory");
const bus_1 = require("./lib/bus");
const service_1 = require("../utils/service");
factory_1.house.run(main);
async function main() {
    const cites = await bus_1.getCityInfo();
    const areasCit = await Promise.all(cites.map(bus_1.getCityArea));
    console.log(areasCit.length);
    const areas = areasCit.reduce((pv, v) => pv.concat(v), []);
    await Promise.all(areas.map(service_1.findOrCreateArea));
}
//# sourceMappingURL=runPage.js.map