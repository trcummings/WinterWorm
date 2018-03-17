// @flow
import type { app as App, ipcMain as IpcMain } from 'electron';

export type Process = App | IpcMain | null;
