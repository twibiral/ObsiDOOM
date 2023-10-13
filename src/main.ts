import {Plugin, Modal} from 'obsidian';
import SidePanel, {SIDE_PANEL_ID} from "./SidePanel";


export default class ObsiDOOM extends Plugin {
	async onload() {
		this.registerView(
			SIDE_PANEL_ID, (leaf) => new SidePanel(leaf)
		);

		await SidePanel.activate(this.app.workspace);

		this.addCommand({
			id: 'open-obsidoom',
			name: 'Open Obsidoom',
			callback: () => {
				    this.registerView(
      				SIDE_PANAEL_ID,
      				(leaf) => new SidePanel(leaf)
    				);
			}
		});
	}
}
