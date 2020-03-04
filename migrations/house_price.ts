import { QueryInterface } from 'sequelize';
import { config } from '../src/scraw/utils/config';

export const getModelHousePrice = function(Sequelize) {
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

export default {
    up: (queryInterface: QueryInterface, Sequelize) => {
        return queryInterface.createTable(
            config.sheet_prices,
            getModelHousePrice(Sequelize)
        );
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable(config.sheet_prices);
    }
};
