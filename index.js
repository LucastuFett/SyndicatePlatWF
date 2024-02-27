//Dependencies
const axios = require("axios").default	//The HTTP request client

//Create a client instance
const market = axios.create({
	baseURL: "https://api.warframe.market/v1",
	timeout: 2000,
	headers: {
		"content-type": "application/json",
		"accept": "application/json",
		"platform": "pc",
		"language": "en",
	}
})

//Parse all items in red veil syndicate
const itemsRV = require("./red_veil.json")
var parsedItemsRV = []
for (let i = 0; i < itemsRV.length; i++) {
	setTimeout(() => {
		var item = itemsRV[i]
		market.get(`/items/${item.id}/orders`)
			.then(response => {
				var prices = []
				for (const order of response.data.payload.orders) {
					if(order.order_type === "sell" && order.user.region === "en" && order.user.reputation > 0){
						prices.push(order.platinum)
					}
				}
				const min = Math.min(...prices)
				const max = Math.max(...prices)
				const avg = (prices.reduce((a, b) => a + b, 0) / prices.length).toFixed(2)
				const med = prices.sort((a, b) => a - b)[Math.floor(prices.length / 2)]
				const minPlatPer10kRep = min / (item.price / 10000)
				const avgPlatPer10kRep = (avg / (item.price / 10000)).toFixed(2)
				const medianPlatPer10kRep = med / (item.price / 10000)
				const maxPlatPer10kRep = max / (item.price / 10000)

				const parsedData = {
					title: item.title,
					minimum: min,
					average: avg,
					median: med,
					maximum: max,
					minPlatPer10kRep: minPlatPer10kRep,
					averagePlatPer10kRep: avgPlatPer10kRep,
					medianPlatPer10kRep: medianPlatPer10kRep,
					maxPlatPer10kRep: maxPlatPer10kRep
				};
				parsedItemsRV.push(parsedData)

				console.log(item.title)
				console.log("Minimum:", min)
				console.log("Average:", avg)
				console.log("Median:", med)
				console.log("Maximum:", max)
				console.log("Minimum Plat per 10k Rep:", minPlatPer10kRep)
				console.log("Average Plat per 10k Rep:", avgPlatPer10kRep)
				console.log("Median Plat per 10k Rep:", medianPlatPer10kRep)
				console.log("Maximum Plat per 10k Rep:", maxPlatPer10kRep)
				console.log("\n")
			})
			.catch(console.error)
	}, i * 500)	// Sleep 500ms between requests
}

