<?php

namespace App\Http\Requests\Api;

use App\Enums\DevicePlatform;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PairDeviceRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'device_code' => ['required', 'string', 'max:16', 'regex:/^PB-[A-Z2-9]{4}-[A-Z2-9]{4}$/'],
            'platform' => ['required', Rule::in(DevicePlatform::values())],
            'device_identifier' => ['nullable', 'string', 'max:255'],
            'app_version' => ['nullable', 'string', 'max:64'],
        ];
    }
}