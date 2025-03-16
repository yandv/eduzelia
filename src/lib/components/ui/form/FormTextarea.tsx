import { cn } from "@/lib/utils/cn";

interface FormTextareaProps
  extends React.InputHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  htmlFor?: string;
}

export default function FormTextarea({
  htmlFor,
  label,
  className,
  ...props
}: FormTextareaProps) {
  return (
    <div className={cn("flex flex-col text-left", className)}>
      <label className="text-sky-950 font-semibold" htmlFor={htmlFor}>
        {label}
      </label>
      <textarea
        className="input border-2 border-sky-950 bg-zinc-100 input-bordered w-full  drop-shadow-xl max-w-xs focus:text-black "
        {...props}
      />
    </div>
  );
}
