import fuzzysearch from "fuzzysearch";
import puppeteer from "puppeteer";
import axios from "axios";
import {data} from "./pages.json";

const baseUrl = "https://design.unibuddy.com";

const sendPicture = async ({finds, responseUrl}) => {
	const browser = await puppeteer.launch({
		headless: true,
		args: ["--no-sandbox", "--disable-setuid-sandbox"],
	});
	const maybeImages = await Promise.all(
		finds.map(async (item) => {
			const page = await browser.newPage();
			await page.goto(baseUrl + item.path);

			const element = await page.$(
				'[href^="https://playroom.unibuddy.io/preview"]',
			);

			if (!element) return;

			const previewUrl = await element.evaluate((node) => node.href);
			await page.goto(previewUrl);
			const previewElement = await page.$(
				'[class*="SplashScreen__hideSplash"]',
			);
			await wait(4000);
			const bodyEl = await page.$("body");
			const rect = await bodyEl.boxModel();
			const width = parseInt(rect.width);
			const height = parseInt(rect.height);
			await page.setViewport({
				width,
				height,
			});
			const result = await page.screenshot({
				clip: {
					x: 0,
					y: 0,
					width,
					height,
				},
			});
			const image = result; //.toString("base64");
			return {image, item};
		}),
	);

	await browser.close();

	const items = maybeImages.filter(Boolean);

	axios
		.post(responseUrl, {
			blocks: items.map(({image, item}) => ({
				type: "image",
				image_url: `data:image/png;base64,${image}`,
				alt_text: item.name,
			})),
		})
		.then((res) => {
			console.log(`Sent Slack Response, statusCode: ${res.statusCode}`);
			console.log(res);
		})
		.catch((error) => {
			console.error(error);
		});

	// res.status(200).send(
	// 	`<html>
	//         <body>
	//             <h1>Hello</h1>
	//             ${items.map(
	// 				({image, item}) => `
	//                     <h2>${item.name}</h2>
	//                     <img src="data:image/png;base64,${image}"/>
	//                 `,
	// 			)}
	//         </body>
	//     </html>`,
	// );
};
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default async function handler(req, res) {
	if (!req.body.text) {
		res.status(200).send("You must input a search term");
		return;
	}
	// const searchTerm = req.query.text.toLowerCase();
	const [searchTerm, shouldRender] = req.body.text.toLowerCase().split(" ");
	const responseUrl = req.body.response_url;

	const finds = [];
	for (const item of data) {
		const searchThrough = (item.path + item.name).toLowerCase();
		if (fuzzysearch(searchTerm, searchThrough)) finds.push(item);
	}
	if (finds.length > 0) {
		const urls = finds
			.map((item) => `${item.name} - ${baseUrl + item.path}`)
			.join("\n");

		sendPicture({finds, responseUrl});

		res.status(200).send(urls);
	} else {
		res.status(200).send("We ain't found shit!");
	}
}
