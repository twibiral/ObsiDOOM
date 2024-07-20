import {Plugin} from 'obsidian';
import SidePanel, {SIDE_PANEL_ID} from "./SidePanel";


export default class ObsiDOOM extends Plugin {
	async onload() {
		this.addCommand({
			id: "open",
			name: "Open game",
			callback: () => SidePanel.activate(this.app.workspace)
		});

		this.registerView(
			SIDE_PANEL_ID, (leaf) => new SidePanel(leaf)
		);

		await SidePanel.activate(this.app.workspace);
	}
}
