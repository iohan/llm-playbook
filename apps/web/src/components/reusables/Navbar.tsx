import { Link } from 'react-router-dom';

const Navbar = () => (
  <header className="border-b bg-white">
    <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
      <Link to="/agents" className="text-xl font-semibold tracking-tight">
        LLM Agent Playbook
      </Link>
      <nav className="text-sm text-slate-600 flex items-center gap-4">
        <Link to="/agents" className="hover:text-slate-900">
          Agents
        </Link>
        <Link to="/chat" className="hover:text-slate-900">
          Chat
        </Link>
      </nav>
    </div>
  </header>
);

export default Navbar;