//Parse all items in steel meridian syndicate
const itemsSM = require("./steel_meridian.json")
var parsedItemsSM = []
for (let i = 0; i < itemsSM.length; i++) {
	setTimeout(() => {
		var item = itemsSM[i]
		market.get(`/items/${item.id}/orders`)
			.then(response => {
				var prices = []
				for (const order of response.data.payload.orders) {
					if(order.order_type === "sell" && order.user.region === "en" && order.user.reputation > 0){
						prices.push(order.platinum)
					}
				}
				const min = Math.min(...prices)
				const max = Math.max(...prices)
				const avg = (prices.reduce((a, b) => a + b, 0) / prices.length).toFixed(2)
				const med = prices.sort((a, b) => a - b)[Math.floor(prices.length / 2)]
				const minPlatPer10kRep = min / (item.price / 10000)
				const avgPlatPer10kRep = (avg / (item.price / 10000)).toFixed(2)
				const medianPlatPer10kRep = med / (item.price / 10000)
				const maxPlatPer10kRep = max / (item.price / 10000)

				const parsedData = {
					title: item.title,
					minimum: min,
					average: avg,
					median: med,
					maximum: max,
					minPlatPer10kRep: minPlatPer10kRep,
					averagePlatPer10kRep: avgPlatPer10kRep,
					medianPlatPer10kRep: medianPlatPer10kRep,
					maxPlatPer10kRep: maxPlatPer10kRep
				};
				parsedItemsSM.push(parsedData)

				console.log(item.title)
				console.log("Minimum:", min)
				console.log("Average:", avg)
				console.log("Median:", med)
				console.log("Maximum:", max)
				console.log("Minimum Plat per 10k Rep:", minPlatPer10kRep)
				console.log("Average Plat per 10k Rep:", avgPlatPer10kRep)
				console.log("Median Plat per 10k Rep:", medianPlatPer10kRep)
				console.log("Maximum Plat per 10k Rep:", maxPlatPer10kRep)
				console.log("\n")
			})
			.catch(console.error)
	}, i * 500 + itemsRV.length * 500 + 1000)	// Sleep 500ms between requests
}
const fs = require("fs")
const standings = require("./standings.json")
const standingRV = standings.find(standing => standing.syndicate === "red_veil").standing
const standingSM = standings.find(standing => standing.syndicate === "steel_meridian").standing
setTimeout(() => {
	// Sort the items by median plat per 10k rep
	parsedItemsRV.sort((a, b) => b.medianPlatPer10kRep - a.medianPlatPer10kRep)
	fs.writeFile(
		"./red_veil_parsed.json",
		parsedItemsRV.map(item => JSON.stringify(item)).join('\n'),
		{},
		() => {}
	);
	parsedItemsSM.sort((a, b) => b.medianPlatPer10kRep - a.medianPlatPer10kRep)
	fs.writeFile(
		"./steel_meridian_parsed.json",
		parsedItemsSM.map(item => JSON.stringify(item)).join('\n'),
		{},
		() => {}
	);
	// Print the top 3 items for each syndicate
	console.log(parsedItemsRV[0].title, parsedItemsRV[0].medianPlatPer10kRep, itemsRV.find(item => item.title === parsedItemsRV[0].title).price)
	console.log(parsedItemsRV[1].title, parsedItemsRV[1].medianPlatPer10kRep, itemsRV.find(item => item.title === parsedItemsRV[1].title).price)
	console.log(parsedItemsRV[2].title, parsedItemsRV[2].medianPlatPer10kRep, itemsRV.find(item => item.title === parsedItemsRV[2].title).price)
	console.log(parsedItemsSM[0].title, parsedItemsSM[0].medianPlatPer10kRep, itemsSM.find(item => item.title === parsedItemsSM[0].title).price)
	console.log(parsedItemsSM[1].title, parsedItemsSM[1].medianPlatPer10kRep, itemsSM.find(item => item.title === parsedItemsSM[1].title).price)
	console.log(parsedItemsSM[2].title, parsedItemsSM[2].medianPlatPer10kRep, itemsSM.find(item => item.title === parsedItemsSM[2].title).price)
	// Store the top 3 items in a json file, with the added attribute of the standing available (from standings.json) / price
	fs.writeFile(
			"./top_items.json",
			JSON.stringify({
				red_veil: [
					{
						...parsedItemsRV[0],
						price: itemsRV.find(item => item.title === parsedItemsRV[0].title).price,
						buyable: standingRV / itemsRV.find(item => item.title === parsedItemsRV[0].title).price 
					},
					{
						...parsedItemsRV[1],
						price: itemsRV.find(item => item.title === parsedItemsRV[1].title).price,
						buyable: standingRV / itemsRV.find(item => item.title === parsedItemsRV[1].title).price
					},
					{
						...parsedItemsRV[2],
						price: itemsRV.find(item => item.title === parsedItemsRV[2].title).price,
						buyable: standingRV / itemsRV.find(item => item.title === parsedItemsRV[2].title).price
					}
				],
				steel_meridian: [
					{
						...parsedItemsSM[0],
						price: itemsSM.find(item => item.title === parsedItemsSM[0].title).price,
						buyable: standingSM / itemsSM.find(item => item.title === parsedItemsSM[0].title).price
					},
					{
						...parsedItemsSM[1],
						price: itemsSM.find(item => item.title === parsedItemsSM[1].title).price,
						buyable: standingSM / itemsSM.find(item => item.title === parsedItemsSM[1].title).price 
					},
					{
						...parsedItemsSM[2],
						price: itemsSM.find(item => item.title === parsedItemsSM[2].title).price,
						buyable: standingSM / itemsSM.find(item => item.title === parsedItemsSM[2].title).price
					}
				]
			},null, 2),
			{},
			() => {}
		);
}, itemsRV.length * 500 + itemsSM.length *500 + 2000)	// Wait for all requests to finish

