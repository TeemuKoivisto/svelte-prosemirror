import type { Extension } from './extension';
import type { PMDoc } from './pm';

export type { Editor } from '../Editor';

export interface EditorProps {
	extensions?: Extension[];
	doc?: PMDoc;
	/**
	 * The name of the default top-level node for the schema. Defaults to `"doc"`.
	 */
	topNode?: string;
}
