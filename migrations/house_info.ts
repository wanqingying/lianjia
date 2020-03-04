import { QueryInterface } from 'sequelize';
import { config } from '../src/scraw/utils/config';

export const getModelHouseInfo = function(Sequelize) {
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
    fetchAt: DATE,

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

export default {
  up: (queryInterface: QueryInterface, Sequelize) => {
    return queryInterface.createTable(
      config.sheet_houses,
      getModelHouseInfo(Sequelize)
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable(config.sheet_houses);
  }
};
