import { useRef, useState } from 'react';
import ContentHeader from '../../components/reusables/ContentHeader';
import { Message } from '@pkg/types';
import Button from '../../components/reusables/Button';
import { LoaderCircle } from 'lucide-react';

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [pending, setPending] = useState(false);

  const inputRef = useRef<HTMLTextAreaElement>(null);

  const AgentText = ({ text }: { text: string }) => (
    <div className="max-w-5/6 whitespace-pre-wrap">{text}</div>
  );
  const UserText = ({ text }: { text: string }) => (
    <div className="ml-auto max-w-5/6 bg-gray-200 border border-gray-300 py-2 px-3 rounded-2xl whitespace-pre-wrap">
      {text}
    </div>
  );

  const addUserMessage = async (text: string) => {
    if (!text.trim()) return;
    setPending(true);
    setMessages((prev) => [...prev, { role: 'user', content: text }]);

    await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        history: [...messages, { role: 'user', content: text }],
        agentId: 1,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
      })
      .catch(() => {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: 'Error: Unable to get response from the server.' },
        ]);
      })
      .finally(() => setPending(false));

    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <>
      <ContentHeader breadcrumbs={[{ name: 'Dashboard', url: '/' }, { name: 'Chat' }]} />
      <div className="flex">
        <div className="w-2/3 flex flex-col gap-10 pr-5">
          <div className="flex flex-col gap-8 px-5">
            {messages.map((message, index) =>
              message.role === 'user' ? (
                <UserText key={index} text={message.content} />
              ) : (
                <AgentText key={index} text={message.content} />
              ),
            )}
            {pending && <LoaderCircle className="text-gray-400 animate-spin" />}
          </div>
          <div className="flex gap-3 items-start">
            <textarea
              ref={inputRef}
              className="min-h-[100px] w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
            />
            <div>
              <Button onClick={() => addUserMessage(inputRef.current?.value ?? '')}>Send</Button>
            </div>
          </div>
        </div>
        <div className="w-1/3 border-l border-gray-200 pl-5">
          <select className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400">
            <option value="" disabled>
              Select agent
            </option>
          </select>
        </div>
      </div>
    </>
  );
};

export default Chat;
