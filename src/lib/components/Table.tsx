
export default function Table() {
    return (
        <>
            <div className="overflow-x-auto">
                <table className="table">
                    {/* head */}
                    <thead className="text-sky-950 text-lg">
                        <tr>
                            <th>
                                <label>
                                    <input type="checkbox" className="checkbox" />
                                </label>
                            </th>
                            <th>Ordem da chamada</th>
                            <th>Aluno</th>
                            <th>Presença</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody className="text-black">
                        {/* row 1 */}
                        <tr>
                            <th>
                                <label>
                                    <input type="checkbox" className="checkbox" />
                                </label>
                            </th>
                            <td>
                                <div className="flex items-center gap-3">
                                    <div>
                                        <div className="font-bold">1</div>
                                    </div>
                                </div>
                            </td>
                            <td>
                                Zemlak, Daniel and Leannon
                            </td>
                            <td>
                                <input type="checkbox" className="toggle toggle-success [--tglbg:aliceblue] " />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    )
}