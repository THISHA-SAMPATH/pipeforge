// nodes/llmNode.js
import { BaseNode } from '../components/BaseNode';
import { NODE_CONFIGS } from './nodeConfigs';

export const LLMNode = (props) => <BaseNode {...props} config={NODE_CONFIGS.llm} />;
