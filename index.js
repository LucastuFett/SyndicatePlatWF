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
const items = require("./red_veil.json")
var parsedItems = []
for (let i = 0; i < items.length; i++) {
	setTimeout(() => {
		var item = items[i]
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
				parsedItems.push(parsedData)

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
const fs = require("fs")
setTimeout(() => {
	// Sort the items by median plat per 10k rep
	parsedItems.sort((a, b) => b.medianPlatPer10kRep - a.medianPlatPer10kRep)
	fs.writeFile(
		"./red_veil_parsed.json",
		parsedItems.map(item => JSON.stringify(item)).join('\n'),
		{},
		() => {}
	);
}, items.length * 500 + 1000)	// Wait for all requests to finish

