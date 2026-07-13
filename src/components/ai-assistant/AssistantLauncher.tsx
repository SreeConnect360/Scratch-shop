import { useState } from "react";
import { Sparkles, MessageCircleCode } from "lucide-react";
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
          <Sparkles className="w-6 h-6 text-accent animate-spin-slow" />
        ) : (
          <MessageCircleCode className="w-6 h-6 text-accent" />
        )}
      </div>

      {/* Floating Chat Assistant Panel */}
      <AssistantWindow isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
