<?php

namespace App\Http\Controllers\Admin;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreProjectRequest;
use App\Http\Requests\Admin\UpdateProjectRequest;
use App\Models\Project;
use App\Models\ProjectExperienceSetting;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    use AuthorizesRequests;
    /**
     * Display a listing of the projects the user is allowed to see.
     */
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Project::class);

        $projects = Project::query()
            ->with('user:id,name,email')
            ->when(
                $request->user()->role !== UserRole::SUPER_ADMIN,
                fn ($query) => $query->where('user_id', $request->user()->id),
            )
            ->when(
                $request->filled('status') && in_array($request->input('status'), ['draft', 'active', 'inactive'], true),
                fn ($query) => $query->where('status', $request->input('status')),
            )
            ->when(
                $request->filled('search'),
                fn ($query) => $query->where('name', 'like', '%'.$request->input('search').'%'),
            )
            ->latest()
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('Admin/Projects/Index', [
            'projects' => $projects,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    /**
     * Show the form for creating a new project.
     */
    public function create(): Response
    {
        $this->authorize('create', Project::class);

        return Inertia::render('Admin/Projects/Create');
    }

    /**
     * Store a newly created project in storage.
     */
    public function store(StoreProjectRequest $request): RedirectResponse
    {
        $data = $request->validated();

        if ($request->hasFile('welcome_image')) {
            $data['welcome_image'] = $request->file('welcome_image')->store('projects/welcome', 'public');
        }

        $project = $request->user()->projects()->create($data);

        $project->experienceSetting()->create(ProjectExperienceSetting::defaults());

        session()->flash('toast', [
            'tone' => 'success',
            'title' => 'Proyek dibuat',
            'message' => 'Proyek "'.$project->name.'" berhasil dibuat.',
        ]);

        return redirect(route('admin.projects.index'));
    }

    /**
     * Display the project's experience configuration shell.
     */
    public function show(Request $request, Project $project): Response
    {
        $this->authorize('view', $project);

        $settings = $project->experienceSetting()->firstOrCreate([], ProjectExperienceSetting::defaults());

        return Inertia::render('Admin/Projects/Show', [
            'project' => $project->load('user:id,name,email'),
            'experience' => $settings,
            'can' => [
                'update' => $request->user()->can('update', $project),
                'delete' => $request->user()->can('delete', $project),
            ],
        ]);
    }

    /**
     * Show the form for editing the project's information.
     */
    public function edit(Request $request, Project $project): Response
    {
        $this->authorize('update', $project);

        return Inertia::render('Admin/Projects/Edit', [
            'project' => $project,
        ]);
    }

    /**
     * Update the specified project in storage.
     */
    public function update(UpdateProjectRequest $request, Project $project): RedirectResponse
    {
        $data = $request->validated();

        if ($request->hasFile('welcome_image')) {
            $this->deleteWelcomeImage($project);
            $data['welcome_image'] = $request->file('welcome_image')->store('projects/welcome', 'public');
        }

        $project->update($data);

        session()->flash('toast', [
            'tone' => 'success',
            'title' => 'Proyek diperbarui',
            'message' => 'Proyek "'.$project->name.'" berhasil diperbarui.',
        ]);

        return redirect(route('admin.projects.index'));
    }

    /**
     * Remove the specified project from storage.
     */
    public function destroy(Request $request, Project $project): RedirectResponse
    {
        $this->authorize('delete', $project);

        // Booth sessions are history and their foreign key is RESTRICT, so a
        // project with session history cannot be hard deleted. Archive it by
        // setting the status to inactive instead.
        if ($project->boothSessions()->exists()) {
            session()->flash('toast', [
                'tone' => 'warning',
                'title' => 'Proyek tidak dapat dihapus',
                'message' => 'Proyek "'.$project->name.'" memiliki riwayat sesi booth dan tidak dapat dihapus. Nonaktifkan proyek sebagai gantinya.',
            ]);

            return redirect(route('admin.projects.index'));
        }

        $this->deleteWelcomeImage($project);

        $project->delete();

        session()->flash('toast', [
            'tone' => 'warning',
            'title' => 'Proyek dihapus',
            'message' => 'Proyek "'.$project->name.'" telah dihapus.',
        ]);

        return redirect(route('admin.projects.index'));
    }

    private function deleteWelcomeImage(Project $project): void
    {
        if ($project->welcome_image) {
            Storage::disk('public')->delete($project->welcome_image);
        }
    }
}