// nodes/inputNode.js
import { BaseNode } from '../components/BaseNode';
import { NODE_CONFIGS } from './nodeConfigs';

export const InputNode = (props) => <BaseNode {...props} config={NODE_CONFIGS.customInput} />;
