import { Browser, launch, Page } from 'puppeteer';
import { config } from './config';
import { Sequelize } from 'sequelize';
import { Deferred } from './comm';
import {
  getHouseAreaProject,
  getHouseInfoProject,
  getHousePriceProject,
  HouseAreaProject,
  HouseInfoProject,
  HousePriceProject
} from '../sequelize/model';

interface Wtg {
  def: Deferred;
  callback: CBT;
}

const { host, user, password, database } = config.mysql;

export class House {
  private browser: Browser;
  private setting: HouseSetting = { pageLimit: 5, config: config };
  private pages: Page[] = [];
  private waitePage: Wtg[] = [];
  private sequelize = new Sequelize(database, user, password, {
    host: host,
    dialect: 'mysql',
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    logQueryParameters: false,
    logging: false
  });
  private countA: number[] = [];

  public HouseInfoProject: typeof HouseInfoProject;
  public HouseAreaProject: typeof HouseAreaProject;
  public HousePriceProject: typeof HousePriceProject;

  constructor(setting?: HouseSetting) {
    Object.assign(this.setting, setting);
  }
  public run_page = (callback: CBT, _page?: Page): Promise<any> => {
    let page = _page || this.pages.shift();
    let def = new Deferred();

    if (!page) {
      this.waitePage.push({ def, callback });
    } else {
      this._run_page({ callback, def }, page);
    }
    return def.promise;
  };

  private _run_page = ({ callback, def }: Wtg, page: Page) => {
    callback(page)
      .then(res => {
        def.resolve(res);
      })
      .catch(e => {
        console.error('catch error run_page');
        console.error(e.message);
        debugger;
        def.resolve();
      })
      .finally(() => {
        this.releasePage(page);
        def.resolve();
      });
  };

  public releasePage = (page: Page) => {
    let next = this.waitePage.shift();
    if (next) {
      this._run_page(next, page);
    } else {
      this.pages.push(page);
    }
  };

  public run = (callback: () => Promise<any>) => {
    this.start()
      .then(() => callback())
      .then(() => house.end())
      .then(() => {})
      .catch(e => {
        console.error(e?.message);
      })
      .finally(() => {
        console.log('done');
      });
  };

  public start = async () => {
    if (this.setting.pageLimit > 0) {
      this.browser = await launch(config.browser_lunch);
      for (let i = 0; i < this.setting.pageLimit; i++) {
        let p = await this.browser.newPage();
        this.pages.push(p);
      }
    }
    await this.sequelize.authenticate();
    const [info, area, price] = await Promise.all([
      getHouseInfoProject(this.sequelize),
      getHouseAreaProject(this.sequelize),
      getHousePriceProject(this.sequelize)
    ]);
    this.HouseInfoProject = info as any;
    this.HouseAreaProject = area as any;
    this.HousePriceProject = price as any;
  };
  public end = async () => {
    await Promise.all([this?.browser?.close(), this?.sequelize?.close()]);
  };
  public logSpeed = () => {
    if (this.countA.length < 10) {
      this.countA.push(Date.now());
    } else {
      this.countA.shift();
      this.countA.push(Date.now());
    }
    const start = this.countA[0];
    const end = this.countA[this.countA.length - 1];
    const sd = Math.round((end - start) / this.countA.length) || 5000;
    console.log('speed:', sd + 'ms/p');
  };
}

export interface HouseSetting {
  pageLimit?: number;
  config?: any;
}

export type CBT = (ct: Page) => Promise<any>;

export const house = new House({ pageLimit: config.pageLimit });
