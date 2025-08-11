import React from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import ChatPanel from './components/ChatPanel';
import WritingCanvas from './components/WritingCanvas';
import './App.css';

const App: React.FC = () => {
  return (
    <PanelGroup direction="horizontal" className="app">
      <Panel defaultSize={30}>
        <ChatPanel />
      </Panel>
      <PanelResizeHandle className="resize-handle" />
      <Panel>
        <WritingCanvas />
      </Panel>
    </PanelGroup>
  );
};

export default App;
