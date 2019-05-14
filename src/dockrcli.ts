/*---------------------------------------------------------
 * Copyright (C) Dukagjin Surdulli. All rights reserved.
 *--------------------------------------------------------*/

'use strict';

import * as vscode from 'vscode';
import { spawn } from 'child_process'

export class DockrCli
{
	readonly defaultCommand: string = 'dockr'

	exec: any = '';
	statusStr: string = '';
	commandStr: string = '';
	currentWorkspace?: string
	statusBarItem: vscode.StatusBarItem;

	/**
	 * DockrCli constructor.
	 * 
	 * @param command string
	 * @param mode string
	 */
	constructor() {
		this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 0)
		this.setWorkspace()
	}

	/**
	 * Set the command which will be executed.
	 * 
	 * @return this
	 */
	public command(command: string): this {
		this.commandStr = command
		return this
	}

	/**
	 * Set the status bar message.
	 * 
	 * @param message string
	 */
	public status(message: string): this {
		this.statusStr = message
		return this
	}

	/**
	 * Execute the dockr commands.
	 * 
	 * @return this
	 */
	public execute(): this {
		if (! this.command) throw 'Command must be set.'

		this.showIcon()
		this.setExecutable()

		let process = spawn(
			this.exec, 
			[
				this.commandStr, 
			],
			{
				shell: true,
				env: { DOCKR_PATH: this.currentWorkspace }
			}
		);

		process.on('exit', (data) => this.hideIcon() );

		process.stdout.on('data', (data) => console.log(`stdout: ${data}`))

		process.stderr.on('data', (data) => {
			this.hideIcon()
			console.error(`Error: ${data}`)
			vscode.window.showErrorMessage(`${data}`)
		});

		return this;
	}

	/**
	 * Show the spinner
	 */
	public showIcon(): void {
		this.statusBarItem.text = `$(sync~spin)  ${this.statusStr}`
		this.statusBarItem.show()
	}

	/**
	 * Hides the spinner
	 */
	public hideIcon(): void {
		this.statusBarItem.hide()
	}

	/**
	 * Sets the workspace path to the currently open window.
	 */
	private setWorkspace(): void {
		const workspaceFolders = vscode.workspace.workspaceFolders;
		this.currentWorkspace = typeof workspaceFolders !== 'undefined' ? workspaceFolders[0].uri.fsPath : ''
	}

	/**
	 * Sets the executable path
	 */
	private setExecutable(): void {
		this.exec = vscode.workspace.getConfiguration('dockr').get('dockrPath')
	}
}