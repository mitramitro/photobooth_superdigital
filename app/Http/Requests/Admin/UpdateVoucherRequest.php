<?php

namespace App\Http\Requests\Admin;

use App\Enums\UserRole;
use App\Models\Project;
use App\Models\Voucher;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class UpdateVoucherRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('voucher'));
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $voucher = $this->route('voucher');

        return [
            'project_id' => [
                'nullable',
                'integer',
                Rule::exists('projects', 'id'),
                function ($attribute, $value, $fail) {
                    if ($value === null) {
                        return;
                    }

                    $project = Project::find($value);

                    if (! $project) {
                        $fail('Proyek tidak ditemukan.');

                        return;
                    }

                    if (
                        $this->user()->role !== UserRole::SUPER_ADMIN
                        && $project->user_id !== $this->user()->id
                    ) {
                        $fail('Anda hanya dapat menggunakan proyek milik Anda sendiri.');
                    }
                },
            ],
            'max_uses' => [
                'required',
                'integer',
                'min:1',
                'max:'.config('photobooth.voucher.max_uses_cap', 100),
                function ($attribute, $value, $fail) use ($voucher) {
                    if ($voucher instanceof Voucher && $value < $voucher->used_count) {
                        $fail("Batas penggunaan tidak boleh kurang dari pemakaian saat ini ({$voucher->used_count}).");
                    }
                },
            ],
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
     * Extra business guardrails that run after the field rules.
     */
    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            $voucher = $this->route('voucher');

            if (! $voucher instanceof Voucher) {
                return;
            }

            if ($voucher->revoked_at !== null) {
                $validator->errors()->add('voucher', 'Voucher yang dicabut tidak dapat diubah.');
            }

            if ($voucher->used_count > 0 && $this->filled('project_id') && (int) $this->input('project_id') !== $voucher->project_id) {
                $validator->errors()->add('project_id', 'Voucher sudah digunakan, proyek tidak dapat diubah.');
            }
        });
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'max_uses.required' => 'Batas penggunaan wajib diisi.',
            'max_uses.min' => 'Batas penggunaan minimal 1.',
            'max_uses.max' => 'Batas penggunaan maksimal '.config('photobooth.voucher.max_uses_cap', 100).'.',
            'valid_from.date' => 'Format tanggal mulai berlaku tidak valid.',
            'expires_at.date' => 'Format tanggal berakhir tidak valid.',
        ];
    }
}