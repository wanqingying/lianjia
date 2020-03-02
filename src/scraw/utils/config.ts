import { DirectNavigationOptions, LaunchOptions } from 'puppeteer';

export const config: Config = {
  detailID: 'data-lj_action_housedel_id',
  mysql: {
    host: '123.57.249.114',
    user: 'root',
    password: 'wan@com123',
    database: 'lianjia',
    connectTimeout: 900
  },
  browser_lunch: { headless: true, args: ['--no-sandbox'] },
  timeout_open_page: 8000,
  pageLimit: 3,
  url_city_list: 'https://www.lianjia.com/city/',
  sheet_houses: 'house_infos',
  sheet_areas: 'house_areas',
  updateCityPage: true,
  goto: { waitUntil: 'load', timeout: 9000 },
  updateTimeLine: 1000 * 3600 * 24
};

export interface Config {
  detailID: string;
  mysql: any;
  browser_lunch: LaunchOptions;
  timeout_open_page: number;
  pageLimit: number;
  url_city_list: string;
  sheet_houses: string;
  sheet_areas: string;
  goto: DirectNavigationOptions;
  updateCityPage: boolean;
  // 隔多久更新一次记录
  updateTimeLine: number;
}
