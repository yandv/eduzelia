import Navbar from "@/lib/components/Navbar";


export default function Relatorio() {
  return (
    <>
      <Navbar/>
      <div className="max-w-7xl mx-auto mt-5">
        <div className="overflow-x-auto">
          <table className="table text-black">
            {/* head */}
            <thead className="text-sky-950 text-lg">
              <tr >
                <th></th>
                <th>Aluno</th>
                <th>Critério</th>
                <th>Nota 1</th>
                <th>Nota 2</th>
                <th>Nota 3</th>
                <th>Nota 4</th>
                <th>Média</th>
                <th>Situação</th>
                <th>Frequência</th>
              </tr>
            </thead>
            <tbody>
              {/* row 1 */}
              <tr>
                <th>1</th>
                <td>Cy Ganderton</td>
                <td>Quality Control Specialist</td>
                <td>Blue</td>
                <td>6</td>
                <td>7</td>
                <td>8</td>
                <td>9</td>
                <td>aprovado</td>
                <td>
                  <div className="tooltip tooltip-right" data-tip="hello">
                    <p>Hover me</p>
                  </div>
                </td>
              </tr>
              {/* row 2 */}
              <tr>
                <th>2</th>
                <td>Hart Hagerty</td>
                <td>Desktop Support Technician</td>
                <td>Purple</td>
              </tr>
              {/* row 3 */}
              <tr>
                <th>3</th>
                <td>Brice Swyre</td>
                <td>Tax Accountant</td>
                <td>Red</td>
              </tr>
            </tbody>
          </table>
        </div>
          <button className="btn text-white bg-sky-950 hover:bg-sky-900 mt-6">Exportar</button>
      </div>
    </>
  )
}