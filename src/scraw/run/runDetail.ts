import { house } from '../utils/factory';
import { createHousePrice, findNextHouse } from '../utils/service';
import { fetchHouseInfo } from './lib/bus';
import { timeoutFn } from '../utils/comm';

house.run(main);

async function main() {
  let hs = await findNextHouse();
  house.count = await house.HouseInfoProject.count();
  let k = 0;
  while (hs && k < 400000) {
    const infos = await fetchHouseInfo(hs);
    if (infos) {
      await createHousePrice({
        houseDetailId: hs.houseDetailId,
        priceTotal: infos.priceTotal,
        priceUnit: infos.priceUnit,
        size: infos.size
      });
    }
    hs = await findNextHouse();
    house.logSpeed();
    await timeoutFn(100);
    k++;
  }
}
