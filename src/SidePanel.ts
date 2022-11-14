import {ItemView, Workspace, WorkspaceLeaf} from "obsidian";


export const SIDE_PANEL_ID = "ObsiDOOM Side Panel";

const GAME_URLS = JSON.parse(
	`{
"DOOM": "https://dos.zone/player/?bundleUrl=https%3A%2F%2Fcdn.dos.zone%2Fcustom%2Fdos%2Fdoom.jsdos?anonymous=1",
"Prince of Persia": "https://dos.zone/player/?bundleUrl=https%3A%2F%2Fcdn.dos.zone%2Foriginal%2F2X%2F1%2F1179a7c9e05b1679333ed6db08e7884f6e86c155.jsdos?anonymous=1",
"Mortal Combat": "https://dos.zone/player/?bundleUrl=https%3A%2F%2Fcdn.dos.zone%2Foriginal%2F2X%2F8%2F872f3668c36085d0b1ace46872145285364ee628.jsdos?anonymous=1",
"GTA": "https://dos.zone/player/?bundleUrl=https%3A%2F%2Fcdn.dos.zone%2Fcustom%2Fdos%2Fgta-mobile.jsdos?anonymous=1",
"Sim City": "https://dos.zone/player/?bundleUrl=https%3A%2F%2Fcdn.dos.zone%2Foriginal%2F2X%2F7%2F744842062905f72648a4d492ccc2526d039b3702.jsdos?anonymous=1",
"Need for Speed": "https://dos.zone/player/?bundleUrl=https%3A%2F%2Fcdn.dos.zone%2Fcustom%2Fdos%2Fnfs.jsdos?anonymous=1"
}`
);

export default class SidePanel extends ItemView {
	private readonly endGameButton: HTMLButtonElement = document.createElement("button");
	private readonly openGameButton: HTMLButtonElement = document.createElement("button");
	private gameDiv: HTMLDivElement = document.createElement("div");
	private dropDownDiv: HTMLDivElement = document.createElement("div");

	constructor(leaf: WorkspaceLeaf) {
		super(leaf);

		// Create button that closes the game
		this.endGameButton = document.createElement("button");
		this.endGameButton.addClass("doom-button");
		this.endGameButton.setText("Close Game");
		this.endGameButton.onClickEvent(() => {
			this.disableButton(this.endGameButton);

			this.gameDiv.children[0].remove();

			this.enableButton(this.openGameButton);
		});

		// Create button that reopens the game
		this.openGameButton = document.createElement("button");
		this.openGameButton.addClass("doom-button");
		this.openGameButton.setText("Open Game");
		this.openGameButton.onClickEvent(() => {
			this.disableButton(this.openGameButton);

			this.gameDiv.appendChild(
				this.generateGameIFrame()
			);

			this.enableButton(this.endGameButton);
		});

		// Create dropdown menu to select games
		this.dropDownDiv.addClass("doom-dropdown");
		const label = document.createElement("label");
		label.setText("Select Game:  ");

		const select = document.createElement("select");
		select.id = "game-select";
		select.name = "game-select";

		for (const game in GAME_URLS) {
			const option = document.createElement("option");
			option.value = game;
			option.text = game;
			select.appendChild(option);
		}

		select.onchange = (ev) => {
			console.log(select.value);
			this.gameDiv.children[0].remove();
			this.disableButton(this.openGameButton);
			this.gameDiv.appendChild(
				this.generateGameIFrame(select.value)
			);
			this.enableButton(this.endGameButton);
		}

		this.dropDownDiv.appendChild(label);
		this.dropDownDiv.appendChild(select);
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
		header.addClass("doom-header");
		container.appendChild(header);

		container.appendChild(this.dropDownDiv);

		container.appendChild(this.gameDiv);
		this.gameDiv.appendChild(
			this.generateGameIFrame()
		);

		this.disableButton(this.openGameButton);
		container.appendChild(this.openGameButton);

		this.enableButton(this.endGameButton);
		container.appendChild(this.endGameButton);
	}

	private disableButton(button: HTMLButtonElement) {
		if (!button.hasClass("doom-button-disabled"))
			button.addClass("doom-button-disabled");
		button.disabled = true;
	}

	private enableButton(button: HTMLButtonElement) {
		if (button.hasClass("doom-button-disabled"))
			button.removeClass("doom-button-disabled");
		button.disabled = false;
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
