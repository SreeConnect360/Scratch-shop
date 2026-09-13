import { useState } from "react";
import { MessageCircleCode, X } from "lucide-react";
import AssistantWindow from "./AssistantWindow";
import "./assistant.css";

export default function AssistantLauncher() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Perfect Circle Launcher */}
      <div
        className="ai-assistant-launcher"
        onClick={() => setIsOpen(!isOpen)}
        title="Open Styling Concierge"
      >
        <div className="ai-assistant-pulse" />
        
        {isOpen ? (
          <X className="w-6 h-6 text-accent" />
        ) : (
          <MessageCircleCode className="w-6 h-6 text-accent" />
        )}
      </div>

      {/* Floating Chat Assistant Panel */}
      <AssistantWindow isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
