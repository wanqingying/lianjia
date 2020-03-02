"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsdom_1 = require("jsdom");
const axios_1 = require("axios");
const t = Date.now();
function main() {
    Promise.all([
        getTag()
    ]).then(() => {
        console.log('============');
        console.log(Date.now() - t);
    });
}
main();
function getTag() {
    return new Promise(resolve => {
        const url = 'https://gy.lianjia.com/ershoufang/qingzhenshi/pg4/';
        axios_1.default.get(url).then(res => {
            const dom = new jsdom_1.JSDOM(`${res.data}`);
            dom.window.onload = function (res) {
                const tagt = dom.window.document.querySelectorAll('.sellListContent');
                const tag = dom.window.document.querySelectorAll('.sellListContent li');
                debugger;
                const fs = Array.from(tag).map((li) => {
                    const [xiaoqu, community] = Array.from(li.querySelectorAll('.positionInfo a'));
                    let k = {
                        houseDetailId: (li === null || li === void 0 ? void 0 : li.dataset['lj_action_housedel_id']) || '',
                        community: (community === null || community === void 0 ? void 0 : community.textContent) || '',
                        communityLink: (community === null || community === void 0 ? void 0 : community.href) || ''
                    };
                    return k;
                });
                console.log(fs.length);
                resolve();
            };
        });
    });
}
//# sourceMappingURL=dom.js.map