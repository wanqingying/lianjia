import { house } from '../utils/factory';
import { getCityArea, getCityInfo } from './lib/bus';
import { findOrCreateArea } from '../utils/service';
import { HouseAreaDH } from '../../interface/instance';

house.run(main);

async function main() {
  // 获取所有城市
  const cites = await getCityInfo();
  console.log(cites);
  // 获取区县
  const areasCit = await Promise.all(cites.slice(0,3).map(getCityArea));
  console.log(areasCit.length);
  // 得到区县列表
  const areas: HouseAreaDH[] = areasCit.reduce((pv, v) => pv.concat(v), []);
  // 同步到数据库
  await Promise.all(areas.map(findOrCreateArea));
}
