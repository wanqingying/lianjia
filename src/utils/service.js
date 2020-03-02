"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const factory_1 = require("./factory");
const sequelize_1 = require("sequelize");
const config_1 = require("./config");
async function findOrCreateHouseInfo(data) {
    console.log('foc', data.houseDetailId);
    const pw = await factory_1.house.HouseInfoProject.findOrCreate({
        where: { houseDetailId: data.houseDetailId },
        defaults: data
    });
    debugger;
    return pw;
}
exports.findOrCreateHouseInfo = findOrCreateHouseInfo;
async function findOrCreateArea(data) {
    const res = await factory_1.house.HouseAreaProject.findOrCreate({
        where: { cityEn: data.cityEn, nameEn: data.nameEn },
        defaults: data
    });
    return res;
}
exports.findOrCreateArea = findOrCreateArea;
async function findNextOne() {
    const one = await factory_1.house.HouseAreaProject.findOne({
        where: {
            lastFetchTime: { [sequelize_1.Op.lt]: new Date(Date.now() - config_1.config.updateTimeLine) },
            cityCn: '重庆'
        }
    });
    return one;
}
exports.findNextOne = findNextOne;
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