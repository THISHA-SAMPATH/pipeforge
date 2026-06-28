// nodes/promptNode.js
import { BaseNode } from '../components/BaseNode';
import { NODE_CONFIGS } from './nodeConfigs';

export const PromptNode = (props) => <BaseNode {...props} config={NODE_CONFIGS.prompt} />;
