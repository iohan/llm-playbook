import { AnimatePresence, motion } from 'framer-motion';
import { Bot, ChevronRight, ChevronsUpDown, PanelRight, SquareTerminal } from 'lucide-react';
import { ReactNode, useEffect, useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import useSettings from '../../stores/useSettings';
import { Agent } from '@pkg/types';

const UserProfile = () => {
  return (
    <div className="mt-auto p-2">
      <button className="w-full rounded flex flex-row items-center gap-2 hover:bg-gray-200 px-2 py-1">
        <div className="rounded-md bg-pink-200 w-7 h-7"></div>
        <div className="flex flex-col text-left text-xs flex-1 min-w-0">
          <div className="font-bold truncate">Johan Östling</div>
          <div className="truncate">johan.ostling@playipp.com</div>
        </div>
        <div className="ml-auto flex flex-col items-center">
          <ChevronsUpDown className="w-4 h-4" />
        </div>
      </button>
    </div>
  );
};

const Sidebar = ({ children }: { children: ReactNode }) => {
  const SidebarTitle = ({ title }: { title: string }) => {
    return <div className="text-lg font-medium px-2">{title}</div>;
  };

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex flex-col gap-4 py-5 px-2">
        <SidebarTitle title="LLM PLAYground" />
        <div className="flex flex-col gap-10">{children}</div>
      </div>
      <UserProfile />
    </div>
  );
};

const Section = ({
  id,
  title,
  icon,
  url,
  items,
}: {
  id: string;
  title: string;
  icon: ReactNode;
  url?: string;
  items: { title: string; url: string }[];
}) => {
  const isMenuExpanded = useSettings((s) => s.isMenuExpanded);
  const [isOpen, setIsOpen] = useState(isMenuExpanded(id));
  const toggleMenu = useSettings((s) => s.toggleMenu);
  const goTo = useNavigate();

  const toggle = ({ navigate }: { navigate?: boolean }) => {
    if (!navigate || (navigate && !isOpen)) {
      toggleMenu(id);
      setIsOpen(!isOpen);
    }

    if (url && navigate) {
      goTo(url);
    }
  };

  return (
    <ul>
      <li>
        <button
          className="flex items-center gap-2 hover:bg-gray-200 px-2 py-1 rounded w-full cursor-pointer"
          onClick={() => {
            toggle({ navigate: Boolean(url) });
          }}
        >
          <div className="text-gray-600">{icon}</div>
          <div className="text-gray-600">{title}</div>
          <motion.div
            animate={{ rotate: isOpen ? 90 : 0 }}
            transition={{ duration: 0.2 }}
            className="ml-auto"
            onClick={(e) => {
              e.stopPropagation();
              toggle({ navigate: false });
            }}
          >
            <ChevronRight className="w-4 h-4" />
          </motion.div>
        </button>
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="ml-4 border-l border-gray-300 pl-3 mt-1 text-sm overflow-hidden"
            >
              <ul>
                {items.map((item) => (
                  <motion.li
                    key={item.title}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="hover:bg-gray-200 px-2 py-1 rounded"
                  >
                    <Link to={item.url} className="w-full block hover:text-gray-800">
                      {item.title}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </li>
    </ul>
  );
};

const BaseLayout = () => {
  const sidebarOpen = useSettings((s) => s.sidebarOpen);
  const [agents, setAgents] = useState<Pick<Agent, 'name' | 'id'>[] | null>(null);

  useEffect(() => {
    fetch('/api/agents/name', {
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => setAgents(data));
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <motion.div
        initial={{ x: sidebarOpen ? 0 : -250, width: sidebarOpen ? 250 : 0 }}
        animate={{ x: sidebarOpen ? 0 : -250, width: sidebarOpen ? 250 : 0 }}
        transition={{ duration: 0.25 }}
        className="w-3xs pt-5"
      >
        <Sidebar>
          <div className="flex flex-col gap-2">
            <div className="text-xs px-2">Platform</div>
            <Section
              id="playground"
              title="Playground"
              icon={<SquareTerminal className="w-5 h-5" />}
              items={[
                { title: 'Chat', url: '/' },
                { title: 'History', url: '/history' },
              ]}
            />
            <Section
              id="agents"
              title="Agents"
              url="/agents"
              icon={<Bot className="w-5 h-5" />}
              items={
                agents
                  ? agents.map((agent) => ({ title: agent.name, url: `/agents/${agent.id}` }))
                  : []
              }
            />
          </div>
        </Sidebar>
      </motion.div>
      <div className="w-full h-full py-5 px-4 overflow-auto flex-1 flex-col">
        <div className="bg-white rounded-2xl">
          <div className="p-5">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BaseLayout;
