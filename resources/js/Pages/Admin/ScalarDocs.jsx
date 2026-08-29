import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { BookOpen, Code2, Copy, Check, ExternalLink, Compass } from 'lucide-react';
import { PageHeader, Button, Card, CardBody, StatusBadge, useToast } from '@/Components/ui';

const endpoints = [
    { id: 'login', method: 'POST', path: '/api/v1/auth/login', title: 'Mobile Login & Bearer Token', desc: 'Autentikasi akun pengguna dari aplikasi mobile (Flutter/iOS/Android) untuk mendapatkan Sanctum Bearer Token.' },
    { id: 'user', method: 'GET', path: '/api/v1/user', title: 'User Profile Info', desc: 'Mengambil profil pengguna yang sedang login berdasarkan token Sanctum.' },
    { id: 'booths', method: 'GET', path: '/api/v1/booths', title: 'Active Booths List', desc: 'Daftar perangkat photobooth aktif dan status ketersediaan di lokasi event.' },
    { id: 'sessions', method: 'POST', path: '/api/v1/sessions/create', title: 'Trigger Mobile Session', desc: 'Memulai sesi foto photobooth langsung dari QR code aplikasi mobile.' },
];

const snippets = {
    login: `// Flutter / Dart HTTP Example (Sanctum Login)
final response = await http.post(
  Uri.parse('http://localhost:8000/api/v1/auth/login'),
  headers: {'Content-Type': 'application/json'},
  body: jsonEncode({
    'email': 'mobile.dev@photobooth.com',
    'password': 'password',
    'device_name': 'iPhone 15 Pro'
  }),
);
final token = jsonDecode(response.body)['token'];`,
    user: `// Fetch User Profile with Bearer Token
final response = await http.get(
  Uri.parse('http://localhost:8000/api/v1/user'),
  headers: {
    'Authorization': 'Bearer \$token',
    'Accept': 'application/json',
  },
);`,
    booths: `// Fetch Active Photobooths
final response = await http.get(
  Uri.parse('http://localhost:8000/api/v1/booths'),
  headers: {'Authorization': 'Bearer \$token'},
);`,
    sessions: `// Trigger Sesi Photobooth via Mobile QR
final response = await http.post(
  Uri.parse('http://localhost:8000/api/v1/sessions/create'),
  headers: {
    'Authorization': 'Bearer \$token',
    'Content-Type': 'application/json',
  },
  body: jsonEncode({
    'booth_id': 'BOOTH-01',
    'frame_id': 'classic-4strip',
  }),
);`,
};

const methodTone = { POST: 'info', GET: 'success' };
const methodBg = { POST: 'bg-brand-subtle text-brand-dark', GET: 'bg-success-subtle text-success' };

export default function ScalarDocs() {
    const { toast } = useToast();
    const [selected, setSelected] = useState('login');
    const [copied, setCopied] = useState(false);
    const ep = endpoints.find((e) => e.id === selected);

    const copy = () => {
        navigator.clipboard?.writeText(snippets[selected]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast({ tone: 'success', title: 'Kode disalin' });
    };

    return (
        <AdminLayout title="API Documentation">
            <Head title="API Docs - Photobooth Sanctum API" />

            <PageHeader
                title="API Documentation"
                description="Panduan integrasi Sanctum API untuk aplikasi mobile dan kiosk."
                icon={BookOpen}
                actions={
                    <a href="/scalar" target="_blank" rel="noreferrer">
                        <Button icon={ExternalLink}>Buka Scalar Native</Button>
                    </a>
                }
            />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                {/* Endpoint list */}
                <div className="lg:col-span-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">
                        Sanctum Mobile Endpoints
                    </p>
                    <div className="space-y-2">
                        {endpoints.map((e) => (
                            <button
                                key={e.id}
                                onClick={() => setSelected(e.id)}
                                className={`flex w-full flex-col gap-1.5 rounded-card border p-3.5 text-left transition-colors cursor-pointer ${
                                    selected === e.id ? 'border-brand bg-brand-subtle/60' : 'border-edge bg-white hover:border-slate-300'
                                }`}
                            >
                                <div className="flex items-center gap-2">
                                    <StatusBadge tone={methodTone[e.method]}>{e.method}</StatusBadge>
                                    <code className="truncate font-mono text-xs font-semibold text-ink">{e.path}</code>
                                </div>
                                <p className="text-sm font-medium text-ink">{e.title}</p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Spec viewer */}
                <div className="lg:col-span-8">
                    <Card>
                        <CardBody className="space-y-6">
                            <div className="flex items-start gap-3">
                                <span className={`mt-0.5 rounded-input px-2.5 py-1 font-mono text-xs font-bold ${methodBg[ep.method]}`}>
                                    {ep.method}
                                </span>
                                <div>
                                    <p className="font-mono text-base font-semibold text-ink">{ep.path}</p>
                                    <p className="mt-1 text-sm text-ink-muted">{ep.desc}</p>
                                </div>
                            </div>

                            {/* Code block */}
                            <div className="overflow-hidden rounded-card border border-edge">
                                <div className="flex items-center justify-between border-b border-edge bg-slate-50 px-4 py-2.5">
                                    <div className="flex items-center gap-2 text-xs font-medium text-ink-muted">
                                        <Code2 className="h-4 w-4 text-brand" />
                                        Dart / Flutter Request
                                    </div>
                                    <button
                                        onClick={copy}
                                        className="flex items-center gap-1.5 rounded-input border border-edge bg-white px-2.5 py-1 text-xs font-medium text-ink-muted transition-colors hover:text-ink cursor-pointer"
                                    >
                                        {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
                                        {copied ? 'Tersalin' : 'Salin'}
                                    </button>
                                </div>
                                <pre className="overflow-x-auto bg-slate-900 p-4 font-mono text-xs leading-relaxed text-green-300">
                                    <code>{snippets[selected]}</code>
                                </pre>
                            </div>

                            {/* Response preview */}
                            <div className="overflow-hidden rounded-card border border-edge">
                                <div className="flex items-center justify-between border-b border-edge bg-slate-50 px-4 py-2.5 text-xs font-medium">
                                    <span className="text-ink">200 OK Response</span>
                                    <span className="text-ink-muted">application/json</span>
                                </div>
                                <pre className="overflow-x-auto bg-white p-4 font-mono text-xs leading-relaxed text-ink-muted">
{`{
  "status": "success",
  "message": "${ep.title} successfully retrieved",
  "data": {
    "token": "1|sanctum_token_sample",
    "timestamp": "${new Date().toISOString()}"
  }
}`}
                                </pre>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
