<?php

namespace App\Http\Requests\Api;

use App\Enums\BoothSessionMode;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StartSessionRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * A self-service session is always paid for with a voucher. The requirement
     * is conditional so an explicit `operator` request without a code reaches
     * the business layer and is rejected as `unsupported_mode`, instead of
     * being masked by a 422 about a missing field.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'voucher_code' => [
                Rule::requiredIf(fn (): bool => $this->resolvedMode() === BoothSessionMode::SELF_SERVICE->value),
                'nullable',
                'string',
                'max:255',
            ],
            'mode' => ['nullable', Rule::enum(BoothSessionMode::class)],
        ];
    }

    /**
     * Prepare the data for validation: normalize the voucher code and default
     * the session mode.
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            'voucher_code' => mb_strtoupper(trim((string) $this->input('voucher_code'))),
            'mode' => $this->input('mode') ?? BoothSessionMode::SELF_SERVICE->value,
        ]);
    }

    /**
     * The mode after normalization, defaulting to self-service.
     */
    protected function resolvedMode(): string
    {
        $mode = $this->input('mode');

        return is_string($mode) && $mode !== ''
            ? $mode
            : BoothSessionMode::SELF_SERVICE->value;
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'voucher_code.required' => 'Kode voucher wajib diisi.',
            'mode.enum' => 'Mode sesi tidak dikenali.',
        ];
    }
}
