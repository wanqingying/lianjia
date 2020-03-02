import { house } from './factory';
import { clearAuto, findOrCreateArea } from './service';
import { Op } from 'sequelize';

house.run(main);

async function main() {
  // await findOrCreateArea({
  //   cityEn: 'string',
  //   cityCn: 'string',
  //   nameEn: 'string',
  //   nameCn: 'string',
  //   pageIndex: 55,
  //   lastFetchTime: new Date(888888)
  // });
  let p = await house.HouseAreaProject.update(
    { lastFetchTime: new Date(0) },
    {
      where: {
        lastFetchTime: { [Op.gt]: new Date(Date.now() - 1000 * 3600 * 15) }
      }
    }
  );
  debugger;
  // let h = await find_house_info(356);
}
