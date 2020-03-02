import { house } from './factory';
import { HouseAreaDB, HouseAreaDH, HouseInfoDH } from '../interface/instance';
import { Op } from 'sequelize';
import { config } from './config';

export async function findOrCreateHouseInfo(data: HouseInfoDH) {
  const pw = await house.HouseInfoProject.findOrCreate({
    where: { houseDetailId: data.houseDetailId },
    defaults: data
  });
  return pw;
}

export async function findOrCreateArea(data: HouseAreaDH) {
  let res;
  if (!(data.lastFetchTime instanceof Date)) {
    data.lastFetchTime = new Date(0);
  }
  try {
    res = await house.HouseAreaProject.findOrCreate({
      where: { cityEn: data.cityEn, nameEn: data.nameEn },
      defaults: data
    });
    console.log('add', res);
  } catch (e) {
    console.error(e);
  }
  return res;
}

// 拿到下一个需要更新的城市数据
export async function findNextOne(): Promise<HouseAreaDB | null> {
  const one = await house.HouseAreaProject.findOne({
    where: {
      lastFetchTime: { [Op.lt]: new Date(Date.now() - config.updateTimeLine) },
      cityCn: config.city
    }
  });
  return one as any;
}

export async function updatePageIndex(area: HouseAreaDB, pageIndex: number) {
  await house.HouseAreaProject.update(
    { pageIndex: pageIndex },
    { where: { areaId: area.areaId } }
  );
}
export async function updateFetchTime(area: HouseAreaDB) {
  await house.HouseAreaProject.update(
    { lastFetchTime: new Date(Date.now()) },
    { where: { areaId: area.areaId } }
  );
}

export async function clearAuto() {
  await house.HouseAreaProject.destroy({ where: { cityCn: 'string' } });
}
