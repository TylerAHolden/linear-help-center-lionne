import React from 'react';
import styled from 'styled-components';
import { Button } from './Button';

const InputContainer = styled.div`
  display: flex;
  flex: initial;
  flex-direction: row;
  width: 100%;
  padding: 32px;
`;

const StyledInput = styled.input`
  background: rgb(31, 32, 35);
  border: 1px solid rgb(60, 63, 68);
  border-radius: 4px;
  font-size: 13px;
  color: rgb(247, 248, 248);
  margin: 0px;
  appearance: none;
  transition: border 0.15s ease 0s;
  height: 44px;
  padding: 12px;
  flex: 1 1 0%;
  margin-right: 8px;
  &:hover {
    border-color: rgb(69, 72, 78);
    transition-duration: 0s;
  }
  &:focus {
    box-shadow: none;
    border-color: rgb(100, 153, 255);
    outline: none;
  }
`;

const Input = ({ buttonText, placeholder, onChange, value, onButtonClick }) => {
  return (
    <InputContainer>
      <StyledInput
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      {buttonText && <Button onClick={onButtonClick}>{buttonText}</Button>}
    </InputContainer>
  );
};

export default Input;
