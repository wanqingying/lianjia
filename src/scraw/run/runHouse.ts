import { house } from '../utils/factory';
import { syncCityHouseInfo } from './lib/bus';
import { findNextArea } from '../utils/service';

house.run(main);

async function main() {

  let area = await findNextArea();
  let k = 0;
  while (area && k < 4555) {
    await syncCityHouseInfo(area);
    area = await findNextArea();
    k++;
  }
}
