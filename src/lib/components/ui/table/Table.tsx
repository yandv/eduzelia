export interface TableRow extends Record<string, any> {
  id: string;
}

export interface TableHeader<T extends TableRow, K extends keyof T> {
  key: K;
  label?: React.ReactNode;
  className?: string;
}

export interface TableProps<T extends TableRow> {
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
        <thead>
          <tr>
            {headers.map(({ key, label, className }) => (
              <th key={String(key)} className={className}>
                <p className="text-sky-950">{label ?? ""}</p>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              {headers.map(({ key }) => (
                <td key={key.toString()} className="text-black">
                  {row[key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
