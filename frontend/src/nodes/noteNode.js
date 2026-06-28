// nodes/noteNode.js
import { BaseNode } from '../components/BaseNode';
import { NODE_CONFIGS } from './nodeConfigs';

export const NoteNode = (props) => <BaseNode {...props} config={NODE_CONFIGS.note} />;
