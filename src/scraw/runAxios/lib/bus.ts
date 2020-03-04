import { HouseAreaDB } from '../../../interface/instance';
import { house } from '../../utils/factory';
import { config } from '../../utils/config';
import {
  findOrCreateHouseInfo,
  updateFetchTime,
  updatePageIndex
} from '../../utils/service';
import { Page } from 'puppeteer';
import {
  HouseAreaDH,
  HouseInfoDJ,
  HouseInfoDH
} from '../../../interface/instance';
import axios from 'axios';
import { JSDOM } from 'jsdom';
import { getPageSize } from '../../run/lib/bus';
import { Deferred } from '../../utils/comm';

export async function syncAreaHouseInfo(area: HouseAreaDB) {
  return await house.run_page(async ct => {
    let url = `https://${area.cityEn}.lianjia.com/ershoufang/${area.nameEn}/`;
    await ct.goto(url, config.goto);
    let page_size = await getPageSize(ct);
    let page_index = area.pageIndex;
    const task: any[] = [];

    while (page_index <= page_size) {
      task.push(async function f() {
        url = `https://${area.cityEn}.lianjia.com/ershoufang/${area.nameEn}/pg${page_index}/`;
        const pageData = await fetchPageData(url, area);
        await Deferred.runAsync(pageData.map(p => findOrCreateHouseInfo(p)));
        await updatePageIndex(area, page_index);
        house.logSpeed();
      });
      page_index++;
    }
    try {
      await Deferred.runAsync(task);
    } catch (e) {
      throw e;
    }
    await updateFetchTime(area);
  });
}

declare type PH = HouseInfoDH[];
// 抓取页面数据
export async function fetchPageData(
  url: string,
  area: HouseAreaDB
): Promise<PH> {
  const res = await axios.get(url);
  const dom = new JSDOM(`${res.data}`);
  const pg = dom.window.document.querySelectorAll('.sellListContent li');
  const pga = Array.from(pg);
  console.log('pga', pga.length, url);
  return Array.from(pg).map((li: HTMLLIElement) => {
    const ak = li.querySelector('.title a') as HTMLLinkElement;
    const [xiaoqu, community] = Array.from(
      li.querySelectorAll('.positionInfo a')
    ) as HTMLLinkElement[];
    const tags = Array.from(
      li.querySelectorAll('.tag span')
    ) as HTMLSpanElement[];
    const priceT = li.querySelector('.totalPrice span') as HTMLSpanElement;
    const pt = (priceT?.textContent as any) * 10000 || 0;
    const priceU = li.querySelector('.unitPrice') as HTMLDivElement;
    const pu = (priceU?.dataset['price'] as any) * 1 || 0;
    return {
      houseDetailId: (li?.dataset['lj_action_housedel_id'] as string) || '',
      cityEn: area.cityEn,
      cityCn: area.cityCn,
      areaEn: area.nameEn,
      areaCn: area.nameCn,
      community: community?.textContent || '',
      communityLink: community?.href || '',
      xiaoqu: xiaoqu?.textContent || '',
      xiaoquLink: xiaoqu?.href || '',
      title: ak?.textContent || '',
      tag: tags.map(s => s?.textContent || '').join('&'),
      link: ak?.href || '',
      priceTotal: pt,
      priceUnit: pu,
      size: Math.round(pt / pu)
    };
  });
}
