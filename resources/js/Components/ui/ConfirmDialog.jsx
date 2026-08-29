import Modal from './Modal';
import Button from './Button';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmDialog({
    open = false,
    onClose = () => {},
    onConfirm = () => {},
    title = 'Konfirmasi',
    message,
    confirmLabel = 'Konfirmasi',
    cancelLabel = 'Batal',
    tone = 'danger',
    loading = false,
}) {
    const confirmVariant = tone === 'danger' ? 'destructive' : 'primary';

    return (
        <Modal
            open={open}
            onClose={onClose}
            maxWidth="md"
            title={title}
            icon={tone === 'danger' ? AlertTriangle : undefined}
            footer={
                <>
                    <Button variant="secondary" onClick={onClose}>
                        {cancelLabel}
                    </Button>
                    <Button variant={confirmVariant} onClick={onConfirm} loading={loading}>
                        {confirmLabel}
                    </Button>
                </>
            }
        >
            <p className="text-sm text-ink-muted">{message}</p>
        </Modal>
    );
}
