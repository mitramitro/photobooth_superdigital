import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { 
    BookOpen, 
    Smartphone, 
    Code2, 
    KeyRound, 
    Check, 
    Copy, 
    Sparkles, 
    ExternalLink,
    Send,
    Compass,
    Zap
} from 'lucide-react';

export default function ScalarDocs() {
    const [selectedEndpoint, setSelectedEndpoint] = useState('login');
    const [copiedSnippet, setCopiedSnippet] = useState(false);

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
    'frame_id': 'cyberpunk-neon-4strip',
  }),
);`
    };

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        setCopiedSnippet(true);
        setTimeout(() => setCopiedSnippet(false), 2000);
    };

    return (
        <AdminLayout title="Scalar Interactive API Documentation">
            <Head title="Scalar API Docs - Photobooth Sanctum API" />

            {/* Scalar Header Banner */}
            <div className="mb-8 p-6 sm:p-8 rounded-3xl glass-panel border border-brand-green/40 bg-gradient-to-r from-brand-dark via-brand-surface to-brand-green/10 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-green/20 border border-brand-green/40 text-xs font-bold text-brand-green mb-3">
                        <Compass className="w-3.5 h-3.5" />
                        <span>SCALAR GALAXY OPENAPI ENGINE</span>
                    </div>
                    <h2 className="text-2xl font-extrabold text-white">
                        Scalar Galaxy API Reference & Testing Sandbox
                    </h2>
                    <p className="text-slate-300 text-sm mt-1 max-w-xl">
                        Panduan integrasi API Sanctum untuk pengembang aplikasi mobile (Flutter/Android/iOS) berbasis spesifikasi OpenAPI 3.1 & tema Scalar Galaxy.
                    </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                    <a
                        href="/scalar"
                        target="_blank"
                        rel="noreferrer"
                        className="py-3 px-5 rounded-2xl bg-gradient-to-r from-brand-green to-teal-400 text-brand-dark font-extrabold text-xs shadow-xl hover:scale-105 transition-all flex items-center gap-2"
                    >
                        <Zap className="w-4 h-4 fill-brand-dark" />
                        <span>Buka Native Scalar Galaxy (`/scalar`)</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                </div>
            </div>

            {/* Main Scalar Viewer Container */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Endpoints List (4 Cols) */}
                <div className="lg:col-span-4 space-y-3">
                    <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2 px-1">
                        Sanctum Mobile Endpoints
                    </h3>

                    {endpoints.map((ep) => (
                        <button
                            key={ep.id}
                            onClick={() => setSelectedEndpoint(ep.id)}
                            className={`
                                w-full p-4 rounded-2xl border text-left transition-all duration-200 block
                                ${selectedEndpoint === ep.id 
                                    ? 'bg-brand-surface border-brand-green border-2 shadow-xl' 
                                    : 'border-slate-800 bg-brand-dark/50 hover:bg-slate-800/60'}
                            `}
                        >
                            <div className="flex items-center gap-2.5 mb-1.5">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-extrabold ${ep.method === 'POST' ? 'bg-brand-red/20 text-brand-red border border-brand-red/40' : 'bg-brand-blue/20 text-brand-blue border border-brand-blue/40'}`}>
                                    {ep.method}
                                </span>
                                <span className="font-mono text-xs font-bold text-white truncate">{ep.path}</span>
                            </div>
                            <p className="text-xs font-semibold text-slate-300">{ep.title}</p>
                        </button>
                    ))}
                </div>

                {/* Right Endpoint Code & Spec Viewer (8 Cols) */}
                <div className="lg:col-span-8">
                    {endpoints.filter(e => e.id === selectedEndpoint).map((ep) => (
                        <div key={ep.id} className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <span className={`px-3 py-1 rounded-lg text-xs font-mono font-extrabold ${ep.method === 'POST' ? 'bg-brand-red text-white' : 'bg-brand-blue text-brand-dark'}`}>
                                        {ep.method}
                                    </span>
                                    <span className="font-mono text-lg font-bold text-white">{ep.path}</span>
                                </div>
                                <p className="text-sm text-slate-300">{ep.desc}</p>
                            </div>

                            {/* Code Snippet Box */}
                            <div className="rounded-2xl bg-brand-dark border border-slate-800 p-4 space-y-3">
                                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                                        <Code2 className="w-4 h-4 text-brand-green" />
                                        <span>Dart / Flutter Request Example</span>
                                    </div>
                                    <button
                                        onClick={() => handleCopy(snippets[ep.id])}
                                        className="text-xs text-slate-400 hover:text-brand-green flex items-center gap-1.5 bg-brand-surface px-3 py-1.5 rounded-lg border border-slate-700"
                                    >
                                        {copiedSnippet ? <Check className="w-3.5 h-3.5 text-brand-green" /> : <Copy className="w-3.5 h-3.5" />}
                                        <span>{copiedSnippet ? 'Copied!' : 'Copy Code'}</span>
                                    </button>
                                </div>

                                <pre className="font-mono text-xs text-brand-green overflow-x-auto p-2 leading-relaxed">
                                    <code>{snippets[ep.id]}</code>
                                </pre>
                            </div>

                            {/* Response Payload Preview */}
                            <div className="p-4 rounded-2xl bg-brand-surface/60 border border-slate-800 space-y-2">
                                <div className="flex items-center justify-between text-xs font-bold">
                                    <span className="text-slate-300">200 OK Response Payload</span>
                                    <span className="text-brand-green">application/json</span>
                                </div>
                                <pre className="font-mono text-xs text-slate-300 bg-brand-dark p-3 rounded-xl border border-slate-800 overflow-x-auto">
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
                        </div>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
}
