"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const house_info_1 = require("../../migrations/house_info");
const comm_1 = require("../utils/comm");
const house_areas_1 = require("../../migrations/house_areas");
const config_1 = require("../utils/config");
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
//# sourceMappingURL=model.js.map