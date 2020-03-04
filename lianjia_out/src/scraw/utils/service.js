"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const factory_1 = require("./factory");
const sequelize_1 = require("sequelize");
const config_1 = require("./config");
async function findOrCreateHouseInfo(data) {
    const pw = await factory_1.house.HouseInfoProject.findOrCreate({
        where: { houseDetailId: data.houseDetailId },
        defaults: data
    });
    return pw;
}
exports.findOrCreateHouseInfo = findOrCreateHouseInfo;
async function findOrCreateArea(data) {
    let res;
    if (!(data.lastFetchTime instanceof Date)) {
        data.lastFetchTime = new Date(0);
    }
    try {
        res = await factory_1.house.HouseAreaProject.findOrCreate({
            where: { cityEn: data.cityEn, nameEn: data.nameEn },
            defaults: data
        });
        console.log('add', res);
    }
    catch (e) {
        console.error(e);
    }
    return res;
}
exports.findOrCreateArea = findOrCreateArea;
async function findNextArea() {
    const one = await factory_1.house.HouseAreaProject.findOne({
        where: {
            lastFetchTime: { [sequelize_1.Op.lt]: new Date(Date.now() - config_1.config.updateTimeLine) },
            cityCn: config_1.config.city
        }
    });
    return one;
}
exports.findNextArea = findNextArea;
async function findNextHouse() {
    const res = (await factory_1.house.HouseInfoProject.findOne({
        where: {
            fetchAt: { [sequelize_1.Op.lt]: new Date(Date.now() - config_1.config.updateTimeLine) }
        }
    }));
    if (res) {
        await factory_1.house.HouseInfoProject.update({ fetchAt: new Date(Date.now()) }, {
            where: { houseDetailId: res.houseDetailId }
        });
    }
    return res;
}
exports.findNextHouse = findNextHouse;
async function createHousePrice(data) {
    await factory_1.house.HousePriceProject.create(data);
}
exports.createHousePrice = createHousePrice;
async function updatePageIndex(area, pageIndex) {
    await factory_1.house.HouseAreaProject.update({ pageIndex: pageIndex }, { where: { areaId: area.areaId } });
}
exports.updatePageIndex = updatePageIndex;
async function updateFetchTime(area) {
    await factory_1.house.HouseAreaProject.update({ lastFetchTime: new Date(Date.now()) }, { where: { areaId: area.areaId } });
}
exports.updateFetchTime = updateFetchTime;
async function clearAuto() {
    await factory_1.house.HouseAreaProject.destroy({ where: { cityCn: 'string' } });
}
exports.clearAuto = clearAuto;
//# sourceMappingURL=service.js.map