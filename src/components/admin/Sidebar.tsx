import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Box, FolderKanban, Users, GraduationCap, LogOut, MessageSquare } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export default function AdminSidebar() {
  const location = useLocation();
  const { logout } = useAuth();

  const links = [
    {
      href: '/admin',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      href: '/admin/services',
      label: 'Services',
      icon: Box,
    },
    {
      href: '/admin/projects',
      label: 'Projects',
      icon: FolderKanban,
    },
    {
      href: '/admin/team',
      label: 'Team',
      icon: Users,
    },
    {
      href: '/admin/internships',
      label: 'Internships',
      icon: GraduationCap,
    },
    {
      href: '/admin/internship-enquiries',
      label: 'Intern Enquiries',
      icon: MessageSquare,
    },
  ];

  return (
    <aside className="flex h-screen w-64 flex-col bg-gray-900 p-4 text-white">
      <div className="mb-8">
        <h1 className="text-xl font-bold">Softspera Admin</h1>
      </div>

      <nav className="flex-1">
        <ul className="space-y-2">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <li key={link.href}>
                <Link
                  to={link.href}
                  className={`flex items-center space-x-3 rounded-lg p-3 transition-colors ${location.pathname === link.href
                    ? 'bg-primary text-white'
                    : 'hover:bg-gray-800'
                    }`}
                >
                  <Icon size={20} />
                  <span>{link.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <button
        onClick={logout}
        className="flex items-center space-x-3 rounded-lg p-3 text-red-400 transition-colors hover:bg-red-500/10"
      >
        <LogOut size={20} />
        <span>Logout</span>
      </button>
    </aside>
  );
}
