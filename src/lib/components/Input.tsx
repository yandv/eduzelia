
type InputProps = React.InputHTMLAttributes<HTMLInputElement>;// todos os parametros que vc pode passar para uma função input
//componente react só aceita um parametro que tem que ser um objeto


export default function Input(props: InputProps) {
    return (
        <>
            <input className="input border-2 border-sky-950 bg-zinc-100 input-bordered w-full  drop-shadow-xl max-w-xs focus:text-black "{...props} />
        </>
    )
}

//desestruturação de objeto