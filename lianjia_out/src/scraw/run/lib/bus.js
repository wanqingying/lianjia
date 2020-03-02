"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../../utils/config");
const factory_1 = require("../../utils/factory");
const service_1 = require("../../utils/service");
async function getCityInfo() {
    return await factory_1.house.run_page(async (ct) => {
        await ct.goto(config_1.config.url_city_list, config_1.config.goto);
        return await ct.$$eval('.city_list_ul a', async (options) => {
            return options
                .map((a) => {
                if (!a) {
                    return null;
                }
                let h = /https:\/\/(\w+)\./g.exec(a.href)[1];
                return {
                    cityEn: h,
                    cityCn: (a === null || a === void 0 ? void 0 : a.innerText) || ''
                };
            })
                .filter(a => a);
        });
    });
}
exports.getCityInfo = getCityInfo;
async function getCityArea(p) {
    return await factory_1.house.run_page(async (ct) => {
        let u;
        try {
            u = `https://${p.cityEn}.lianjia.com/ershoufang/pg1/`;
            await ct.goto(u, config_1.config.goto);
            return await ct.$$eval(`.position div[data-role="ershoufang"] a`, async (options, p) => {
                return options
                    .map((a) => {
                    if (!(a === null || a === void 0 ? void 0 : a.href)) {
                        return null;
                    }
                    let hp = a.href
                        .split('/')
                        .filter(v => v)
                        .pop();
                    let ca = {
                        nameEn: hp,
                        nameCn: (a === null || a === void 0 ? void 0 : a.innerText) || '',
                        cityCn: p.cityCn,
                        cityEn: p.cityEn,
                        pageIndex: 0,
                        lastFetchTime: new Date(Date.now())
                    };
                    return ca;
                })
                    .filter(a => a);
            }, p);
        }
        catch (e) {
            throw e;
        }
    });
}
exports.getCityArea = getCityArea;
async function getPageSize(ct) {
    return await ct.$$eval('.house-lst-page-box a', async (ops) => {
        let ks = ops
            .map((a) => {
            return (a === null || a === void 0 ? void 0 : a.innerText) * 1 || 0;
        })
            .filter(k => k);
        return Math.max(...ks, 0);
    });
}
exports.getPageSize = getPageSize;
async function syncCityHouseInfo(area) {
    await factory_1.house.run_page(async (ct) => {
        await ct.goto(`https://${area.cityEn}.lianjia.com/ershoufang/${area.nameEn}/`, config_1.config.goto);
        let page_size = await getPageSize(ct);
        let page_index = area.pageIndex;
        while (page_index <= page_size) {
            try {
                await ct.goto(`https://${area.cityEn}.lianjia.com/ershoufang/${area.nameEn}/pg${page_index}/`, config_1.config.goto);
                const pageData = await fetchPageData(ct, area);
                for (let i = 0; i < pageData.length; i++) {
                    await service_1.findOrCreateHouseInfo(pageData[i]);
                }
            }
            catch (e) {
                throw e;
            }
            finally {
                await service_1.updatePageIndex(area, page_index);
                factory_1.house.logSpeed();
                page_index++;
            }
        }
        await service_1.updateFetchTime(area);
    });
}
exports.syncCityHouseInfo = syncCityHouseInfo;
async function fetchPageData(ct, area) {
    return await ct.$$eval(`.sellListContent li`, async function fn(lis, area) {
        return lis.map((li) => {
            const ak = li.querySelector('.title a');
            const [xiaoqu, community] = Array.from(li.querySelectorAll('.positionInfo a'));
            const tags = Array.from(li.querySelectorAll('.tag span'));
            const priceT = li.querySelector('.totalPrice span');
            const pt = (priceT === null || priceT === void 0 ? void 0 : priceT.innerText) * 10000 || 0;
            const priceU = li.querySelector('.unitPrice');
            const pu = (priceU === null || priceU === void 0 ? void 0 : priceU.dataset['price']) * 1 || 0;
            return {
                houseDetailId: (li === null || li === void 0 ? void 0 : li.dataset['lj_action_housedel_id']) || '',
                cityEn: area.cityEn,
                cityCn: area.cityCn,
                areaEn: area.nameEn,
                areaCn: area.nameCn,
                community: (community === null || community === void 0 ? void 0 : community.innerText) || '',
                communityLink: (community === null || community === void 0 ? void 0 : community.href) || '',
                xiaoqu: (xiaoqu === null || xiaoqu === void 0 ? void 0 : xiaoqu.innerText) || '',
                xiaoquLink: (xiaoqu === null || xiaoqu === void 0 ? void 0 : xiaoqu.href) || '',
                title: (ak === null || ak === void 0 ? void 0 : ak.innerText) || '',
                tag: tags.map(s => (s === null || s === void 0 ? void 0 : s.innerText) || '').join('&'),
                link: (ak === null || ak === void 0 ? void 0 : ak.href) || '',
                priceTotal: pt,
                priceUnit: pu,
                size: Math.round(pt / pu)
            };
        });
    }, area);
}
exports.fetchPageData = fetchPageData;
//# sourceMappingURL=bus.js.map