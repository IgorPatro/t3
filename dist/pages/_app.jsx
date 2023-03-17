"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("@/utils/api");
require("@/styles/globals.css");
const MyApp = ({ Component, pageProps }) => {
    return <Component {...pageProps}/>;
};
exports.default = api_1.api.withTRPC(MyApp);
