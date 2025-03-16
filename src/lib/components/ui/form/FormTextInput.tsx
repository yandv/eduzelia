import { cn } from "@/lib/utils/cn";

interface FormTextInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  htmlFor?: string;
}

export default function FormTextInput({
  htmlFor,
  label,
  className,
  ...props
}: FormTextInputProps) {
  return (
    <div className={cn("flex flex-col text-left", className)}>
      <label className="text-sky-950 font-semibold" htmlFor={htmlFor}>
        {label}
      </label>
      <input
        className="input border-2 border-sky-950 bg-zinc-100 input-bordered w-full  drop-shadow-xl max-w-xs focus:text-black "
        {...props}
      />
    </div>
  );
}
