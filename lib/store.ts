import { create } from "zustand"
import { persist } from "zustand/middleware"

interface QueryState {
  data: any[]
  columns: string[]
  setData: (data: any[]) => void
  setColumns: (columns: string[]) => void
  clearData: () => void
}

export const useQueryStore = create<QueryState>()(
  persist(
    (set) => ({
      data: [],
      columns: [],
      setData: (data) => set({ data }),
      setColumns: (columns) => set({ columns }),
      clearData: () => set({ data: [], columns: [] }),
    }),
    {
      name: "query-store",
    },
  ),
)

