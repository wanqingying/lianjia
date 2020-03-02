// @ts-ignore
import S, { Model, STRING, Sequelize } from 'sequelize';
import { getModelHouseInfo } from '../../migrations/house_info';
import { Deferred } from '../utils/comm';
import { getModelHouseArea } from '../../migrations/house_areas';
import {config} from "../utils/config";

export class HouseInfoProject extends Model {}

export function getHouseInfoProject(
  sequelize: Sequelize
): Promise<HouseInfoProject> {
  const def = new Deferred();
  HouseInfoProject.init(getModelHouseInfo(S), {
    sequelize,
    modelName: config.sheet_houses
  });

  HouseInfoProject.sync({ force: false }).then(() => {
    console.log('house_info ok');
    def.resolve(HouseInfoProject);
  });
  return def.promise;
}

export class HouseAreaProject extends Model {}

export function getHouseAreaProject(
  sequelize: Sequelize
): Promise<HouseAreaProject> {
  const def = new Deferred();
  HouseAreaProject.init(getModelHouseArea(S), {
    sequelize,
    modelName: config.sheet_areas
  });

  HouseAreaProject.sync({ force: false }).then(() => {
    console.log('house_area ok');
    def.resolve(HouseAreaProject);
  });
  return def.promise;
}
