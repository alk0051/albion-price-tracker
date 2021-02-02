import * as fs from 'fs';
import path from 'path';
import axios from 'axios';


interface Item {
  item_id: string,
  city: string,
  minPrice: number,
  maxPrice: number,
}


let itemName: string[] = ['T2_FIBER', 'T3_FIBER', 'T4_FIBER', 'T5_FIBER'];

const url: string = `https://www.albion-online-data.com/api/v2/stats/prices/${itemName}.json?
locations=Bridgewatch,Caerleon,Fortsterling,Lymhurst,Martlock,Thetford&`;


const axiosInstance = axios.create({
  baseURL: url
})


class Item {
  constructor(item_id: string, city: string, minPrice: number, maxPrice: number) {
    item: {
      item_id: this.item_id;
      city: this.city;
      minPrice: this.minPrice;
      maxPrice: this.maxPrice;
    }
  }
}


const orderByMinPrice = async (items: Item[], id: string) => {
  items.sort((a: Item, b: Item) => (a.minPrice > b.minPrice) ? 1 : -1);
  
  let array: Item[];
  let biggerValueItem: Item = {
    item_id: '',
    city: '',
    minPrice: 0,
    maxPrice: 0
  };
  
  let smallValueItem: Item = {
    item_id: '',
    city: '',
    minPrice: 0,
    maxPrice: 0
  };

  items.map((item) => {
    if (item.item_id === id) {
      array.push(item);
      array.sort((a: Item, b: Item) => (a.minPrice > b.minPrice) ? 1 : -1);
      biggerValueItem = array[array.length - 1];
      smallValueItem = array[0];
    }
  });

  return [items, biggerValueItem, smallValueItem];
}


//setInterval(() => {
  axiosInstance.get('/').then( async (response) => {
    const allItems = response.data.map(
      (data: {
        item_id: {item_id: string},
        city: {city: string},
        sell_price_min: {sell_price_min: number},
        sell_price_max: {sell_price_max: number},
      }) => {
        return {
          item_id: data.item_id,
          city: data.city,
          minPrice: data.sell_price_min,
          maxPrice: data.sell_price_max,
        }
      }
    );
    fs.unlink('./datas.json', () => {
      console.log('[DELETED]: File data.json deleted');
    });

    fs.appendFile('./datas.json', JSON.stringify(allItems, null, 2), () => {
      console.log(orderByMinPrice);
    });
    
    fs.readFile('./datas.json', 'utf8',(err, data) => {
      if (err) throw err;
      
      const items = JSON.parse(data);

      items.map((item: Item) => {
        const order = orderByMinPrice(items, item.item_id);
        console.table(order);
      });

    });
  });
//}, 862000);

