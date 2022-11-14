import {Plugin} from 'obsidian';
import SidePanel, {SIDE_PANEL_ID} from "./SidePanel";


export default class ObsiDOOM extends Plugin {
	async onload() {
		this.registerView(
			SIDE_PANEL_ID, (leaf) => new SidePanel(leaf)
		);

		SidePanel.activate(this.app.workspace);
	}
}
