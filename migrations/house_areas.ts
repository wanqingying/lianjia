import { QueryInterface } from 'sequelize';
import { config } from '../src/utils/config';

export const getModelHouseArea = function(Sequelize) {
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

export default {
  up: (queryInterface: QueryInterface, Sequelize) => {
    return queryInterface.createTable(
      config.sheet_areas,
      getModelHouseArea(Sequelize)
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable(config.sheet_houses);
  }
};
