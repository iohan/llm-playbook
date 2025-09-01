import { ChevronRight, PanelRight } from 'lucide-react';
import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import useSettings from '../../stores/useSettings';

interface Breadcrumb {
  name: string;
  url?: string;
}

const ContentHeader = ({
  breadcrumbs,
  actions,
}: {
  breadcrumbs: Breadcrumb[];
  actions?: ReactNode;
}) => {
  const toggleSidebar = useSettings((s) => s.toggleSidebar);
  return (
    <div className="flex pb-4 items-center gap-3 mb-10 border-b border-gray-200 h-14">
      <PanelRight
        onClick={() => toggleSidebar()}
        className="w-5 h-5 rotate-180 text-gray-500 cursor-pointer hover:text-gray-600"
      />
      <div className="border-l border-gray-300 w-1 h-4"></div>
      <div className="flex flex-row items-center gap-2">
        {breadcrumbs.map((breadcrumb, index) => (
          <span key={index} className="flex flex-row items-center gap-2">
            {breadcrumb.url ? (
              <Link
                to={breadcrumb.url}
                className="text-gray-400 hover:underline hover:text-gray-800"
              >
                {breadcrumb.name}
              </Link>
            ) : (
              <div>{breadcrumb.name}</div>
            )}
            {index < breadcrumbs.length - 1 && <ChevronRight className="w-4 h-4" />}
          </span>
        ))}
      </div>
      <div className="ml-auto flex flex-row gap-2">{actions}</div>
    </div>
  );
};
export default ContentHeader;
