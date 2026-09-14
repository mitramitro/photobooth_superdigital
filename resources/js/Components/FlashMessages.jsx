import { useEffect, useRef } from 'react';
import { usePage } from '@inertiajs/react';
import { useToast } from '@/Components/ui';

export default function FlashMessages() {
    const { flash } = usePage().props;
    const { toast } = useToast();
    const fired = useRef(null);

    useEffect(() => {
        const data = flash?.toast;
        if (data && fired.current !== JSON.stringify(data)) {
            fired.current = JSON.stringify(data);
            toast({ tone: data.tone, title: data.title, message: data.message });
        }
    }, [flash, toast]);

    return null;
}