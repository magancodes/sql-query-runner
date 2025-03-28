import { defineStore } from "pinia"

export const useDataStore = defineStore("data", {
  state: () => ({
    data: [],
    columns: [],
  }),
  actions: {
    setData(data) {
      this.data = data
    },
    setColumns(columns) {
      this.columns = columns
    },
    clearData() {
      this.data = []
      this.columns = []
    },
  },
})

