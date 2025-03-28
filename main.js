import { createApp } from "vue"
import { createRouter, createWebHistory } from "vue-router"
import App from "./app.vue"
import QueryRunnerPage from "./pages/QueryRunnerPage.vue"
import VisualizationPage from "./pages/VisualizationPage.vue"

// Create a shared state for passing data between components
import { createPinia } from "pinia"
const pinia = createPinia()

// Create router
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: QueryRunnerPage },
    { path: "/visualize", component: VisualizationPage },
  ],
})

const app = createApp(App)
app.use(pinia)
app.use(router)
app.mount("#app")

