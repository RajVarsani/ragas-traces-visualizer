import { TraceDetails } from "@/types"

export type State = {
    activeTrace: TraceDetails | null,
    isOpen: boolean,
}

export type Actions = {
    openTrace: (trace: TraceDetails) => void,
    closeTrace: () => void,
}

export type Store = State & Actions