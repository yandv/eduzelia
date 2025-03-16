"use client";

import { useState } from "react";
import Table, { TableProps, TableRow } from "./Table";

export type SelectableTableRow<T> = T & { selected: React.ReactNode };

export enum SelectableTableKind {
  SINGLE = "SINGLE",
  MULTIPLE = "MULTIPLE",
}

export interface SelectableTableProps<T extends TableRow> {
  headers: TableProps<T>["headers"];
  rows: T[];
  selection?: SelectableTableKind;
  dispatcher: [T[], React.Dispatch<React.SetStateAction<T[]>>];
}

interface UseSelectionReturn<T extends TableRow> {
  dispatcher: [T[], React.Dispatch<React.SetStateAction<T[]>>];
  selectedRows: T[];
  setSelectedRows: React.Dispatch<React.SetStateAction<T[]>>;
}

export function useSelection<T extends TableRow>(): UseSelectionReturn<T> {
  const dispatcher = useState<T[]>([]);

  return {
    dispatcher,
    selectedRows: dispatcher[0],
    setSelectedRows: dispatcher[1],
  };
}

export function SelectableTable<T extends TableRow>({
  headers,
  rows,
  selection = SelectableTableKind.SINGLE,
  dispatcher: [selected, setSelected],
}: SelectableTableProps<T>) {
  const handleSelect = (row: T) => {
    return () => {
      if (selection === SelectableTableKind.SINGLE) {
        setSelected([row]);
      } else {
        setSelected((prevState) => {
          if (prevState.some((r) => r.id === row.id)) {
            return prevState.filter((r) => r.id !== row.id);
          }

          return [...prevState, row];
        });
      }
    };
  };

  return (
    <Table<SelectableTableRow<T>>
      headers={[
        {
          key: "selected",
          label: (
            <>
              {selection === SelectableTableKind.MULTIPLE && (
                <input
                  type="checkbox"
                  checked={rows.length > 0 && selected.length === rows.length}
                  onChange={() =>
                    setSelected((prevState) => {
                      if (prevState.length === rows.length) {
                        return [];
                      }

                      return rows;
                    })
                  }
                />
              )}
            </>
          ),
          className: "w-[25px]",
        },
        ...headers,
      ]}
      rows={rows.map((row) => ({
        selected: (
          <input
            type="checkbox"
            checked={(() => {
              console.log(selected, row);
              return selected.some((r) => r.id === row.id);
            })()}
            onChange={handleSelect(row)}
          />
        ),
        ...row,
      }))}
    />
  );
}
