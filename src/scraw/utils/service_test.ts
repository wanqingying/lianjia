import { house } from './factory';
import { Op } from 'sequelize';
import { findNextHouse } from './service';

house.run(main);

async function main() {
  await house.HouseInfoProject.update(
    { fetchAt: new Date(0) },
    {
      where: {
        cityEn: 'cq'
      }
    }
  );
}
