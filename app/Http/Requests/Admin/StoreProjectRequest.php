<?php

namespace App\Http\Requests\Admin;

use App\Enums\ProjectOrientation;
use App\Enums\ProjectStatus;
use App\Enums\ProjectType;
use App\Models\Project;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreProjectRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can('create', Project::class);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:150'],
            'type' => ['required', Rule::enum(ProjectType::class)],
            'orientation' => ['required', Rule::enum(ProjectOrientation::class)],
            'status' => ['sometimes', Rule::enum(ProjectStatus::class)],
            'welcome_image' => ['nullable', 'image', 'mimes:jpeg,jpg,png,webp', 'max:5120'],
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
            'name.required' => 'Judul proyek wajib diisi.',
            'name.max' => 'Judul proyek maksimal :max karakter.',
            'type.required' => 'Pilih jenis proyek terlebih dahulu.',
            'type' => 'Jenis proyek yang dipilih tidak valid.',
            'orientation.required' => 'Pilih orientasi proyek.',
            'orientation' => 'Orientasi yang dipilih tidak valid.',
            'status' => 'Status yang dipilih tidak valid.',
            'welcome_image.image' => 'File harus berupa gambar.',
            'welcome_image.mimes' => 'Format gambar harus JPG, PNG, atau WEBP.',
            'welcome_image.max' => 'Ukuran gambar maksimal 5 MB.',
        ];
    }
}