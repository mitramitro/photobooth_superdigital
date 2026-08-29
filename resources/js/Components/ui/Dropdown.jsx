import { Fragment } from 'react';
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import { MoreHorizontal } from 'lucide-react';

function DropdownItem({ item, onClick }) {
    const Icon = item.icon;
    const danger = item.danger;
    return (
        <MenuItem>
            <button
                onClick={onClick}
                className={`group flex w-full items-center gap-2.5 rounded-input px-3 py-2 text-sm cursor-pointer ${
                    danger ? 'text-danger hover:bg-danger-subtle' : 'text-ink hover:bg-slate-100'
                }`}
            >
                {Icon && <Icon className="h-4 w-4 shrink-0" />}
                {item.label}
            </button>
        </MenuItem>
    );
}

export default function Dropdown({
    items = [],
    trigger,
    align = 'right',
    label,
}) {
    return (
        <Menu as="div" className="relative inline-block text-left">
            {trigger ? (
                <MenuButton className="inline-flex cursor-pointer">{trigger}</MenuButton>
            ) : (
                <MenuButton
                    aria-label={label || 'Aksi'}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-input border border-edge bg-white text-ink-muted hover:bg-slate-50 hover:text-ink cursor-pointer"
                >
                    <MoreHorizontal className="h-4 w-4" />
                </MenuButton>
            )}

            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
            >
                <MenuItems
                    className={`absolute z-50 mt-1 w-48 origin-top-${align} rounded-card border border-edge bg-white p-1 shadow-pop focus:outline-none ${align === 'right' ? 'right-0' : 'left-0'}`}
                >
                    {items.map((item, i) =>
                        item.divider ? (
                            <div key={`d${i}`} className="my-1 border-t border-edge" />
                        ) : (
                            <DropdownItem key={i} item={item} onClick={item.onClick} />
                        ),
                    )}
                </MenuItems>
            </Transition>
        </Menu>
    );
}
