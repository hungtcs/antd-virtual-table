import ResizeObserver from 'rc-resize-observer';
import { get } from 'rc-util';
import { theme } from 'antd';
import { Table } from './table';
import { TableCell } from './table-cell';
import { VariableSizeGrid } from 'react-window';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type { CustomizeScrollBody } from 'rc-table/lib/interface';
import type { TableColumnType, TableProps } from 'antd';

export interface ColumnType<RecordType> extends TableColumnType<RecordType> {
  width?: number;
}

type MergedColumn<RecordType> = ColumnType<RecordType> & { width: number };

export interface VirtualTableProps<RecordType> extends TableProps<RecordType> {
  columns: ColumnType<RecordType>[];
}

export function VirtualTable<RecordType extends object = any>(props: VirtualTableProps<RecordType>) {
  const { size, columns, components, ...restProps } = props;

  const { token } = theme.useToken();

  const gridRef = useRef<any>();
  const [tableSize, setTableSize] = useState({ width: 0, height: 0 });

  const mergedColumns = useMemo(
    () => {
      const widthColumnCount = columns.filter(({ width }) => !width).length;
      return columns.map<MergedColumn<RecordType>>(column => {
        if (!column.width) {
          column.width = Math.floor(tableSize.width / widthColumnCount);
        }
        return column as MergedColumn<RecordType>;
      });
    },
    [columns, tableSize],
  );

  const [connectObject] = useState<any>(() => {
    const obj = {};
    Object.defineProperty(obj, 'scrollLeft', {
      get: () => {
        if (gridRef.current) {
          return gridRef.current?.state?.scrollLeft;
        }
        return null;
      },
      set: (scrollLeft: number) => {
        if (gridRef.current) {
          gridRef.current.scrollTo({ scrollLeft });
        }
      },
    });

    return obj;
  });

  const renderTableBody = useCallback<CustomizeScrollBody<RecordType>>(
    (data, info) => {
      const { ref, scrollbarSize, onScroll } = info;

      if (ref instanceof Function) {
        ref(connectObject);
      } else {
        (ref as any).current = connectObject;
      }

      const totalHeight = data.length * 54;
      const tableRowHeight = size === 'small' ? 39 : size === 'middle' ? 47 : 55;
      const tableCellPadding = size === 'small'
        ? `${ token.paddingXS }px`
        : size === 'middle'
          ? `${ token.paddingSM }px ${ token.paddingXS }px`
          : token.padding;

      return (
        <VariableSizeGrid
          ref={gridRef}
          width={tableSize.width}
          height={tableSize.height - tableRowHeight}
          onScroll={a => onScroll({ scrollLeft: a.scrollLeft })}
          rowCount={data.length}
          rowHeight={() => tableRowHeight}
          columnCount={mergedColumns.length}
          columnWidth={
            (index) => {
              const { width } = mergedColumns[index];
              return totalHeight > tableSize.height && index === mergedColumns.length - 1
                ? width - scrollbarSize - 1
                : width;
            }
          }>
          {
            (childrenProps) => {
              const { style, rowIndex, columnIndex } = childrenProps;
              const record: any = data[rowIndex];
              const column = mergedColumns[columnIndex];
              const value = column.dataIndex ? Array.isArray(column.dataIndex) ? get(record, column.dataIndex) : record[column.dataIndex as any] : undefined;
              const content = column.render ? column.render(value, record, rowIndex) : value;
              return (
                <TableCell style={{...style, padding: tableCellPadding}}>{content}</TableCell>
              );
            }
          }
        </VariableSizeGrid>
      );
    },
    [connectObject, mergedColumns, size, tableSize, token],
  );

  useEffect(
    () => {
      gridRef.current?.resetAfterColumnIndex(0, true);
    },
    [tableSize, mergedColumns],
  );

  useEffect(
    () => {
      gridRef.current?.resetAfterRowIndex(0, true);
    },
    [size],
  );

  return (
    <ResizeObserver onResize={size => setTableSize({ width: size.width, height: size.height })}>
      <Table
        {...restProps}
        size={size}
        scroll={{ y: tableSize.height }}
        columns={mergedColumns}
        pagination={false}
        components={{
          ...components,
          body: renderTableBody,
        }}
      />
    </ResizeObserver>
  );
}
