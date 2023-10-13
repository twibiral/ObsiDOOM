import {Plugin, Modal} from 'obsidian';
import SidePanel, {SIDE_PANEL_ID} from "./SidePanel";


export default class ObsiDOOM extends Plugin {
	async onload() {
		this.registerView(
			SIDE_PANEL_ID, (leaf) => new SidePanel(leaf)
		);

		this.addCommand({
			id: 'open-obsidoom',
			name: 'Open Obsidoom',
			callback: () => {
				new OpenObsidoom(this.app).open();
			}
		});

		await SidePanel.activate(this.app.workspace);
	}
}

class OpenObsidoom extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const {contentEl} = this;
		contentEl.setText('Woah!');
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}
