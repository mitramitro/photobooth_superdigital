import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Camera, Lock, Mail, Shield, UserCheck, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: 'admin@photobooth.com',
        password: 'password',
        remember: false,
        role: 'admin',
    });

    const [activeRole, setActiveRole] = useState('admin');

    const handleRoleSelect = (roleName, roleEmail) => {
        setActiveRole(roleName);
        setData({
            ...data,
            role: roleName,
            email: roleEmail,
        });
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Login - Photobooth Studio Core" />

            <div className="w-full">
                {/* Header Welcome Title */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-surface border border-slate-700/80 mb-4 shadow-inner">
                        <Sparkles className="w-4 h-4 text-brand-blue" />
                        <span className="text-xs font-bold text-gradient-rgb">PHOTOBOOTH STUDIO V1.0</span>
                    </div>
                    <h2 className="text-3xl font-extrabold text-white tracking-tight">
                        Sign In to Control Center
                    </h2>
                    <p className="text-sm text-slate-400 mt-1">
                        Select your operational role & access live kiosk telemetry
                    </p>
                </div>

                {/* Status Alert */}
                {status && (
                    <div className="mb-6 p-4 rounded-xl bg-brand-green/10 border border-brand-green/30 text-brand-green text-sm font-medium flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 shrink-0" />
                        <span>{status}</span>
                    </div>
                )}

                {/* Role Preset Selector */}
                <div className="grid grid-cols-3 gap-2 mb-6">
                    {[
                        { id: 'admin', label: 'Admin', email: 'admin@photobooth.com', accent: 'border-brand-red text-brand-red bg-brand-red/10' },
                        { id: 'operator', label: 'Operator', email: 'operator@photobooth.com', accent: 'border-brand-blue text-brand-blue bg-brand-blue/10' },
                        { id: 'staff', label: 'Staff', email: 'staff@photobooth.com', accent: 'border-brand-green text-brand-green bg-brand-green/10' },
                    ].map((role) => (
                        <button
                            key={role.id}
                            type="button"
                            onClick={() => handleRoleSelect(role.id, role.email)}
                            className={`
                                py-2.5 px-3 rounded-xl border text-xs font-bold transition-all duration-200 flex flex-col items-center gap-1
                                ${activeRole === role.id 
                                    ? role.accent + ' shadow-md scale-[1.02]' 
                                    : 'border-slate-800 text-slate-400 bg-brand-surface/60 hover:bg-slate-800 hover:text-white'}
                            `}
                        >
                            <UserCheck className="w-4 h-4" />
                            <span>{role.label}</span>
                        </button>
                    ))}
                </div>

                {/* Main Login Glass Card */}
                <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-2xl relative">
                    <form onSubmit={submit} className="space-y-5">
                        {/* Email Input */}
                        <div>
                            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                                Account Email
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="w-full pl-11 pr-4 py-3 bg-brand-dark/90 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/30 transition-all"
                                    placeholder="name@photobooth.com"
                                    autoComplete="username"
                                    required
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                            </div>
                            {errors.email && (
                                <p className="mt-2 text-xs text-brand-red font-medium">{errors.email}</p>
                            )}
                        </div>

                        {/* Password Input */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                                    Password
                                </label>
                                {canResetPassword && (
                                    <Link
                                        href={route('password.request')}
                                        className="text-xs text-brand-blue hover:underline font-medium"
                                    >
                                        Forgot?
                                    </Link>
                                )}
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                    <Lock className="w-5 h-5" />
                                </div>
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="w-full pl-11 pr-4 py-3 bg-brand-dark/90 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/30 transition-all"
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    required
                                    onChange={(e) => setData('password', e.target.value)}
                                />
                            </div>
                            {errors.password && (
                                <p className="mt-2 text-xs text-brand-red font-medium">{errors.password}</p>
                            )}
                        </div>

                        {/* Remember Me Checkbox */}
                        <div className="flex items-center justify-between pt-1">
                            <label className="flex items-center gap-2.5 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="w-4 h-4 rounded bg-brand-dark border-slate-700 text-brand-blue focus:ring-brand-blue/40 focus:ring-offset-brand-dark cursor-pointer"
                                />
                                <span className="text-xs font-medium text-slate-400 group-hover:text-slate-200 transition-colors">
                                    Remember this station session
                                </span>
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-brand-red via-brand-blue to-brand-green text-brand-dark font-extrabold text-sm tracking-wide shadow-xl hover:opacity-95 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                        >
                            <span>ENTER CONTROL CENTER</span>
                            <ArrowRight className="w-4 h-4 text-brand-dark group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>

                    {/* Sanctum API Token Quick Note */}
                    <div className="mt-6 pt-5 border-t border-slate-800/80 text-center">
                        <p className="text-xs text-slate-400 flex items-center justify-center gap-2">
                            <Shield className="w-4 h-4 text-brand-green" />
                            <span>Secured with Sanctum Bearer Token Auth</span>
                        </p>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
