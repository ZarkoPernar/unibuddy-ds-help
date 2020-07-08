import fuzzysearch from "fuzzysearch";
import puppeteer from "puppeteer";

const data = [
	{
		folderArray: ["", "how-to"],
		folderName: "how to",
		path: "/how-to/contribute",
		name: "Contribute",
	},
	{
		folderArray: ["", "how-to"],
		folderName: "how to",
		path: "/how-to/icons",
		name: "Icons",
	},
	{
		folderArray: ["", "how-to"],
		folderName: "how to",
		path: "/how-to/layout",
		name: "Layout",
	},
	{
		folderArray: ["", "components", "a11y"],
		folderName: "a11y",
		path: "/components/a11y/skip-nav",
		name: "SkipNav",
	},
	{
		folderArray: ["", "components", "a11y"],
		folderName: "a11y",
		path: "/components/a11y/visually-hidden",
		name: "VisuallyHidden",
	},
	{
		folderArray: ["", "components", "apollo"],
		folderName: "apollo",
		path: "/components/apollo/query",
		name: "Query",
	},
	{
		folderArray: ["", "components", "forms"],
		folderName: "forms",
		path: "/components/forms/introduction",
		name: "Introduction",
	},
	{
		folderArray: ["", "components", "general"],
		folderName: "general",
		path: "/components/general/accordion",
		name: "Accordion",
	},
	{
		folderArray: ["", "components", "general"],
		folderName: "general",
		path: "/components/general/avatar-stack",
		name: "AvatarStack",
	},
	{
		folderArray: ["", "components", "general"],
		folderName: "general",
		path: "/components/general/avatar",
		name: "Avatar",
	},
	{
		folderArray: ["", "components", "general"],
		folderName: "general",
		path: "/components/general/badge",
		name: "Badge",
	},
	{
		folderArray: ["", "components", "general"],
		folderName: "general",
		path: "/components/general/button-group",
		name: "ButtonGroup",
	},
	{
		folderArray: ["", "components", "general"],
		folderName: "general",
		path: "/components/general/button-link",
		name: "ButtonLink",
	},
	{
		folderArray: ["", "components", "general"],
		folderName: "general",
		path: "/components/general/button",
		name: "Button",
	},
	{
		folderArray: ["", "components", "general"],
		folderName: "general",
		path: "/components/general/dropdown",
		name: "Dropdown",
	},
	{
		folderArray: ["", "components", "general"],
		folderName: "general",
		path: "/components/general/loading-button",
		name: "LoadingButton",
	},
	{
		folderArray: ["", "components", "general"],
		folderName: "general",
		path: "/components/general/tooltip",
		name: "Tooltip",
	},
	{
		folderArray: ["", "components", "layout"],
		folderName: "layout",
		path: "/components/layout/box",
		name: "Box",
	},
	{
		folderArray: ["", "components", "layout"],
		folderName: "layout",
		path: "/components/layout/hidden",
		name: "Hidden",
	},
	{
		folderArray: ["", "components", "layout"],
		folderName: "layout",
		path: "/components/layout/inline",
		name: "Inline",
	},
	{
		folderArray: ["", "components", "layout"],
		folderName: "layout",
		path: "/components/layout/split",
		name: "Split",
	},
	{
		folderArray: ["", "components", "layout"],
		folderName: "layout",
		path: "/components/layout/stack",
		name: "Stack",
	},
	{
		folderArray: ["", "components", "layout"],
		folderName: "layout",
		path: "/components/layout/tiles",
		name: "Tiles",
	},
	{
		folderArray: ["", "components", "overlays"],
		folderName: "overlays",
		path: "/components/overlays/alert",
		name: "Alert",
	},
	{
		folderArray: ["", "components", "overlays"],
		folderName: "overlays",
		path: "/components/overlays/confirm-prompt",
		name: "ConfirmPrompt",
	},
	{
		folderArray: ["", "components", "overlays"],
		folderName: "overlays",
		path: "/components/overlays/confirm-text-prompt",
		name: "ConfirmTextPrompt",
	},
	{
		folderArray: ["", "components", "overlays"],
		folderName: "overlays",
		path: "/components/overlays/dialog",
		name: "Dialog",
	},
	{
		folderArray: ["", "components", "overlays"],
		folderName: "overlays",
		path: "/components/overlays/drawer",
		name: "Drawer",
	},
	{
		folderArray: ["", "components", "typography"],
		folderName: "typography",
		path: "/components/typography/heading",
		name: "Heading",
	},
	{
		folderArray: ["", "components", "typography"],
		folderName: "typography",
		path: "/components/typography/text-block",
		name: "TextBlock",
	},
	{
		folderArray: ["", "hooks"],
		folderName: "hooks",
		path: "/hooks/use-clipboard",
		name: "UseClipboard",
	},
	{
		folderArray: ["", "hooks"],
		folderName: "hooks",
		path: "/hooks/use-local-storage",
		name: "UseLocalStorage",
	},
	{
		folderArray: ["", "hooks"],
		folderName: "hooks",
		path: "/hooks/use-toast",
		name: "UseToast",
	},
];

const baseUrl = "https://design.unibuddy.com";

const sendPicture = async () => {};
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default async function handler(req, res) {
	if (!req.body.text) {
		res.status(200).send("You must input a search term");
		return;
	}
	// const searchTerm = req.query.text.toLowerCase();
	const [searchTerm, shouldRender] = req.body.text.toLowerCase().split(" ");
	// const responseUrl = req.body.response_url;

	const finds = [];
	for (const item of data) {
		const searchThrough = (item.path + item.name).toLowerCase();
		if (fuzzysearch(searchTerm, searchThrough)) finds.push(item);
	}
	if (finds.length > 0) {
		const urls = finds
			.map((item) => `${item.name} - ${baseUrl + item.path}`)
			.join("\n");

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
				const image = result.toString("base64");
				return {image, item};
			}),
		);

		await browser.close();

		const items = maybeImages.filter(Boolean);

		res.status(200).json({
			blocks: items.map(({image, item}) => ({
				type: "image",
				image_url: `data:image/png;base64,${image}`,
				alt_text: item.name,
			})),
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
	} else {
		res.status(200).send("We ain't found shit!");
	}
}
