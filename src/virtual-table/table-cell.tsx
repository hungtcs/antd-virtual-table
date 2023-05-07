import styled from 'styled-components';

export const TableCell = styled.div`
  box-sizing: border-box;
  border-bottom: ${ props => props.theme.token.lineWidth }px ${ props => props.theme.token.lineType } ${ props => props.theme.token.colorSplit };
  background-color: ${ props => props.theme.token.colorBgContainer };
`;
