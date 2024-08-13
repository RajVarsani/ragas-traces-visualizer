import { create } from 'zustand';
import { Store, State } from './types';


const defaultState: State = {
    activeTrace: null,
    isOpen: false,
}


const useTraceSheetStore = create<Store>()((set) => ({
    ...defaultState,

    openTrace: (trace) => set((state) => ({
        activeTrace: trace,
        isOpen: true,
    })),
    closeTrace: () => set((state) => ({
        isOpen: false,  
    }))
}))

export default useTraceSheetStore;