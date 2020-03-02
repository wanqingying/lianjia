"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../src/utils/config");
exports.getModelHouseArea = function (Sequelize) {
    const { INTEGER, STRING, DATE } = Sequelize;
    return {
        areaId: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        createdAt: DATE,
        updatedAt: DATE,
        cityEn: STRING(30),
        cityCn: STRING(30),
        nameEn: STRING(30),
        nameCn: STRING(30),
        pageIndex: INTEGER,
        lastFetchTime: DATE
    };
};
exports.default = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable(config_1.config.sheet_areas, exports.getModelHouseArea(Sequelize));
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable(config_1.config.sheet_houses);
    }
};
//# sourceMappingURL=house_areas.js.map