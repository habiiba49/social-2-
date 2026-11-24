"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gender = exports.Provider = void 0;
var Provider;
(function (Provider) {
    Provider[Provider["GOOGLE"] = 0] = "GOOGLE";
    Provider[Provider["LOCAL"] = 1] = "LOCAL";
    Provider[Provider["FACEBOOK"] = 2] = "FACEBOOK";
})(Provider || (exports.Provider = Provider = {}));
var Gender;
(function (Gender) {
    Gender[Gender["male"] = 0] = "male";
    Gender[Gender["female"] = 1] = "female";
})(Gender || (exports.Gender = Gender = {}));
