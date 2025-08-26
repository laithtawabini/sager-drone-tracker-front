interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  selected: boolean;
  onClick: () => void;
}

function SidebarItem({ icon, label, selected, onClick }: SidebarItemProps) {
  return (
    <button
      className={`hover:cursor-pointer flex flex-col items-center p-4 w-full mb-4 group focus:outline-none relative ${selected ? 'bg-[#8888884e]' : ''}`}
      onClick={onClick}
    >
      {selected && (
        <div className="absolute left-0 top-0 h-full w-2 bg-sidebar-accent" />
      )}
      <span className={`mb-2 transition-colors ${selected ? 'text-primary-foreground' : 'text-gray-400 group-hover:text-white'}`}>
        {icon}
      </span>
      <span className={`text-sm font-medium transition-colors ${selected ? 'text-primary-foreground' : 'text-secondary-foreground group-hover:text-white'}`}>
        {label}
      </span>
    </button>
  );
}

export default SidebarItem;