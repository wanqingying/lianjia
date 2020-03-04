import { house } from '../utils/factory';
import { syncAreaHouseInfo } from './lib/bus';
import { findNextArea } from '../utils/service';

house.run(main);

async function main() {
  let area = await findNextArea();
  let k = 0;
  while (area && k < 2) {
    await syncAreaHouseInfo(area);
    area = await findNextArea();
    k++;
  }
}
