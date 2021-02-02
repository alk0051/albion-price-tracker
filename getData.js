const fs = require('fs');
const request = require('request');
const path = require('path');


const dataFile = require('./datas.json');


let itemName = 'T3_FIBER';

const url = `https://www.albion-online-data.com/api/v2/stats/prices/${itemName}.json?locations=Bridgewatch,Caerleon,Fortsterling,Lymhurst,Martlock,Thetford`;


class Item {
  constructor(id, city, price) {
    this.item_id = id;
    this.city = city;
    this.price = price;
  }
};


// create and return one object with the value of item his price and city
function createItem()
{
  let itemLength = dataFile.length;
  let item = [];
  let i;

  for(i = 0; i < itemLength; i++)
  {
    item[i] = new Item(dataFile[i].item_id, dataFile[i].city, dataFile[i].sell_price_min);
  }
  
 
  console.table(item);

}

// write the req in json file
function writeData(body)
{
  fs.writeFile(path.join(__dirname, 'datas.json'), body, (err) => {
    if (err) throw err;
  })
}

// make request to albion-online-data
request(url, (error, response, body) => {

  writeData(body);

  createItem(body);

});
setInterval(() => {
  request(url, (error, response, body) => {
    console.clear();
    writeData(body);

    createItem(body);

  });
}, 60000);
    