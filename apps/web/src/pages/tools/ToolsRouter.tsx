import { Route, Routes } from 'react-router-dom';
import ToolsList from './list/ToolsList';

const ToolsRouter = () => (
  <Routes>
    <Route path="*" element={<ToolsList />} />
  </Routes>
);

export default ToolsRouter;
