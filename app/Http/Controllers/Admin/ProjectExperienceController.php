<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateProjectExperienceRequest;
use App\Models\Project;
use App\Models\ProjectExperienceSetting;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProjectExperienceController extends Controller
{
    use AuthorizesRequests;

    /**
     * Show the project's experience configuration editor.
     */
    public function show(Request $request, Project $project): Response
    {
        $this->authorize('view', $project);

        return $this->renderEditor($project, $request->user()->can('update', $project));
    }

    /**
     * Update the project's experience settings.
     */
    public function update(UpdateProjectExperienceRequest $request, Project $project): RedirectResponse
    {
        $settings = $project->experienceSetting()->firstOrCreate([], ProjectExperienceSetting::defaults());
        $settings->update($request->validated());

        session()->flash('toast', [
            'tone' => 'success',
            'title' => 'Konfigurasi disimpan',
            'message' => 'Konfigurasi photobooth berhasil disimpan.',
        ]);

        return redirect(route('admin.projects.experience', $project));
    }

    private function renderEditor(Project $project, bool $canUpdate): Response
    {
        $settings = $project->experienceSetting()->firstOrCreate([], ProjectExperienceSetting::defaults());

        return Inertia::render('Admin/Projects/Show', [
            'project' => $project->load('user:id,name,email'),
            'experience' => $settings,
            'can' => [
                'update' => $canUpdate,
            ],
        ]);
    }
}