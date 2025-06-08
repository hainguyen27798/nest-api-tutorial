"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocialProviderList = exports.SocialProvider = void 0;
const lodash_1 = require("lodash");
var SocialProvider;
(function (SocialProvider) {
    SocialProvider["GOOGLE"] = "google";
    SocialProvider["LINKEDIN"] = "linkedin";
})(SocialProvider || (exports.SocialProvider = SocialProvider = {}));
exports.SocialProviderList = (0, lodash_1.values)(SocialProvider);
//# sourceMappingURL=social-provider.js.map