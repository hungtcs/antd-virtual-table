import 'react-resizable/css/styles.css';
import styled from 'styled-components';
import { Resizable } from 'react-resizable';
import { forwardRef } from 'react';

const HeaderCell = styled.th`
  &::before {
    display: none;
  }
  > span {
    top: 50%;
    width: 2px;
    cursor: ew-resize;
    height: 1.6em;
    position: absolute;
    transform: translateY(-50%);
    transition: background-color 0.2s;
    inset-inline-end: 0;
    background-color: ${ props => props.theme.token.colorBorder };
  }
`;

const ResizeHandler = forwardRef<HTMLSpanElement, any>(
  function ResizeHandler(props, ref) {
    const { handleAxis, ...restProps } = props;

    return (
      <span {...restProps} ref={ref} />
    );
  },
);

export function ResizeableHeaderCell(props: any) {
  const { width, onColumnResize, minWidth, maxWidth, children, ...restProps } = props;

  if (!width) {
    return <th {...restProps}>{children}</th>
  }

  return (
    <Resizable
      axis='x'
      width={width}
      handle={<ResizeHandler />}
      resizeHandles={['e']}
      minConstraints={[minWidth, 0]}
      maxConstraints={[maxWidth, Infinity]}
      onResize={(_, { size }) => onColumnResize(size.width)}>
      <HeaderCell>{children}</HeaderCell>
    </Resizable>
  );
}
