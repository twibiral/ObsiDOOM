import {ItemView, setIcon, Workspace, WorkspaceLeaf} from "obsidian";
import {basename} from "path";
import {DosPlayerOptionsWithDefaults} from "js-dos";
import * as fs from "fs";
import {containsAllTypesByName} from "@typescript-eslint/type-utils";


export const SIDE_PANEL_ID = "ObsiDOOM Side Panel";

const GAME_URLS = JSON.parse(
	`{
"DOOM": "https://dos.zone/player/?bundleUrl=https%3A%2F%2Fcdn.dos.zone%2Fcustom%2Fdos%2Fdoom.jsdos?anonymous=1",
"PRINCE OF PERSIA": "https://dos.zone/player/?bundleUrl=https%3A%2F%2Fcdn.dos.zone%2Foriginal%2F2X%2F1%2F1179a7c9e05b1679333ed6db08e7884f6e86c155.jsdos?anonymous=1",
"MORTAL COMBAT": "https://dos.zone/player/?bundleUrl=https%3A%2F%2Fcdn.dos.zone%2Foriginal%2F2X%2F8%2F872f3668c36085d0b1ace46872145285364ee628.jsdos?anonymous=1",
"GTA": "https://dos.zone/player/?bundleUrl=https%3A%2F%2Fcdn.dos.zone%2Fcustom%2Fdos%2Fgta-mobile.jsdos?anonymous=1",
"SIM CITY": "https://dos.zone/player/?bundleUrl=https%3A%2F%2Fcdn.dos.zone%2Foriginal%2F2X%2F7%2F744842062905f72648a4d492ccc2526d039b3702.jsdos?anonymous=1",
"NEED FOR SPEED": "https://dos.zone/player/?bundleUrl=https%3A%2F%2Fcdn.dos.zone%2Fcustom%2Fdos%2Fnfs.jsdos?anonymous=1"
}
`
);

export default class SidePanel extends ItemView {

	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
	}
	/**
	 * Open the view. Ensure that there may only be one view at a time.
	 * If there isn't one created, then create a new one.
	 * @param workspace the workspace of the Obsidian app
	 */
	static async activate(workspace: Workspace) {
		workspace.detachLeavesOfType(SIDE_PANEL_ID);

		await workspace.getRightLeaf(false).setViewState({
			type: SIDE_PANEL_ID,
			active: true,
		});

		workspace.revealLeaf(
			workspace.getLeavesOfType(SIDE_PANEL_ID)[0]
		);
	}

	getViewType(): string {
		return SIDE_PANEL_ID;
	}

	getDisplayText(): string {
		return "ObsiDOOM";
	}

	getIcon(): string {
		return "swords";
	}

	/**
	 * Set up the HTML of the view
	 */
	async onOpen() {
		console.log("Opened ObsiDOOM Side Panel");

		const container = this.contentEl;

		const header = document.createElement("h3");
		header.textContent = "DOOM";
		header.style.marginLeft = "auto";
		header.style.marginRight = "auto";
		container.appendChild(header);

		container.appendChild(
			this.generateGameIFrame()
		);

		const removeButton = document.createElement("button")

		// @ts-ignore
		removeButton.onclick((ev) => {
			// @ts-ignore
			document.getElementById("gameIFrame").remove();
		});
		container.appendChild(removeButton);
	}

	generateGameIFrame(gameName: string = "DOOM"): HTMLIFrameElement {
		const gameIFrame = document.createElement("iframe");
		gameIFrame.id = "gameIFrame";
		gameIFrame.style.position = "relative";
		gameIFrame.style.height = "70vh";
		gameIFrame.style.width = "100%";
		gameIFrame.style.border = "1px solid black";
		gameIFrame.setAttr("src", GAME_URLS[gameName]);
		gameIFrame.toggleAttribute("allowfullscreen");

		return gameIFrame;
	}

	async onClose() {
		for (let child of Array.from(this.contentEl.children)) {
			child.remove();
		}
		this.contentEl.empty();
		this.contentEl.remove()
	}
}
