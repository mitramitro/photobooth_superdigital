<?php

namespace App\Http\Requests\Admin;

use App\Enums\ProjectFilter;
use App\Enums\ProjectFrame;
use App\Enums\ProjectLayout;
use App\Enums\ProjectTimer;
use App\Models\Project;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProjectExperienceRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('project'));
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'timer_seconds' => ['required', 'integer', Rule::in(ProjectTimer::values())],
            'layout' => ['required', 'string', Rule::in(ProjectLayout::values())],
            'frame' => ['required', 'string', Rule::in(ProjectFrame::values())],
            'filter' => ['required', 'string', Rule::in(ProjectFilter::values())],
            'brightness' => ['required', 'integer', 'between:-100,100'],
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'timer_seconds.required' => 'Pilih durasi timer.',
            'timer_seconds.integer' => 'Durasi timer tidak valid.',
            'timer_seconds.in' => 'Durasi timer harus 3, 5, atau 10 detik.',
            'layout.required' => 'Pilih kisi/layout foto.',
            'layout.in' => 'Kisi/layout yang dipilih tidak valid.',
            'frame.required' => 'Pilih frame.',
            'frame.in' => 'Frame yang dipilih tidak valid.',
            'filter.required' => 'Pilih filter.',
            'filter.in' => 'Filter yang dipilih tidak valid.',
            'brightness.required' => 'Atur tingkat pencahayaan.',
            'brightness.integer' => 'Pencahayaan harus berupa angka.',
            'brightness.between' => 'Pencahayaan harus antara -100 dan +100.',
        ];
    }
}