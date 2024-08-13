import { TraceDTO } from "./dto";

export type TraceDetails = TraceDTO & {
    id: string;
    children: TraceDetails[];
}