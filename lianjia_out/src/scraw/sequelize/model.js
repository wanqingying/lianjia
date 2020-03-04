"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const house_info_1 = require("../../../migrations/house_info");
const comm_1 = require("../utils/comm");
const house_areas_1 = require("../../../migrations/house_areas");
const config_1 = require("../utils/config");
const house_price_1 = require("../../../migrations/house_price");
class HouseInfoProject extends sequelize_1.Model {
}
exports.HouseInfoProject = HouseInfoProject;
function getHouseInfoProject(sequelize) {
    const def = new comm_1.Deferred();
    HouseInfoProject.init(house_info_1.getModelHouseInfo(sequelize_1.default), {
        sequelize,
        modelName: config_1.config.sheet_houses
    });
    HouseInfoProject.sync({ force: false }).then(() => {
        console.log('house_info ok');
        def.resolve(HouseInfoProject);
    });
    return def.promise;
}
exports.getHouseInfoProject = getHouseInfoProject;
class HouseAreaProject extends sequelize_1.Model {
}
exports.HouseAreaProject = HouseAreaProject;
function getHouseAreaProject(sequelize) {
    const def = new comm_1.Deferred();
    HouseAreaProject.init(house_areas_1.getModelHouseArea(sequelize_1.default), {
        sequelize,
        modelName: config_1.config.sheet_areas
    });
    HouseAreaProject.sync({ force: false }).then(() => {
        console.log('house_area ok');
        def.resolve(HouseAreaProject);
    });
    return def.promise;
}
exports.getHouseAreaProject = getHouseAreaProject;
class HousePriceProject extends sequelize_1.Model {
}
exports.HousePriceProject = HousePriceProject;
function getHousePriceProject(sequelize) {
    const def = new comm_1.Deferred();
    HousePriceProject.init(house_price_1.getModelHousePrice(sequelize_1.default), {
        sequelize,
        modelName: config_1.config.sheet_prices
    });
    HousePriceProject.sync({ force: false }).then(() => {
        def.resolve(HousePriceProject);
    });
    return def.promise;
}
exports.getHousePriceProject = getHousePriceProject;
//# sourceMappingURL=model.js.map