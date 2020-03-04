import { house } from './factory';
import { Op } from 'sequelize';
import { findNextHouse } from './service';

house.run(main);

async function main() {
  let c= await house.HouseInfoProject.count()
    console.log(c);
}

async function resetTime() {
  await house.HouseInfoProject.update(
    { fetchAt: new Date(Date.now()) },
    {
      where: {
        cityEn: 'cq'
      }
    }
  );
}
