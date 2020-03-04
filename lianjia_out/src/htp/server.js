"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const sere = http_1.createServer((req, res) => {
    res.write('hello');
    res.end();
});
sere.listen(3000, '127.0.0.1');
//# sourceMappingURL=server.js.map