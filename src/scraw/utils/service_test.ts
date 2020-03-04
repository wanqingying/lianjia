import { house } from './factory';
import {clearAuto, findNextHouse, findOrCreateArea} from './service';
import { Op } from 'sequelize';

house.run(main);

async function main() {
    const house=await findNextHouse();
    console.log(house.houseDetailId);
}
