import QueryRunner from "@/components/query-runner"
import { ModeToggle } from "@/components/mode-toggle"
import "./page.css"

export default function Home() {
  return (
    <div className="container">
      <div className="header">
        <div>
          <h1>SQL Query Runner</h1>
          <p className="subtitle">Run SQL queries and visualize results instantly</p>
        </div>
        <ModeToggle />
      </div>
      <QueryRunner />
    </div>
  )
}

