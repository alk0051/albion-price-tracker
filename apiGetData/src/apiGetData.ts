import * as fs from 'fs';
import axios from 'axios';


interface Item {
  item_id: string,
	quality: number,
  city: string,
  minPrice: number,
}


const t2: string[] = ['T2_WOOD', 'T2_ROCK', 'T2_ORE', 'T2_FIBER', 'T2_HIDE'];
const t3: string[] = ['T3_WOOD', 'T3_ROCK', 'T3_ORE', 'T3_FIBER', 'T3_HIDE'];
const t4: string[] = ['T4_WOOD', 'T4_ROCK', 'T4_ORE', 'T4_FIBER', 'T4_HIDE'];
const t5: string[] = ['T5_WOOD', 'T5_ROCK', 'T5_ORE', 'T5_FIBER', 'T5_HIDE'];

const url: string = `https://www.albion-online-data.com/api/v2/stats/prices/${t2},${t3},${t4},${t5}.json?
locations=Bridgewatch,Caerleon,Fortsterling,Lymhurst,Martlock,Thetford&`;


const axiosInstance = axios.create({
  baseURL: url
});


const updateFile = (arrayItems: Item[], fileName: string) => {
	fs.unlinkSync(`${__dirname}/data/${fileName}`);
  fs.appendFile(`${__dirname}/data/${fileName}`, JSON.stringify(arrayItems, null, 2), () => {});
}

const readAndReturnFile = (fileName: string) => {
  fs.readFile(`${__dirname}/data/${fileName}`, 'utf8', (err, data) => {
    if (err) throw err;
    
    const items = JSON.parse(data);

    console.log(items);
  });
}


axiosInstance.get('/').then( async (response) => {
  const getAllItems: Item[] = response.data.map(
    (data: {
      item_id: {item_id: string},
			quality: {quality: string},
      city: {city: string},
      sell_price_min: {sell_price_min: number},
    }) => {
      return {
        item_id: data.item_id,
				quality: data.quality,
        city: data.city,
        minPrice: data.sell_price_min,
      }
    }
  );

	let t2_items: Item[] = [];
	let t3_items: Item[] = [];
	let t4_items: Item[] = [];
	let t5_items: Item[] = [];

	getAllItems.map((item) => {
		if (item.item_id.indexOf('2') > -1) {
			t2_items.push(item);
		}
		if (item.item_id.indexOf('3') > -1) {
			t3_items.push(item);
		}
		if (item.item_id.indexOf('4') > -1) {
			t4_items.push(item);
		}
		if (item.item_id.indexOf('5') > -1) {
			t5_items.push(item);
		}
	});

	t2_items.sort((a, b) => ((a.minPrice > b.minPrice) ? 1 : ((b.minPrice > a.minPrice) ? -1 : 0)));
	t3_items.sort((a, b) => ((a.minPrice > b.minPrice) ? 1 : ((b.minPrice > a.minPrice) ? -1 : 0)));
	t4_items.sort((a, b) => ((a.minPrice > b.minPrice) ? 1 : ((b.minPrice > a.minPrice) ? -1 : 0)));
	t5_items.sort((a, b) => ((a.minPrice > b.minPrice) ? 1 : ((b.minPrice > a.minPrice) ? -1 : 0)));
  
	updateFile(t2_items, 't2_items.json');
	updateFile(t3_items, 't3_items.json');
	updateFile(t4_items, 't4_items.json');
	updateFile(t5_items, 't5_items.json');

});

readAndReturnFile('t2_items.json');
readAndReturnFile('t3_items.json');
readAndReturnFile('t4_items.json');
readAndReturnFile('t5_items.json');
