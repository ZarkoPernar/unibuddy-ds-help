import fuzzysearch from "fuzzysearch";

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

export default function handler(req, res) {
	if (!req.body.text) {
		res.status(200).send("You must input a search term");
		return;
	}

	const searchTerm = req.body.text.toLowerCase();
	const finds = [];
	for (const item of data) {
		const searchThrough = (item.path + item.name).toLowerCase();
		if (fuzzysearch(searchTerm, searchThrough)) finds.push(item);
	}
	const result = finds
		.map((item) => `${item.name} - ${baseUrl + item.path}`)
		.join("\n");
	res.status(200).send(result);
}
