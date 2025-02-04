import { cn } from "../../utils/cn";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export function Button({ children, className, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={cn(
        "btn text-white bg-sky-950 hover:bg-sky-900",
        className
      )}
    >
      {children}
    </button>
  );
}
