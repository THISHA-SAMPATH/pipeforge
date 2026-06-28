// nodes/conditionNode.js
import { BaseNode } from '../components/BaseNode';
import { NODE_CONFIGS } from './nodeConfigs';

export const ConditionNode = (props) => <BaseNode {...props} config={NODE_CONFIGS.condition} />;
