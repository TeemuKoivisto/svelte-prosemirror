import randomColor from 'randomcolor';
import { names, uniqueNamesGenerator } from 'unique-names-generator';
import { v4 as uuidv4 } from 'uuid';
import type { YjsUser } from './types';

export const generateColor = () =>
	randomColor({
		luminosity: 'dark',
	});

export function generateUser(old: Partial<YjsUser> = {}): YjsUser {
	return {
		id: old.id || uuidv4(),
		clientID: old.clientID || Math.floor(Math.random() * 1000000),
		name:
			old.name ||
			uniqueNamesGenerator({
				dictionaries: [names],
			}),
		color:
			old.color ||
			randomColor({
				luminosity: 'dark',
			}),
	};
}
