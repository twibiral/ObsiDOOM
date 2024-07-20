import {ItemView, Workspace, WorkspaceLeaf} from "obsidian";


export const SIDE_PANEL_ID = "obsidoom";

const GAME_URLS = require('../GAME_URLS.json');

export default class SidePanel extends ItemView {
	private readonly endGameButton: HTMLButtonElement = document.createElement("button");
	private readonly openGameButton: HTMLButtonElement = document.createElement("button");
	private gameSelect: HTMLSelectElement = document.createElement("select");
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
				this.generateGameIFrame(this.gameSelect.value)
			);

			this.enableButton(this.endGameButton);
		});

		// Create dropdown menu to select games
		this.dropDownDiv.addClass("doom-dropdown");
		const label = document.createElement("label");
		label.setText("Select Game:");

		this.gameSelect.id = "game-select";
		this.gameSelect.name = "game-select";

		for (const game in GAME_URLS) {
			const option = document.createElement("option");
			option.value = game;
			option.text = game;
			this.gameSelect.appendChild(option);
		}

		this.gameSelect.onchange = (_) => {
			this.gameDiv.children[0].remove();
			this.disableButton(this.openGameButton);
			this.gameDiv.appendChild(
				this.generateGameIFrame(this.gameSelect.value)
			);
			this.enableButton(this.endGameButton);
		}

		this.dropDownDiv.appendChild(label);
		this.dropDownDiv.appendChild(this.gameSelect);
	}

	/**
	 * Open the view. Ensure that there may only be one view at a time.
	 * If there isn't one created, then create a new one.
	 * @param workspace the workspace of the Obsidian app
	 */
	static async activate(workspace: Workspace) {
		workspace.detachLeavesOfType(SIDE_PANEL_ID);

		await workspace.getRightLeaf(false)?.setViewState({
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
		const container = this.contentEl;

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
		gameIFrame.setAttr("src", GAME_URLS[gameName]);
		gameIFrame.toggleAttribute("allowfullscreen");

		return gameIFrame;
	}
}
