import React from 'react';
import { Camera } from 'lucide-react';
import { layoutCells, previewFilter, brightnessLabel, findOption, LAYOUT_OPTIONS, FRAME_OPTIONS } from './experienceMeta';
import { projectOrientationLabel } from '@/Components/Projects/projectMeta';

// ── Frame overlay ───────────────────────────────────────────────────────────

function SprocketStrip({ side }) {
    return (
        <div
            className={`pointer-events-none absolute inset-y-0 flex w-[7%] flex-col items-center justify-around ${side === 'left' ? 'left-0' : 'right-0'} bg-ink/90`}
        >
            {Array.from({ length: 6 }).map((_, i) => (
                <span key={i} className="h-[8%] w-[55%] rounded-[2px] bg-white/70" />
            ))}
        </div>
    );
}

function FrameOverlay({ frame }) {
    if (frame === 'none') return null;

    if (frame === 'film_strip') {
        return (
            <>
                <SprocketStrip side="left" />
                <SprocketStrip side="right" />
            </>
        );
    }

    if (frame === 'polaroid') {
        return (
            <>
                <div className="pointer-events-none absolute inset-0 rounded-[3px] border-[6px] border-white" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[13%] bg-white" />
            </>
        );
    }

    if (frame === 'classic') {
        return <div className="pointer-events-none absolute inset-[7px] rounded-[3px] border border-white/70" />;
    }

    if (frame === 'wedding') {
        return (
            <div className="pointer-events-none absolute inset-[6px] rounded-[3px] border-4 border-[#f4e7cf] shadow-[0_0_0_1px_rgba(217,155,62,0.25)_inset]" />
        );
    }

    // birthday
    return <div className="pointer-events-none absolute inset-[6px] rounded-[6px] border-4 border-dashed border-pink-400/80" />;
}

// ── Device preview ──────────────────────────────────────────────────────────

export default function ExperiencePreview({ project, values }) {
    const isPortrait = project.orientation !== 'landscape';
    const cells = layoutCells(values.layout);
    const cssFilter = previewFilter(values);
    const layoutLabel = findOption(LAYOUT_OPTIONS, values.layout)?.label ?? values.layout;
    const frameLabel = findOption(FRAME_OPTIONS, values.frame)?.label ?? values.frame;

    return (
        <div className="flex flex-col items-center gap-4">
            {/* Device */}
            <div
                id="experience-preview"
                className={`relative mx-auto w-full max-w-[260px] overflow-hidden rounded-modal bg-ink shadow-pop ring-1 ring-ink/10 ${
                    isPortrait ? 'aspect-[3/4]' : 'aspect-[4/3]'
                }`}
            >
                {/* Screen content (image + filters) */}
                <div className="absolute inset-0" style={{ filter: cssFilter, background: '#0b1220' }}>
                    {project.welcome_image_url ? (
                        <img
                            src={project.welcome_image_url}
                            alt=""
                            aria-hidden
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="flex h-full w-full flex-col items-center justify-center text-white/20">
                            <Camera className="h-10 w-10" strokeWidth={1.2} />
                            <span className="mt-2 text-[10px] font-semibold tracking-widest uppercase">Live preview</span>
                        </div>
                    )}
                </div>

                {/* Layout cell overlay */}
                <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
                    {cells.map((c, i) => (
                        <rect
                            key={i}
                            x={c.x}
                            y={c.y}
                            width={c.w}
                            height={c.h}
                            rx="1.5"
                            fill="rgba(255,255,255,0.06)"
                            stroke="rgba(255,255,255,0.5)"
                            strokeWidth="0.6"
                        />
                    ))}
                </svg>

                {/* Frame overlay */}
                <FrameOverlay frame={values.frame} />

                {/* Top status pills */}
                <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-2.5">
                    <span className="inline-flex items-center gap-1 rounded-full bg-ink/70 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
                        <span className="h-1.5 w-1.5 rounded-full bg-brand-light animate-pulse" />
                        {values.timer_seconds}s
                    </span>
                    <span className="rounded-full bg-ink/70 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
                        {layoutLabel}
                    </span>
                </div>

                {/* Bottom project name */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent px-3 pt-6 pb-2.5">
                    <p className="truncate text-[11px] font-bold text-white drop-shadow">{project.name}</p>
                    <p className="text-[9px] text-white/60">
                        {frameLabel} · {brightnessLabel(values.brightness)}
                    </p>
                </div>
            </div>

            {/* Meta info */}
            <p className="text-center text-[11px] text-ink-muted">
                Orientasi {projectOrientationLabel(project.orientation)}
            </p>
        </div>
    );
}
