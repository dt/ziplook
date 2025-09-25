import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { loader } from "@monaco-editor/react";
import monaco from "./monaco";
import App from "./App.tsx";

// Configure Monaco to use our lean bundled version with suggest controller
loader.config({ monaco });

// Start React app immediately - workers will initialize asynchronously

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
