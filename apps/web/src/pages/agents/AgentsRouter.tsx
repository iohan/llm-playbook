import { Route, Routes } from 'react-router-dom';
import { AgentFormPage } from './Agents';
import AgentsList from './list/AgentsList';

const AgentsRouter = () => (
  <Routes>
    <Route path="/new" element={<AgentFormPage />} />
    <Route path="/:id" element={<AgentFormPage />} />
    <Route path="*" element={<AgentsList />} />
  </Routes>
);

export default AgentsRouter;
