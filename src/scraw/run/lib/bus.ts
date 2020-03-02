import { config } from '../../utils/config';
import { house } from '../../utils/factory';
import { Page } from 'puppeteer';
import {
  HouseAreaDB,
  HouseAreaDH,
  HouseInfoDH,
  HouseInfoDJ
} from '../../interface/instance';
import {
  findOrCreateHouseInfo,
  updateFetchTime,
  updatePageIndex
} from '../../utils/service';

// 获取城市列表
export async function getCityInfo(): Promise<HouseInfoDJ[]> {
  return await house.run_page(async ct => {
    await ct.goto(config.url_city_list, config.goto);
    return await ct.$$eval('.city_list_ul a', async options => {
      return options
        .map((a: HTMLLinkElement) => {
          if (!a) {
            return null;
          }
          let h = /https:\/\/(\w+)\./g.exec(a.href)[1];
          return {
            cityEn: h,
            cityCn: a?.innerText || ''
          } as HouseInfoDJ;
        })
        .filter(a => a);
    });
  });
}

//获取地区列表
export async function getCityArea(p: HouseInfoDJ): Promise<HouseAreaDH[]> {
  return await house.run_page(async ct => {
    let u;
    try {
      u = `https://${p.cityEn}.lianjia.com/ershoufang/pg1/`;
      await ct.goto(u, config.goto);
      return await ct.$$eval(
        `.position div[data-role="ershoufang"] a`,
        async (options, p) => {
          return options
            .map((a: HTMLLinkElement) => {
              if (!a?.href) {
                return null;
              }
              let hp = a.href
                .split('/')
                .filter(v => v)
                .pop();

              let ca: HouseAreaDH = {
                nameEn: hp,
                nameCn: a?.innerText || '',
                cityCn: p.cityCn,
                cityEn: p.cityEn,
                pageIndex: 0,
                lastFetchTime: new Date(Date.now())
              };
              return ca;
            })
            .filter(a => a);
        },
        p
      );
    } catch (e) {
      throw e;
    }
  });
}

export async function getPageSize(ct: Page) {
  return await ct.$$eval('.house-lst-page-box a', async ops => {
    let ks = ops
      .map((a: HTMLLinkElement) => {
        return (a?.innerText as any) * 1 || 0;
      })
      .filter(k => k);
    return Math.max(...ks, 0);
  });
}

export async function syncCityHouseInfo(area: HouseAreaDB) {
  await house.run_page(async ct => {
    await ct.goto(
      `https://${area.cityEn}.lianjia.com/ershoufang/${area.nameEn}/`,
      config.goto
    );
    let page_size = await getPageSize(ct);
    let page_index = area.pageIndex;
    while (page_index <= page_size) {
      try {
        await ct.goto(
          `https://${area.cityEn}.lianjia.com/ershoufang/${area.nameEn}/pg${page_index}/`,
          config.goto
        );

        const pageData = await fetchPageData(ct, area);
        for (let i = 0; i < pageData.length; i++) {
          await findOrCreateHouseInfo(pageData[i]);
        }
      } catch (e) {
        throw e;
      } finally {
        await updatePageIndex(area, page_index);
        house.logSpeed();
        page_index++;
      }
    }
    await updateFetchTime(area);
  });
}
// 抓取页面数据
export async function fetchPageData(
  ct: Page,
  area: HouseAreaDB
): Promise<HouseInfoDH[]> {
  return await ct.$$eval(
    `.sellListContent li`,
    async function fn(lis, area) {
      return lis.map((li: HTMLLIElement) => {
        const ak = li.querySelector('.title a') as HTMLLinkElement;
        const [xiaoqu, community] = Array.from(
          li.querySelectorAll('.positionInfo a')
        ) as HTMLLinkElement[];
        const tags = Array.from(
          li.querySelectorAll('.tag span')
        ) as HTMLSpanElement[];
        const priceT = li.querySelector('.totalPrice span') as HTMLSpanElement;
        const pt = (priceT?.innerText as any) * 10000 || 0;
        const priceU = li.querySelector('.unitPrice') as HTMLDivElement;
        const pu = (priceU?.dataset['price'] as any) * 1 || 0;
        return {
          houseDetailId: (li?.dataset['lj_action_housedel_id'] as string) || '',
          cityEn: area.cityEn,
          cityCn: area.cityCn,
          areaEn: area.nameEn,
          areaCn: area.nameCn,
          community: community?.innerText || '',
          communityLink: community?.href || '',
          xiaoqu: xiaoqu?.innerText || '',
          xiaoquLink: xiaoqu?.href || '',
          title: ak?.innerText || '',
          tag: tags.map(s => s?.innerText || '').join('&'),
          link: ak?.href || '',
          priceTotal: pt,
          priceUnit: pu,
          size: Math.round(pt / pu)
        };
      });
    },
    area
  );
}
