import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AgentsRouter from './pages/agents/AgentsRouter';
import Dashboard from './pages/dashboard/Dashboard';
import BaseLayout from './components/layout/BaseLayout';
import ChatRouter from './pages/chat/ChatRouter';

const RootRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route element={<BaseLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="/chat" element={<ChatRouter />} />
        <Route path="/agents/*" element={<AgentsRouter />} />
        <Route path="*" element={<>Not found</>} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default RootRouter;
