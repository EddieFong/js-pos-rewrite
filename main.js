"use strict";

function loadAllItems() {
	return [
		{
			barcode: "ITEM000000",
			name: "可口可乐",
			unit: "瓶",
			price: 3.00
		},
		{
			barcode: "ITEM000001",
			name: "雪碧",
			unit: "瓶",
			price: 3.00
		},
		{
			barcode: "ITEM000002",
			name: "苹果",
			unit: "斤",
			price: 5.50
		},
		{
			barcode: "ITEM000003",
			name: "荔枝",
			unit: "斤",
			price: 15.00
		},
		{
			barcode: "ITEM000004",
			name: "电池",
			unit: "个",
			price: 2.00
		},
		{
			barcode: "ITEM000005",
			name: "方便面",
			unit: "袋",
			price: 4.50
		}
	];
}

function loadPromotions() {
	return [
		{
			type: "BUY_TWO_GET_ONE_FREE",
			barcodes: [
				"ITEM000000",
				"ITEM000001",
				"ITEM000005"
			]
		}
	];
}

function constItemDict(itemList, allItemList){

	let uniqueItemList = constructUniqueItemList(itemList);
	let consolidatedItemDict = [];

	uniqueItemList.forEach(element => {
		constructUniqueItem(itemList, element, allItemList, consolidatedItemDict);
	});

	return consolidatedItemDict;
}

function constructUniqueItemList(itemList) {
	const onlyUnique = function (value, index, self) { 
		return self.indexOf(value) === index;
	};
	return itemList.map((x) => x.split("-")[0]).filter(onlyUnique);
}

function constructUniqueItem(itemList, element, allItemList, consolidatedItemDict) {
	const newItem = {};
	const matchedItem = itemList.filter((x) => ((x.substring(0, 10)) === element));
	let count = 0;
	matchedItem.forEach((item) => {
		count += (item.includes("-")) ? parseFloat(item.split("-")[1]) : 1;
	});
	newItem.count = count;
	const matchedItemForUpdate = findBoughtItem(allItemList, element)
	suppBoughtInfo(newItem, matchedItemForUpdate);
	consolidatedItemDict.push(newItem);
}

function findBoughtItem(allItemList, element) {
	return allItemList.find((x) => x.barcode.substring(0, 10) === element);
}

function suppBoughtInfo(newItem, matchedItemForUpdate) {
	newItem.barcode = matchedItemForUpdate.barcode;
	newItem.name = matchedItemForUpdate.name;
	newItem.unit = matchedItemForUpdate.unit;
	newItem.price = matchedItemForUpdate.price;
}

function calProm(consolidatedItemDict, promList){
	let consolidatedItemWithPromDict = [];
	
	consolidatedItemDict.forEach((item) => {
		constructItem(item, promList, consolidatedItemWithPromDict);
	});
	
	return consolidatedItemWithPromDict;
}

function constructItem(item, promList, consolidatedItemWithPromDict) {
	let newItem = item;
	let buy2Get1Free = matchingPromotion(promList);
	newItem.subTotal = newItem.price * (newItem.count - ((buy2Get1Free.barcodes.includes(item.barcode)) ? parseInt(newItem.count / 3) : 0));
	consolidatedItemWithPromDict.push(newItem);
}

module.exports = {
	constItemDict,
	loadAllItems,
	loadPromotions,
	calProm
};


function matchingPromotion(promList) {
	return promList.find((x) => x.type === "BUY_TWO_GET_ONE_FREE");
}

