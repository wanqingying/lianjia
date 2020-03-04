"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const factory_1 = require("../../utils/factory");
const config_1 = require("../../utils/config");
const service_1 = require("../../utils/service");
const axios_1 = require("axios");
const jsdom_1 = require("jsdom");
const bus_1 = require("../../run/lib/bus");
const comm_1 = require("../../utils/comm");
async function syncAreaHouseInfo(area) {
    return await factory_1.house.run_page(async (ct) => {
        let url = `https://${area.cityEn}.lianjia.com/ershoufang/${area.nameEn}/`;
        await ct.goto(url, config_1.config.goto);
        let page_size = await bus_1.getPageSize(ct);
        let page_index = area.pageIndex;
        const task = [];
        while (page_index <= page_size) {
            task.push(async function f() {
                url = `https://${area.cityEn}.lianjia.com/ershoufang/${area.nameEn}/pg${page_index}/`;
                const pageData = await fetchPageData(url, area);
                await comm_1.Deferred.runAsync(pageData.map(p => service_1.findOrCreateHouseInfo(p)));
                await service_1.updatePageIndex(area, page_index);
                factory_1.house.logSpeed();
            });
            page_index++;
        }
        try {
            await comm_1.Deferred.runAsync(task);
        }
        catch (e) {
            throw e;
        }
        await service_1.updateFetchTime(area);
    });
}
exports.syncAreaHouseInfo = syncAreaHouseInfo;
async function fetchPageData(url, area) {
    const res = await axios_1.default.get(url);
    const dom = new jsdom_1.JSDOM(`${res.data}`);
    const pg = dom.window.document.querySelectorAll('.sellListContent li');
    const pga = Array.from(pg);
    console.log('pga', pga.length, url);
    return Array.from(pg).map((li) => {
        const ak = li.querySelector('.title a');
        const [xiaoqu, community] = Array.from(li.querySelectorAll('.positionInfo a'));
        const tags = Array.from(li.querySelectorAll('.tag span'));
        const priceT = li.querySelector('.totalPrice span');
        const pt = (priceT === null || priceT === void 0 ? void 0 : priceT.textContent) * 10000 || 0;
        const priceU = li.querySelector('.unitPrice');
        const pu = (priceU === null || priceU === void 0 ? void 0 : priceU.dataset['price']) * 1 || 0;
        return {
            houseDetailId: (li === null || li === void 0 ? void 0 : li.dataset['lj_action_housedel_id']) || '',
            cityEn: area.cityEn,
            cityCn: area.cityCn,
            areaEn: area.nameEn,
            areaCn: area.nameCn,
            community: (community === null || community === void 0 ? void 0 : community.textContent) || '',
            communityLink: (community === null || community === void 0 ? void 0 : community.href) || '',
            xiaoqu: (xiaoqu === null || xiaoqu === void 0 ? void 0 : xiaoqu.textContent) || '',
            xiaoquLink: (xiaoqu === null || xiaoqu === void 0 ? void 0 : xiaoqu.href) || '',
            title: (ak === null || ak === void 0 ? void 0 : ak.textContent) || '',
            tag: tags.map(s => (s === null || s === void 0 ? void 0 : s.textContent) || '').join('&'),
            link: (ak === null || ak === void 0 ? void 0 : ak.href) || '',
            priceTotal: pt,
            priceUnit: pu,
            size: Math.round(pt / pu)
        };
    });
}
exports.fetchPageData = fetchPageData;
//# sourceMappingURL=bus.js.map