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
    browser_lunch: { headless: true },
    timeout_open_page: 8000,
    pageLimit: 3,
    url_city_list: 'https://www.lianjia.com/city/',
    sheet_houses: 'house_infos',
    sheet_areas: 'house_areas',
    updateCityPage: true,
    goto: { waitUntil: 'load', timeout: 9000 },
    updateTimeLine: 1000 * 3600 * 24
};
//# sourceMappingURL=config.js.map