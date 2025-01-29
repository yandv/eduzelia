
type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export default function Input(props: InputProps) {
    return (
        <>
            <input className="input border-2 border-sky-950 bg-zinc-100 input-bordered w-full  drop-shadow-xl max-w-xs focus:text-black "{...props} />
        </>
    )
}