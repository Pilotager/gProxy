import { Input } from "@/components/ui/input";

export interface FormFieldProps {
  id: string;
  label: string;
  defaultValue?: string;
  placeholder?: string;
  description?: string;
  type?: string;
  onChange?: (value: string) => void;
}

// Form field component for consistent UI
export const FormField = ({
  id,
  label,
  defaultValue = "",
  placeholder = "",
  description = "",
  type = "text",
  onChange,
}: FormFieldProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium leading-none" htmlFor={id}>
        {label}
      </label>
      <Input
        id={id}
        placeholder={placeholder}
        defaultValue={defaultValue}
        type={type}
        onChange={(e) => onChange?.(e.target.value)}
      />
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  );
};

export interface CheckboxFieldProps {
  id: string;
  label: string;
  defaultChecked?: boolean;
  description?: string;
  onChange?: (checked: boolean) => void;
}

// Checkbox field component
export const CheckboxField = ({
  id,
  label,
  defaultChecked = false,
  description = "",
  onChange,
}: CheckboxFieldProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id={id}
          defaultChecked={defaultChecked}
          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          onChange={(e) => onChange?.(e.target.checked)}
        />
        <label className="text-sm font-medium leading-none" htmlFor={id}>
          {label}
        </label>
      </div>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  );
};

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectFieldProps {
  id: string;
  label: string;
  options: SelectOption[];
  defaultValue: string;
  description?: string;
  onChange?: (value: string) => void;
}

// Select field component
export const SelectField = ({
  id,
  label,
  options,
  defaultValue,
  description = "",
  onChange,
}: SelectFieldProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium leading-none" htmlFor={id}>
        {label}
      </label>
      <select
        id={id}
        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        defaultValue={defaultValue}
        onChange={(e) => onChange?.(e.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  );
};
