import { useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './profileMenu.css';

const ProfileMenu = () => {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    const name = user?.name || 'User';
    const avatarUrl = user?.profileImageUrl || user?.avatarUrl || user?.photoURL || '';

    const initials = useMemo(() => {
        const parts = name.trim().split(' ').filter(Boolean);
        if (!parts.length) return 'U';
        const first = parts[0]?.[0] || '';
        const last = parts.length > 1 ? parts[parts.length - 1]?.[0] : '';
        return `${first}${last}`.toUpperCase() || 'U';
    }, [name]);

    useEffect(() => {
        if (!isOpen) return undefined;
        const handleClick = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [isOpen]);

    const handleToggle = () => setIsOpen((prev) => !prev);

    return (
        <div className="profile-menu" ref={menuRef}>
            <button
                type="button"
                className={`profile-trigger ${isOpen ? 'open' : ''}`}
                onClick={handleToggle}
                aria-haspopup="dialog"
                aria-expanded={isOpen}
            >
                {avatarUrl ? (
                    <img src={avatarUrl} alt={name} className="profile-avatar-img" />
                ) : (
                    <span className="profile-avatar-initials" aria-hidden="true">{initials}</span>
                )}
                <span className="profile-name">{name}</span>
                <svg className="profile-chevron" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="m6 9 6 6 6-6" />
                </svg>
            </button>
            {isOpen && (
                <div
                    className="profile-popover"
                    role="dialog"
                    aria-label="Profile"
                    onClick={() => setIsOpen(false)}
                >
                    <div className="profile-popover-header">
                        {avatarUrl ? (
                            <img src={avatarUrl} alt={name} className="profile-popover-avatar" />
                        ) : (
                            <span className="profile-popover-avatar profile-avatar-initials" aria-hidden="true">{initials}</span>
                        )}
                        <div>
                            <div className="profile-popover-name">{name}</div>
                            {user?.email && <div className="profile-popover-email">{user.email}</div>}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileMenu;
