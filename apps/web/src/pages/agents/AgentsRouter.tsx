import { Route, Routes } from 'react-router-dom';
import { AgentFormPage, AgentsList } from './Agents';

const AgentsRouter = () => (
  <Routes>
    <Route path="/new" element={<AgentFormPage />} />
    <Route path="/:id" element={<AgentFormPage />} />
    <Route path="*" element={<AgentsList />} />
  </Routes>
);

export default AgentsRouter;
