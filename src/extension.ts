/*---------------------------------------------------------
 * Copyright (C) Dukagjin Surdulli. All rights reserved.
 *--------------------------------------------------------*/

'use strict';

import * as vscode from 'vscode';
import { exec } from 'child_process'

let statusBarItem: vscode.StatusBarItem;

export function activate({ subscriptions }: vscode.ExtensionContext) {
	
	const dockrUp = 'dockr.up'
	const dockrDown = 'dockr.down'

	let upCommand = vscode.commands.registerCommand(dockrUp, () => {
		exec('php C:\\PHP\\dockr.phar up')
		vscode.window.showInformationMessage('Starting up containers in the background...')
	});

	let downCommand = vscode.commands.registerCommand(dockrDown, () => {
		exec('php C:\\PHP\\dockr.phar down', (err, stdout, stderr) => {
			console.log(err, stdout, stderr)
		})

		vscode.window.showInformationMessage('Shutting off and detaching containers...')
	});

	// Register the commands
	subscriptions.push(upCommand)
	subscriptions.push(downCommand)
	
	// Init the status bar
	statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 0)
	statusBarItem.command = dockrUp
	statusBarItem.text = `$(megaphone) Dockr Start`
	statusBarItem.show()
	subscriptions.push(statusBarItem)
}
