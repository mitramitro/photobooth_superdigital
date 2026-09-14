<?php

namespace App\Http\Requests\Admin;

use App\Enums\DevicePlatform;
use App\Enums\UserRole;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreDeviceRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return in_array($this->user()->role, [UserRole::ADMIN, UserRole::SUPER_ADMIN], true);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'platform' => ['required', Rule::in(DevicePlatform::values())],
            'project_id' => [
                'nullable',
                'integer',
                'exists:projects,id',
                function ($attribute, $value, $fail) {
                    if ($value === null) {
                        return;
                    }

                    $project = \App\Models\Project::find($value);

                    if (! $project) {
                        $fail('Proyek tidak ditemukan.');

                        return;
                    }

                    if (
                        $this->user()->role !== UserRole::SUPER_ADMIN
                        && $project->user_id !== $this->user()->id
                    ) {
                        $fail('Anda hanya dapat menugaskan proyek milik Anda sendiri.');
                    }
                },
            ],
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
            'name.required' => 'Nama perangkat wajib diisi.',
            'name.max' => 'Nama perangkat maksimal 255 karakter.',
            'platform.required' => 'Pilih platform perangkat.',
            'platform.in' => 'Platform perangkat harus Android atau Windows.',
            'project_id.exists' => 'Proyek yang dipilih tidak ditemukan.',
        ];
    }
}