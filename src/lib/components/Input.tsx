
type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export default function Input(props: InputProps) {
    return (
        <>
            <input className="input border-2 border-sky-950 bg-gray-300 input-bordered w-full max-w-xs"{...props} />
        </>
    )
}