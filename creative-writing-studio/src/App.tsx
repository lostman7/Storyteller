import React from 'react';
import OutlineView from './components/OutlineView';
import EditorView from './components/EditorView';

const App: React.FC = () => {
  return (
    <div className="app">
      <OutlineView />
      <EditorView />
    </div>
  );
};

export default App;
