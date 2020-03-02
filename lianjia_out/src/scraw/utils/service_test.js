"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const factory_1 = require("./factory");
const sequelize_1 = require("sequelize");
factory_1.house.run(main);
async function main() {
    let p = await factory_1.house.HouseAreaProject.update({ lastFetchTime: new Date(0) }, {
        where: {
            lastFetchTime: { [sequelize_1.Op.gt]: new Date(Date.now() - 1000 * 3600 * 15) }
        }
    });
    debugger;
}
//# sourceMappingURL=service_test.js.map