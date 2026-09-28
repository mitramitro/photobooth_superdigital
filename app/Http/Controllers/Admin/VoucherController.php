<?php

namespace App\Http\Controllers\Admin;

use App\Enums\UserRole;
use App\Enums\VoucherStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreVoucherRequest;
use App\Http\Requests\Admin\UpdateVoucherRequest;
use App\Models\Project;
use App\Models\User;
use App\Models\Voucher;
use App\Services\VoucherService;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class VoucherController extends Controller
{
    use AuthorizesRequests;

    public function __construct(private readonly VoucherService $voucherService)
    {
    }

    /**
     * Voucher list with server-side search, status filter, project filter and
     * pagination.
     */
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Voucher::class);

        $search = trim((string) $request->input('search', ''));
        $status = (string) $request->input('status', '');
        $projectId = (int) $request->input('project', 0);
        $perPage = (int) $request->input('per_page', 15);

        $query = Voucher::query()
            ->with('project:id,name')
            ->when(
                $request->user()->role !== UserRole::SUPER_ADMIN,
                fn ($q) => $q->where('user_id', $request->user()->id),
            )
            ->when($search !== '', function ($q) use ($search) {
                $q->where(function ($inner) use ($search) {
                    $inner
                        ->where('code', 'like', "%{$search}%")
                        ->orWhereHas('project', fn ($pq) => $pq->where('name', 'like', "%{$search}%"));
                });
            })
            ->when(in_array($status, VoucherStatus::values(), true), fn ($q) => $q->effectiveStatus($status))
            ->when($projectId > 0, fn ($q) => $q->where('project_id', $projectId))
            ->latest('created_at');

        $vouchers = $query->paginate($perPage)->withQueryString();

        return Inertia::render('Admin/Voucher/Index', [
            'vouchers' => [
                'data' => $vouchers->getCollection()->map->toAdminArray()->values(),
                'meta' => [
                    'total' => $vouchers->total(),
                    'per_page' => $vouchers->perPage(),
                    'current_page' => $vouchers->currentPage(),
                    'last_page' => $vouchers->lastPage(),
                ],
            ],
            'filters' => [
                'search' => $search,
                'status' => $status,
                'project' => $projectId > 0 ? (string) $projectId : '',
            ],
            'projects' => $this->assignableProjects($request->user()),
            'created_voucher' => session('created_voucher'),
        ]);
    }

    /**
     * Create a voucher, generate its code server-side and immediately surface
     * the code via a reveal prompt on the index.
     */
    public function store(StoreVoucherRequest $request): RedirectResponse
    {
        $this->authorize('create', Voucher::class);

        $voucher = $request->user()->vouchers()->create([
            'project_id' => $request->integer('project_id'),
            'code' => $this->voucherService->generateUniqueCode(),
            'status' => VoucherStatus::ACTIVE->value,
            'max_uses' => $request->integer('max_uses'),
            'used_count' => 0,
            'valid_from' => $request->filled('valid_from') ? $request->date('valid_from') : null,
            'expires_at' => $request->filled('expires_at') ? $request->date('expires_at') : null,
        ]);

        $voucher->load('project:id,name');

        session()->flash('created_voucher', $voucher->toAdminArray());
        session()->flash('toast', [
            'tone' => 'success',
            'title' => 'Voucher dibuat',
            'message' => 'Kode voucher baru telah dibuat. Simpan kode untuk dibagikan.',
        ]);

        return redirect()->route('admin.vouchers.index');
    }

    /**
     * Voucher detail with every lifecycle field.
     */
    public function show(Request $request, Voucher $voucher): Response
    {
        $this->authorize('view', $voucher);

        $voucher->load(['project:id,name', 'user:id,name,email']);

        return Inertia::render('Admin/Voucher/Show', [
            'voucher' => $voucher->toAdminArray(),
            'projects' => $this->assignableProjects($request->user()),
            'can' => [
                'update' => $request->user()->can('update', $voucher),
                'revoke' => $request->user()->can('revoke', $voucher),
            ],
        ]);
    }

    /**
     * Edit max_uses and validity window. Project is movable while unused.
     */
    public function update(UpdateVoucherRequest $request, Voucher $voucher): RedirectResponse
    {
        $this->authorize('update', $voucher);

        $voucher->update([
            'project_id' => $request->filled('project_id') ? (int) $request->input('project_id') : $voucher->project_id,
            'max_uses' => $request->integer('max_uses'),
            'valid_from' => $request->filled('valid_from') ? $request->date('valid_from') : null,
            'expires_at' => $request->filled('expires_at') ? $request->date('expires_at') : null,
        ]);

        session()->flash('toast', [
            'tone' => 'success',
            'title' => 'Voucher diperbarui',
            'message' => 'Pengaturan voucher berhasil disimpan.',
        ]);

        return redirect()->route('admin.vouchers.show', $voucher);
    }

    /**
     * Revoke a voucher instead of deleting it: soft terminal state.
     */
    public function revoke(Request $request, Voucher $voucher): RedirectResponse
    {
        $this->authorize('revoke', $voucher);

        $voucher->update(['revoked_at' => now()]);

        session()->flash('toast', [
            'tone' => 'success',
            'title' => 'Voucher dicabut',
            'message' => 'Voucher tidak dapat digunakan lagi namun datanya tetap tersimpan.',
        ]);

        return redirect()->route('admin.vouchers.show', $voucher);
    }

    /**
     * Projects the current user may bind a voucher to.
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