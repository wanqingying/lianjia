"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = {
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
    pageLimit: 1,
    url_city_list: 'https://www.lianjia.com/city/',
    sheet_houses: 'house_infos',
    sheet_areas: 'house_areas',
    sheet_prices: 'sheet_prices',
    updateCityPage: true,
    goto: { waitUntil: 'load', timeout: 15 * 1000 },
    updateTimeLine: 1000 * 3600 * 24,
    city: '重庆'
};
//# sourceMappingURL=config.js.map