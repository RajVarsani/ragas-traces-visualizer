export type ChainTraceDTO = {
    parent_run_id: string;
    inputs: {
        question?: string;
        ground_truth?: string;
        answer?: string;
        contexts?: string[];
    };
    self: {
        name: string;
    };
    type: "chain";
    outputs: {
        faithfulness?: number;
        output?: string | number;
    };
};

export type LLMTraceDTO = {
    parent_run_id: string;
    inputs: string;
    self: {
        name: string;
        lc?: number;
        type?: string;
        id?: string[];
        kwargs?: {
            model_name?: string;
            temperature?: number;
            openai_api_key?: {
                lc: number;
                type: string;
                id: string[];
            };
            openai_proxy?: string;
            request_timeout?: number;
            max_retries?: number;
            n?: number;
        };
        graph?: {
            nodes: {
                id: number;
                type: string;
                data?: string;
            }[];
            edges: {
                source: number;
                target: number;
            }[];
        };
    };
    type: "llm";
    outputs: string;
};

export type RunData = {
    [key: string]: {
        parent_run_id: string;
        inputs: {
            question?: string;
            ground_truth?: string;
            answer?: string;
            contexts?: string[];
        };
        self: {
            name: string;
            lc?: number | string;
            type?: string;
            id?: string[];
            kwargs?: {
                model_name?: string;
                temperature?: number;
                openai_api_key?: {
                    lc: number;
                    type: string;
                    id: string[];
                };
                openai_proxy?: string;
                request_timeout?: number;
                max_retries?: number;
                n?: number;
            };
            graph?: {
                nodes: {
                    id: number;
                    type: string;
                    data?: string;
                }[];
                edges: {
                    source: number;
                    target: number;
                }[];
            };
        };
        type: "llm" | "chain";
        outputs: {
            faithfulness?: number;
            output?: string | number;
        };
    };
};

export type TraceDTO = ChainTraceDTO | LLMTraceDTO;

export type TraceMap = Record<string, TraceDTO>;