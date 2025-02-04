interface TableRow extends Record<string, React.ReactNode> {
  id: string;
}

interface TableHeader<T extends TableRow, K extends keyof T> {
  key: K;
  label: React.ReactNode;
  className?: string;
}

interface TableProps<T extends TableRow> {
  rows: T[];
  headers: TableHeader<T, keyof T>[];
}

export default function Table<T extends TableRow>({
  rows,
  headers,
}: TableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="table">
        {/* head */}
        <thead className="text-sky-950 text-lg">
          <tr>
            {headers.map(({ key, label, className }) => (
              <th key={String(key)} className={className}>
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-black">
          {rows.map((row) => (
            <tr key={row.id}>
              {headers.map(({ key }) => (
                <td key={key.toString()}>{row[key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// export default function Table() {
//   return (
//     <>
//       <div className="overflow-x-auto">
//         <table className="table">
//           {/* head */}
//           <thead className="text-sky-950 text-lg">
//             <tr>
//               <th>Ordem da chamada</th>
//               <th>Aluno</th>
//               <th>Presença</th>
//             </tr>
//           </thead>
//           <tbody className="text-black">
//             {/* row 1 */}
//             <tr>
//               <td>
//                 <div className="flex items-center gap-3">
//                   <div>
//                     <div className="font-bold">1</div>
//                   </div>
//                 </div>
//               </td>
//               <td>Zemlak, Daniel and Leannon</td>
//               <td>
// <input
//   type="checkbox"
//   className="toggle toggle-success [--tglbg:aliceblue] "
// />
//               </td>
//             </tr>
//           </tbody>
//         </table>
//       </div>
//     </>
//   );
// }
