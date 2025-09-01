import { Route, Routes } from 'react-router-dom';
import Chat from './Chat';

const AgentsRouter = () => (
  <Routes>
    <Route path="*" element={<Chat />} />
  </Routes>
);

export default AgentsRouter;
