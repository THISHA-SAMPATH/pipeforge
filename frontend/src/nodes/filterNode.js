// nodes/filterNode.js
import { BaseNode } from '../components/BaseNode';
import { NODE_CONFIGS } from './nodeConfigs';

export const FilterNode = (props) => <BaseNode {...props} config={NODE_CONFIGS.filter} />;
