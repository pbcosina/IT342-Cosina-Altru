import { useCallback, useEffect, useRef, useState } from 'react';
import { notificationsApi } from '../services/apiService';
import './notificationBell.css';

const formatRelativeTime = (value) => {
    if (!value) return 'Just now';
    const created = new Date(value);
    const diffMs = Date.now() - created.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    if (diffMinutes < 60) return `${Math.max(diffMinutes, 1)}m ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
};

const NotificationBell = () => {
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const notificationRef = useRef(null);

    const computeUnreadCount = useCallback((items) => items.filter((note) => note.read === false).length, []);

    const fetchNotifications = useCallback(async () => {
        try {
            setLoading(true);
            const response = await notificationsApi.my();
            const mapped = (response || []).map((note) => ({
                id: note.id,
                title: note.title,
                detail: note.message,
                time: formatRelativeTime(note.createdAt),
                type: note.type,
                read: Boolean(note.read),
            }));
            setNotifications(mapped);
            setUnreadCount(computeUnreadCount(mapped));
        } catch {
            setNotifications([]);
            setUnreadCount(0);
        } finally {
            setLoading(false);
        }
    }, [computeUnreadCount]);

    useEffect(() => {
        fetchNotifications();
        const intervalId = window.setInterval(fetchNotifications, 30000);
        const handleVisibility = () => {
            if (document.visibilityState === 'visible') {
                fetchNotifications();
            }
        };
        document.addEventListener('visibilitychange', handleVisibility);
        return () => {
            window.clearInterval(intervalId);
            document.removeEventListener('visibilitychange', handleVisibility);
        };
    }, [fetchNotifications]);

    useEffect(() => {
        if (!showNotifications) return undefined;
        const handleClick = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [showNotifications]);

    const markAllRead = useCallback(async () => {
        try {
            await notificationsApi.markAllRead();
        } finally {
            setNotifications((prev) => prev.map((note) => ({ ...note, read: true })));
            setUnreadCount(0);
        }
    }, []);

    const handleNotificationsToggle = async () => {
        const nextValue = !showNotifications;
        setShowNotifications(nextValue);
        if (nextValue && unreadCount > 0) {
            await markAllRead();
            await fetchNotifications();
        }
    };

    const handleNotificationClick = async (id) => {
        const current = notifications.find((note) => note.id === id);
        if (!current || current.read) return;
        try {
            await notificationsApi.markRead(id);
        } finally {
            setNotifications((prev) => prev.map((note) => (note.id === id ? { ...note, read: true } : note)));
            setUnreadCount((prev) => Math.max(prev - 1, 0));
        }
    };

    return (
        <div className="notification-wrapper" ref={notificationRef}>
            <button
                className="notification-bell"
                type="button"
                aria-label="View notifications"
                onClick={handleNotificationsToggle}
            >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 22a2.4 2.4 0 0 0 2.4-2.4h-4.8A2.4 2.4 0 0 0 12 22zm7.2-6.4V11a7.2 7.2 0 1 0-14.4 0v4.6l-1.8 1.8v1h18v-1l-1.8-1.8z" />
                </svg>
                {unreadCount > 0 && (
                    <span className="notification-count">{unreadCount}</span>
                )}
            </button>
            {showNotifications && (
                <div className="notification-popover" role="dialog" aria-label="Notifications">
                    <div className="notification-popover-header">Notifications</div>
                    {!loading && unreadCount === 0 && notifications.length > 0 && (
                        <div className="notification-caught-up">You are all caught up</div>
                    )}
                    {loading ? (
                        <div className="notification-loading">
                            <div className="notification-skeleton" />
                            <div className="notification-skeleton" />
                            <div className="notification-skeleton" />
                        </div>
                    ) : notifications.length ? (
                        <div className="notification-list">
                            {notifications.map((note) => (
                                <button
                                    key={note.id}
                                    type="button"
                                    className={`notification-item ${note.read ? 'read' : 'unread'}`}
                                    onClick={() => handleNotificationClick(note.id)}
                                >
                                    <div>
                                        <div className="notification-title">{note.title}</div>
                                        <div className="notification-detail">{note.detail}</div>
                                    </div>
                                    <span className="notification-time">{note.time}</span>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="notification-empty">
                            <div className="notification-empty-icon" aria-hidden="true">🔔</div>
                            <div>
                                <div className="notification-empty-title">No notifications yet</div>
                                <div className="notification-detail">You will see updates here as your campaigns grow.</div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
