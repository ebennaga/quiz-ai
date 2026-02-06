'use client';

import Link from 'next/link';
import { Home, Calendar, FileText, HelpCircle, User } from 'lucide-react';
import { usePathname } from 'next/navigation';
import LogoutButton from './logout-button';

const menu = [
  { label: 'Homepage', href: '/dashboard', icon: Home },
  { label: 'Calendar', href: '/calendar', icon: Calendar },
  { label: 'Questions', href: '/questions', icon: FileText },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen border-r bg-white flex flex-col px-4 py-6">
      {/* Logo */}
      <div className="text-2xl font-bold mb-6">dende</div>

      {/* Search */}
      <input
        placeholder="learn"
        className="mb-5 px-3 py-2 rounded-lg border focus:outline-none focus:ring"
      />

      {/* Main menu */}
      <nav className="space-y-1">
        {menu.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition
                ${
                  active
                    ? 'bg-indigo-500 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }
              `}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <hr className="my-4" />

      <nav className="space-y-1">
        <SidebarItem label="Reread" />
        <SidebarItem label="Flashcards" />
        <SidebarItem label="Documents" />
      </nav>

      <div className="mt-auto space-y-1">
        <SidebarItem icon={<HelpCircle size={18} />} label="Help" />
        <SidebarItem icon={<User size={18} />} label="Account" />
      </div>
      <div className="mt-auto">
        <LogoutButton />
      </div>
    </aside>
  );
}

function SidebarItem({
  label,
  icon,
}: {
  label: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 cursor-pointer">
      {icon}
      {label}
    </div>
  );
}
