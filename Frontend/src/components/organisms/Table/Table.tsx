import React from "react";
import "./table.scss";

export interface TableColumn<T = any> {
  key: string;
  title: string;
  align?: "left" | "center" | "right";
  width?: string;
  render?: (value: any, record: T, index: number) => React.ReactNode;
}

export interface TableProps<T = any> {
  columns: TableColumn<T>[];
  data: T[];
  onRowClick?: (record: T, index: number) => void;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
  rowClassName?: string | ((record: T, index: number) => string);
}

export const Table = <T extends Record<string, any>>({
  columns,
  data,
  onRowClick,
  loading = false,
  emptyMessage = "No data available",
  className = "",
  rowClassName = "",
}: TableProps<T>): React.ReactElement => {
  const getRowClassName = (record: T, index: number): string => {
    const baseClassName = "table__row";
    const clickableClassName = onRowClick ? "table__row--clickable" : "";
    const customClassName =
      typeof rowClassName === "function"
        ? rowClassName(record, index)
        : rowClassName;

    return [baseClassName, clickableClassName, customClassName]
      .filter(Boolean)
      .join(" ");
  };

  const handleRowClick = (record: T, index: number) => {
    if (onRowClick) {
      onRowClick(record, index);
    }
  };

  const renderCellContent = (
    column: TableColumn<T>,
    record: T,
    index: number
  ) => {
    if (column.render) {
      return column.render(record[column.key], record, index);
    }

    const value = record[column.key];
    return value !== null && value !== undefined ? String(value) : "-";
  };

  if (loading) {
    return (
      <div className={`table-container ${className}`}>
        <div className="table__loading">
          <div className="loading-spinner"></div>
          <p>Loading data...</p>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className={`table-container ${className}`}>
        <div className="table__empty">
          <p>{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`table-container ${className}`}>
      <table className="table">
        <thead className="table__header">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={`table__header-cell table__header-cell--${column.align || "left"}`}
                style={{ width: column.width }}
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="table__body">
          {data.map((record, index) => (
            <tr
              key={record.id || index}
              className={getRowClassName(record, index)}
              onClick={() => handleRowClick(record, index)}
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={`table__cell table__cell--${column.align || "left"}`}
                >
                  {renderCellContent(column, record, index)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
