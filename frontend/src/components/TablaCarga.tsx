import React from "react";
import { TableRow, TableCell } from "@fluentui/react-components";
import { SkeletonItem } from "@fluentui/react-skeleton";

interface TableSkeletonProps {
  columns: number;
  rows: number;
}

const TableSkeleton: React.FC<TableSkeletonProps> = ({ columns, rows }) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <TableRow key={`skeleton-row-${rowIndex}`}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <TableCell
              key={`skeleton-col-${colIndex}`}
              tabIndex={0}
              role="gridcell"
            >
              <SkeletonItem shape="rectangle" size={24} />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
};

export default TableSkeleton;
