import styled from 'styled-components';

export const Button = styled.button`
  width: auto;
  display: inline-flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  white-space: nowrap;
  border-radius: 4px;
  flex-shrink: 0;
  margin: 0px;
  font-weight: 500;
  line-height: normal;
  font-size: 13px;
  transition-property: border, background, color, box-shadow;
  transition-duration: 0.15s;
  user-select: none;
  -webkit-app-region: no-drag;
  min-width: 32px;
  height: 44px;
  padding: 0px 21px;
  border: 1px solid rgb(110, 121, 214);
  box-shadow: rgba(0, 0, 0, 0.25) 0px 1px 2px;
  background: rgb(110, 121, 214);
  color: rgb(255, 255, 255);
  &:focus {
    outline: none;
  }
  &:hover {
    background: rgb(121, 131, 216);
    transition-duration: 0s;
  }
`;
