import { sql } from '../../db';

const toggleTool = async (toolId: number, state: boolean): Promise<void> => {
  await sql('UPDATE tools SET active = :active WHERE id = :toolId;', {
    toolId,
    active: state ? 1 : 0,
  });
};

export default toggleTool;
