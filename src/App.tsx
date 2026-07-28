import { KanbanBoard } from './components/KanbanBoard';
import { NowProvider } from './components/NowProvider';

function App() {
  return (
    <NowProvider>
      <KanbanBoard />
    </NowProvider>
  );
}

export default App;
