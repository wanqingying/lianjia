import { house } from '../utils/factory';
import { createHousePrice, findNextHouse } from '../utils/service';
import { fetchHouseInfo } from './lib/bus';

house.run(main);

async function main() {
  let hs = await findNextHouse();
  house.count = await house.HouseInfoProject.count();
  let k = 0;
  while (hs && k < 4000000) {
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
    k++;
  }
}
