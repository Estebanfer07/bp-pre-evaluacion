import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Table, type TableColumn } from "./Table";

type Row = { id: number; name: string; age: number };

const columns: TableColumn<Row>[] = [
  { key: "name", title: "Name" },
  { key: "age", title: "Age", align: "right" },
];

const data: Row[] = [
  { id: 1, name: "Alice", age: 30 },
  { id: 2, name: "Bob", age: 25 },
];

describe("Table", () => {
  it("renders table headers", () => {
    render(<Table columns={columns} data={data} />);
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Age")).toBeInTheDocument();
  });

  it("renders table rows and cells", () => {
    render(<Table columns={columns} data={data} />);
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("30")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.getByText("25")).toBeInTheDocument();
  });

  it("shows loading state", () => {
    render(<Table columns={columns} data={[]} loading />);
    expect(screen.getByText("Loading data...")).toBeInTheDocument();
  });

  it("shows empty message when no data", () => {
    render(<Table columns={columns} data={[]} emptyMessage="Nothing here" />);
    expect(screen.getByText("Nothing here")).toBeInTheDocument();
  });

  it("calls onRowClick when a row is clicked", () => {
    const onRowClick = vi.fn();
    render(<Table columns={columns} data={data} onRowClick={onRowClick} />);
    fireEvent.click(screen.getByText("Alice").closest("tr")!);
    expect(onRowClick).toHaveBeenCalledWith(data[0], 0);
  });

  it("renders custom cell content with render prop", () => {
    const customColumns: TableColumn<Row>[] = [
      {
        key: "name",
        title: "Name",
        render: (value) => (
          <span data-testid="custom">{value.toUpperCase()}</span>
        ),
      },
    ];
    render(<Table columns={customColumns} data={[data[0]]} />);
    expect(screen.getByTestId("custom")).toHaveTextContent("ALICE");
  });
});
