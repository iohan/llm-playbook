import { Route, Routes } from 'react-router-dom';
import AgentsList from './list/AgentsList';
import EditAgent from './edit/EditAgent';

const AgentsRouter = () => (
  <Routes>
    <Route path="/:id" element={<EditAgent />} />
    <Route path="*" element={<AgentsList />} />
  </Routes>
);

export default AgentsRouter;
