import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AgentsRouter from './pages/agents/AgentsRouter';
import Dashboard from './pages/dashboard/Dashboard';
import BaseLayout from './components/layout/BaseLayout';

const RootRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route element={<BaseLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="/agents/*" element={<AgentsRouter />} />
        <Route path="*" element={<>Not found</>} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default RootRouter;
