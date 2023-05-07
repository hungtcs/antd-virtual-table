import { ThemeProvider } from 'styled-components';
import { ResizeableHeaderCell } from './resizeable-header-cell';
import { Divider, Select, theme } from 'antd';
import { VirtualTable, ColumnType } from './virtual-table'
import { useCallback, useMemo, useState } from 'react'

export default function App() {
  const { token } = theme.useToken();

  const [size, setSize] = useState('large');

  const [columns, setColumns] = useState<ColumnType<any>[]>(() => {
    return [
      {
        title: 'A',
        width: 100,
        dataIndex: 'index',
        render: (value) => {
          return `A - ${ value }`;
        },
      },
      {
        title: 'B',
        dataIndex: 'index',
      },
      {
        title: 'C',
        dataIndex: 'index',
      },
      {
        title: 'D',
        width: 300,
        dataIndex: 'index',
      },
      {
        title: 'E',
        dataIndex: 'index',
      },
      {
        title: 'F',
        dataIndex: 'index',
      },
      {
        title: 'G',
        dataIndex: 'index',
      },
      {
        title: 'H',
        dataIndex: 'index',
      },
      {
        title: 'I',
        dataIndex: 'index',
      },
      {
        title: 'J',
        dataIndex: 'index',
      },
      {
        title: 'K',
        dataIndex: 'index',
      },
    ];
  });

  const onColumnResize = useCallback(
    (width: number, index: number) => {
      setColumns(prev => {
        const columns = [...prev];
        columns[index] = {
          ...columns[index],
          width,
        };
        console.log(columns[index]);

        return columns;
      });
    },
    [],
  );

  const dataSource = useMemo(
    () => {
      return Array.from({ length: 1000 }).map((_, index) => ({ index }));
    },
    [],
  );

  return (
    <ThemeProvider theme={{ token }}>
      <Select
        value={size}
        options={[
          { label: 'Large', value: 'large' },
          { label: 'Middle', value: 'middle' },
          { label: 'Small', value: 'small' },
        ]}
        onChange={value => setSize(value)}
      />
      <Divider />
      <div style={{height: 500}}>
        <VirtualTable
          size={size as any}
          rowKey={'index'}
          columns={
            columns.map((column, index) => {
              return {
                ...column,
                onHeaderCell: () => {
                  return {
                    width: column.width,
                    minWidth: 100,
                    maxWidth: 500,
                    onColumnResize: (width: number) => onColumnResize(width, index),
                  };
                },
              };
            })
          }
          components={{
            header: {
              cell: ResizeableHeaderCell,
            }
          }}
          dataSource={dataSource}
        />
      </div>
    </ThemeProvider>
  )
}
