'use client'
interface TurmaProps{
    id: string;
    name: string;
}

export default function TurmaCard({id , name}:TurmaProps){
    return(
    <>
         <div key={id} className="card bg-white mt-6 text-sky-950 max-w-sm h-40 shadow-xl scale-100 transform transition duration-500 hover:scale-[1.1] border rounded px-0">
                    <div className="card-body flex flex-row justify-center place-content-center border rounded">
                      <h2 className="card-title">
                        <ul className="flex flex-row text-2xl">Turma &nbsp;
                          <li >{name}</li>
                        </ul>
                      </h2>
                    </div>
                  </div>
    </>
    )
}