import { Plus } from 'lucide-react';
import Modal from '../../../components/reusables/Modal';
import { useState } from 'react';
import Button from '../../../components/reusables/Button';

const AddNewAgent = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)} icon={<Plus />}>
        New Agent
      </Button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <p className="mb-3">
          Detta är en enkel, tillgänglig modal för ditt MVP. Den stängs med ESC eller klick utanför.
        </p>
        <label className="mb-2 block text-sm">Exempel-input</label>
        <input
          type="text"
          className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-black/20 dark:border-neutral-700"
          placeholder="Skriv något..."
        />
      </Modal>
    </>
  );
};

export default AddNewAgent;
