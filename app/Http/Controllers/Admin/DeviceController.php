<?php

namespace App\Http\Controllers\Admin;

use App\Enums\DeviceStatus;
use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreDeviceRequest;
use App\Http\Requests\Admin\UpdateDeviceRequest;
use App\Models\Device;
use App\Models\Project;
use App\Models\User;
use App\Services\DeviceEventService;
use App\Support\DeviceCode;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DeviceController extends Controller
{
    use AuthorizesRequests;

    /**
     * Device list with monitoring aggregates and download shells.
     */
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Device::class);

        $devices = Device::query()
            ->with('project:id,name')
            ->when(
                $request->user()->role !== UserRole::SUPER_ADMIN,
                fn ($query) => $query->where('user_id', $request->user()->id),
            )
            ->latest('created_at')
            ->get();

        return Inertia::render('Admin/Devices/Index', [
            'devices' => $devices->map->toAdminArray()->values(),
            'projects' => $this->assignableProjects($request->user()),
            'downloads' => config('photobooth.releases'),
        ]);
    }

    /**
     * Register a new device and surface its pairing code.
     */
    public function store(StoreDeviceRequest $request): RedirectResponse
    {
        $this->authorize('create', Device::class);

        $device = $request->user()->devices()->create([
            'name' => $request->input('name'),
            'device_code' => DeviceCode::generateUnique(Device::pluck('device_code')),
            'platform' => $request->input('platform'),
            'project_id' => $request->input('project_id'),
            'status' => DeviceStatus::OFFLINE->value,
        ]);

        DeviceEventService::created($device);

        if ($device->project_id) {
            DeviceEventService::projectChanged($device, $device->project_id, $device->project?->name);
        }

        session()->flash('toast', [
            'tone' => 'success',
            'title' => 'Perangkat ditambahkan',
            'message' => 'Perangkat berhasil didaftarkan. Gunakan kode pairing di aplikasi booth.',
        ]);

        return redirect()->route('admin.devices.show', $device);
    }

    /**
     * Device detail with its event history.
     */
    public function show(Request $request, Device $device): Response
    {
        $this->authorize('view', $device);

        $device->load(['project:id,name', 'user:id,name,email']);

        $events = $device->events()
            ->limit(100)
            ->get()
            ->map(fn ($event) => [
                'id' => $event->id,
                'event' => $event->event->value,
                'metadata' => $event->metadata,
                'created_at' => $event->created_at->toIso8601String(),
            ])
            ->values();

        return Inertia::render('Admin/Devices/Show', [
            'device' => $device->toAdminArray(),
            'events' => $events,
            'projects' => $this->assignableProjects($request->user()),
            'can' => [
                'update' => $request->user()->can('update', $device),
                'revoke' => $request->user()->can('revoke', $device),
            ],
        ]);
    }

    /**
     * Update device identity or its assigned project.
     */
    public function update(UpdateDeviceRequest $request, Device $device): RedirectResponse
    {
        $previousProjectId = $device->project_id;

        $device->update([
            'name' => $request->input('name'),
            'platform' => $request->input('platform'),
            'project_id' => $request->input('project_id'),
        ]);

        if ($previousProjectId !== $request->input('project_id')) {
            $project = $request->input('project_id') ? Project::find($request->input('project_id')) : null;

            DeviceEventService::projectChanged(
                $device,
                $request->input('project_id'),
                $project?->name,
            );
        }

        session()->flash('toast', [
            'tone' => 'success',
            'title' => 'Perangkat diperbarui',
            'message' => 'Informasi perangkat berhasil disimpan.',
        ]);

        return redirect()->route('admin.devices.show', $device);
    }

    /**
     * Revoke the device: mark it, delete every device token, record event.
     */
    public function revoke(Request $request, Device $device): RedirectResponse
    {
        $this->authorize('revoke', $device);

        $device->update([
            'revoked_at' => now(),
            'status' => DeviceStatus::OFFLINE->value,
        ]);

        $device->tokens()->delete();

        DeviceEventService::revoked($device);

        session()->flash('toast', [
            'tone' => 'success',
            'title' => 'Perangkat diputuskan',
            'message' => 'Perangkat tidak dapat terhubung lagi. Pendaftaran baru dapat dibuat kapan saja.',
        ]);

        return redirect()->route('admin.devices.show', $device);
    }

    /**
     * Projects the current user may assign to a device.
     *
     * @return array<int, array<string, mixed>>
     */
    private function assignableProjects(User $user): array
    {
        return Project::query()
            ->select('id', 'name')
            ->when(
                $user->role !== UserRole::SUPER_ADMIN,
                fn ($query) => $query->where('user_id', $user->id),
            )
            ->orderBy('name')
            ->get()
            ->map(fn ($project) => ['id' => $project->id, 'name' => $project->name])
            ->values()
            ->all();
    }
}