import { Wifi, WifiOff, AlertTriangle, Wrench } from 'lucide-react';
import StatusBadge from './StatusBadge';

const statusMap = {
    online: { label: 'Online', tone: 'success', icon: Wifi, pulse: true },
    warning: { label: 'Warning', tone: 'warning', icon: AlertTriangle, pulse: true },
    offline: { label: 'Offline', tone: 'neutral', icon: WifiOff, pulse: false },
    maintenance: { label: 'Maintenance', tone: 'info', icon: Wrench, pulse: false },
};

export default function DeviceHealthIndicator({ status = 'offline', label }) {
    const conf = statusMap[status] || statusMap.offline;
    const Icon = conf.icon;
    return (
        <StatusBadge tone={conf.tone} dot pulse={conf.pulse}>
            {status === 'online' && <Icon className="h-3 w-3" />}
            {label || conf.label}
        </StatusBadge>
    );
}
