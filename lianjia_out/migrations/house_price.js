"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../src/scraw/utils/config");
exports.getModelHousePrice = function (Sequelize) {
    const { INTEGER, STRING, DATE } = Sequelize;
    return {
        PriceInfoId: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        createdAt: DATE,
        updatedAt: DATE,
        houseDetailId: { type: STRING(30), unique: true },
        priceTotal: INTEGER,
        priceUnit: INTEGER,
        size: INTEGER,
    };
};
exports.default = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable(config_1.config.sheet_prices, exports.getModelHousePrice(Sequelize));
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable(config_1.config.sheet_prices);
    }
};
//# sourceMappingURL=house_price.js.map