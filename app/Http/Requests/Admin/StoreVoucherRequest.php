<?php

namespace App\Http\Requests\Admin;

use App\Enums\UserRole;
use App\Models\Project;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreVoucherRequest extends FormRequest
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
            'project_id' => [
                'required',
                'integer',
                Rule::exists('projects', 'id'),
                function ($attribute, $value, $fail) {
                    $project = Project::find($value);

                    if (! $project) {
                        $fail('Proyek tidak ditemukan.');

                        return;
                    }

                    if (
                        $this->user()->role !== UserRole::SUPER_ADMIN
                        && $project->user_id !== $this->user()->id
                    ) {
                        $fail('Anda hanya dapat membuat voucher untuk proyek milik Anda sendiri.');
                    }
                },
            ],
            'max_uses' => ['required', 'integer', 'min:1', 'max:'.config('photobooth.voucher.max_uses_cap', 100)],
            'valid_from' => ['nullable', 'date'],
            'expires_at' => [
                'nullable',
                'date',
                function ($attribute, $value, $fail) {
                    if ($value !== null && $this->input('valid_from') !== null && $value <= $this->input('valid_from')) {
                        $fail('Berlaku sampai harus setelah tanggal mulai berlaku.');
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
            'project_id.required' => 'Pilih proyek untuk voucher.',
            'project_id.exists' => 'Proyek yang dipilih tidak ditemukan.',
            'max_uses.required' => 'Batas penggunaan wajib diisi.',
            'max_uses.min' => 'Batas penggunaan minimal 1.',
            'max_uses.max' => 'Batas penggunaan maksimal '.config('photobooth.voucher.max_uses_cap', 100).'.',
            'valid_from.date' => 'Format tanggal mulai berlaku tidak valid.',
            'expires_at.date' => 'Format tanggal berakhir tidak valid.',
        ];
    }
}