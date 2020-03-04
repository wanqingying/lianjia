"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
let url = 'http://127.0.0.1';
async function test(name, port) {
    let qs = [];
    for (let i = 0; i < 10000; i++) {
        qs.push(axios_1.default.get(url + ':' + port));
    }
    const start = Date.now();
    const rk = await Promise.all(qs);
    console.log(name, rk.length, Date.now() - start);
}
async function main() {
    await test('node', 3000);
    await test('go', 4000);
}
main().then(console.log);
//# sourceMappingURL=htpTest.js.map