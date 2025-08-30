import { AnimatePresence, motion } from 'framer-motion';
import { Bot, ChevronRight, ChevronsUpDown, PanelRight, SquareTerminal } from 'lucide-react';
import { ReactNode, useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';

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
  title,
  icon,
  url,
  open,
  items,
}: {
  title: string;
  icon: ReactNode;
  url?: string;
  open?: boolean;
  items: { title: string; url: string }[];
}) => {
  const [isOpen, setIsOpen] = useState(open ?? false);
  const navigate = useNavigate();
  return (
    <ul>
      <li>
        <button
          className="flex items-center gap-2 hover:bg-gray-200 px-2 py-1 rounded w-full cursor-pointer"
          onClick={() => {
            setIsOpen(url ? true : !isOpen);
            url && navigate(url);
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
              setIsOpen(!isOpen);
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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  return (
    <div className="flex h-screen bg-gray-100">
      <motion.div
        animate={{ x: sidebarOpen ? 0 : -250, width: sidebarOpen ? 250 : 0 }}
        transition={{ duration: 0.25 }}
        className="w-3xs pt-5"
      >
        <Sidebar>
          <div className="flex flex-col gap-2">
            <div className="text-xs px-2">Platform</div>
            <Section
              title="Playground"
              icon={<SquareTerminal className="w-5 h-5" />}
              open={true}
              items={[
                { title: 'Chat', url: '/' },
                { title: 'History', url: '/history' },
              ]}
            />
            <Section
              title="Agents"
              url="/agents"
              icon={<Bot className="w-5 h-5" />}
              items={[
                { title: 'Billy bot', url: '/billy' },
                { title: 'Chat bot', url: '/chat' },
              ]}
            />
          </div>
        </Sidebar>
      </motion.div>
      <div className="w-full py-5 px-4">
        <div className="bg-white rounded-2xl">
          <div className="p-5 min-h-[600px]">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BaseLayout;
