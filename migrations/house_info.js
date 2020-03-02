"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../src/scraw/utils/config");
exports.getModelHouseInfo = function (Sequelize) {
    const { INTEGER, STRING, DATE } = Sequelize;
    return {
        houseId: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        createdAt: DATE,
        updatedAt: DATE,
        houseDetailId: { type: STRING(30), unique: true },
        cityEn: STRING(30),
        cityCn: STRING(30),
        areaEn: STRING(30),
        areaCn: STRING(30),
        community: STRING(30),
        communityLink: STRING,
        xiaoqu: STRING(30),
        xiaoquLink: STRING,
        priceTotal: INTEGER,
        priceUnit: INTEGER,
        size: INTEGER,
        title: STRING,
        link: STRING,
        tag: STRING
    };
};
exports.default = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable(config_1.config.sheet_houses, exports.getModelHouseInfo(Sequelize));
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable(config_1.config.sheet_houses);
    }
};
//# sourceMappingURL=house_info.js.map