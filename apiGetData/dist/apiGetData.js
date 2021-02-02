"use strict";
exports.__esModule = true;
var fs = require("fs");
var axios = require("axios");
var itemName = ['T2_FIBER', 'T3_FIBER', 'T4_FIBER', 'T5_FIBER'];
var url = "https://www.albion-online-data.com/api/v2/stats/prices/" + itemName + ".json?\nlocations=Bridgewatch,Caerleon,Fortsterling,Lymhurst,Martlock,Thetford";
var axiosInstance = axios.create({
    baseURL: url
});
var Item = /** @class */ (function () {
    function Item(id, city, minPrice, maxPrice) {
        this.item_id = id;
        this.city = city;
        this.minPrice = minPrice;
        this.maxPrice = maxPrice;
    }
    return Item;
}());
;
var allDatas = axiosInstance.get('/').then(function (response) {
    var item = response.data;
    try {
        fs.appendFile('./datas', JSON.stringify(item), function () { });
        console.log(item);
    }
    catch (error) {
        console.log(error);
    }
});
