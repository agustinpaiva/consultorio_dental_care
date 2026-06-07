interface AuthInputProps {
  label: string
  name: string
  type: string
  required?: boolean
  minLength?: number
}

export default function AuthInput({ label, name, type, required, minLength }: AuthInputProps) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        type={type}
        name={name}
        required={required}
        minLength={minLength}
        className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  )
}
