import type { Extension } from './extension.js';
import type { PMDoc } from './pm.js';

export type { Editor } from '../Editor.js';

export interface EditorProps {
	extensions?: Extension[];
	doc?: PMDoc;
	/**
	 * The name of the default top-level node for the schema. Defaults to `"doc"`.
	 */
	topNode?: string;
}
