"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer_1 = require("puppeteer");
const config_1 = require("./config");
const sequelize_1 = require("sequelize");
const comm_1 = require("./comm");
const model_1 = require("../sequelize/model");
const { host, user, password, database } = config_1.config.mysql;
class House {
    constructor(setting) {
        this.setting = { pageLimit: 5, config: config_1.config };
        this.pages = [];
        this.waitePage = [];
        this.sequelize = new sequelize_1.Sequelize(database, user, password, {
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
        this.countA = [];
        this.run_page = (callback, _page) => {
            let page = _page || this.pages.shift();
            let def = new comm_1.Deferred();
            if (!page) {
                this.waitePage.push({ def, callback });
            }
            else {
                this._run_page({ callback, def }, page);
            }
            return def.promise;
        };
        this._run_page = ({ callback, def }, page) => {
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
        this.releasePage = (page) => {
            let next = this.waitePage.shift();
            if (next) {
                this._run_page(next, page);
            }
            else {
                this.pages.push(page);
            }
        };
        this.run = (callback) => {
            this.start()
                .then(() => callback())
                .then(() => exports.house.end())
                .then(() => { })
                .catch(e => {
                console.error(e === null || e === void 0 ? void 0 : e.message);
            })
                .finally(() => {
                console.log('done');
            });
        };
        this.start = async () => {
            if (this.setting.pageLimit > 0) {
                this.browser = await puppeteer_1.launch(config_1.config.browser_lunch);
                for (let i = 0; i < this.setting.pageLimit; i++) {
                    let p = await this.browser.newPage();
                    this.pages.push(p);
                }
            }
            await this.sequelize.authenticate();
            const [info, area, price] = await Promise.all([
                model_1.getHouseInfoProject(this.sequelize),
                model_1.getHouseAreaProject(this.sequelize),
                model_1.getHousePriceProject(this.sequelize)
            ]);
            this.HouseInfoProject = info;
            this.HouseAreaProject = area;
            this.HousePriceProject = price;
        };
        this.end = async () => {
            var _a, _b;
            await Promise.all([(_a = this === null || this === void 0 ? void 0 : this.browser) === null || _a === void 0 ? void 0 : _a.close(), (_b = this === null || this === void 0 ? void 0 : this.sequelize) === null || _b === void 0 ? void 0 : _b.close()]);
        };
        this.logSpeed = () => {
            if (this.countA.length < 10) {
                this.countA.push(Date.now());
            }
            else {
                this.countA.shift();
                this.countA.push(Date.now());
            }
            const start = this.countA[0];
            const end = this.countA[this.countA.length - 1];
            const sd = Math.round((end - start) / this.countA.length) || 5000;
            console.log('speed:', sd + 'ms/p');
        };
        Object.assign(this.setting, setting);
    }
}
exports.House = House;
exports.house = new House({ pageLimit: config_1.config.pageLimit });
//# sourceMappingURL=factory.js.map