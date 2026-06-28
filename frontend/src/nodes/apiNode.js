// nodes/apiNode.js
import { BaseNode } from '../components/BaseNode';
import { NODE_CONFIGS } from './nodeConfigs';

export const ApiNode = (props) => <BaseNode {...props} config={NODE_CONFIGS.api} />;
