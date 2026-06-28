// nodes/outputNode.js
import { BaseNode } from '../components/BaseNode';
import { NODE_CONFIGS } from './nodeConfigs';

export const OutputNode = (props) => <BaseNode {...props} config={NODE_CONFIGS.customOutput} />;
