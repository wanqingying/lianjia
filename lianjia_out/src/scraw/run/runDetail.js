"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const factory_1 = require("../utils/factory");
const service_1 = require("../utils/service");
const bus_1 = require("./lib/bus");
const comm_1 = require("../utils/comm");
factory_1.house.run(main);
async function main() {
    let hs = await service_1.findNextHouse();
    factory_1.house.count = await factory_1.house.HouseInfoProject.count();
    let k = 0;
    while (hs && k < 400000) {
        const infos = await bus_1.fetchHouseInfo(hs);
        if (infos) {
            await service_1.createHousePrice({
                houseDetailId: hs.houseDetailId,
                priceTotal: infos.priceTotal,
                priceUnit: infos.priceUnit,
                size: infos.size
            });
        }
        hs = await service_1.findNextHouse();
        factory_1.house.logSpeed();
        await comm_1.timeoutFn(100);
        k++;
    }
}
//# sourceMappingURL=runDetail.js.map