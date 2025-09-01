import { Router } from 'express';

const router = Router();

const tools = [
  { id: 'dataTool', name: 'Data Tool', description: 'A tool for data processing.' },
  { id: 'chartTool', name: 'Chart Tool', description: 'A tool for generating charts.' },
  { id: 'webSearchTool', name: 'Web Search Tool', description: 'A tool for searching the web.' },
  { id: 'fileTool', name: 'File Tool', description: 'A tool for file management.' },
];

router.get('/', (_req, res) => {
  res.json(tools);
});

export default router;
