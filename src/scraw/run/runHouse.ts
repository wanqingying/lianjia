import { house } from '../utils/factory';
import { syncCityHouseInfo } from './lib/bus';
import { findNextOne } from '../utils/service';

house.run(main);

async function main() {

  let area = await findNextOne();
  let k = 0;
  while (area && k < 4555) {
    await syncCityHouseInfo(area);
    area = await findNextOne();
    k++;
  }
}
