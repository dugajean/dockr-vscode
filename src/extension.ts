/*---------------------------------------------------------
 * Copyright (C) Dukagjin Surdulli. All rights reserved.
 *--------------------------------------------------------*/

'use strict';

import * as vscode from 'vscode';
import { DockrCli } from './dockrcli'

export function activate({ subscriptions }: vscode.ExtensionContext) {
	
	const dockCli = new DockrCli;

	let upCommand = vscode.commands.registerCommand('dockr.up', () => {
		dockCli.command('up').status('Containers starting up...').execute()
		vscode.window.showInformationMessage('Starting up containers in the background...')
	});

	let downCommand = vscode.commands.registerCommand('dockr.down', async () => {
		vscode.window.showInformationMessage('Shutting off and detaching containers...')
		dockCli.command('down').status('Containers shutting off...').execute()
	});

	// Register the commands
	subscriptions.push(upCommand)
	subscriptions.push(downCommand)
}
