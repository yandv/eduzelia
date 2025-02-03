interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  htmlFor?: string;
}

export default function Input({ htmlFor, label, ...props }: InputProps) {
  return (
    <>
      <label className="text-sky-950 font-semibold" htmlFor={htmlFor}>
        {label}
      </label>
      <input
        className="input border-2 border-sky-950 bg-zinc-100 input-bordered w-full  drop-shadow-xl max-w-xs focus:text-black "
        {...props}
      />
    </>
  );
}
