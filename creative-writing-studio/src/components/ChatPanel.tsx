import React from 'react';
import ProjectManager from '../renderer/features/project/ProjectManager';

const ChatPanel: React.FC = () => {
  return (
    <div className="chat-panel">
      <ProjectManager />
      <hr />
      <h2>Chat Panel</h2>
      {/* Placeholder for chat content */}
    </div>
  );
};

export default ChatPanel;
