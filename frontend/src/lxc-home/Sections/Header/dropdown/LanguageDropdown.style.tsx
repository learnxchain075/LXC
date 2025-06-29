import styled from "styled-components";

import ToggleImg from "../../../assets/images/icons/dropdown-toggle.svg";

const LanguageDropdownStyleWrapper = styled.div`
  position: relative;
  max-width: 100px;

  &.open {
    .list {
      opacity: 1;
      visibility: visible;
      transform: scale(1) translateY(0);
    }
  }

  &:hover {
    button {
      &::after {
        top: 14px;
        transform: rotate(180deg);
      }
    }

    .list {
      opacity: 1;
      visibility: visible;
      transform: scale(1) translateY(0);
    }
  }

  button {
    background: transparent;
    border: 1px solid ${({ theme }) => theme.colors.blackColor}19;
    border-radius: 50px;
    width: 100px;
    height: 50px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    font-weight: 500;
    font-size: 15px;
    line-height: 20px;
    padding: 10px 14px;
    color: ${({ theme }) => theme.colors.title};
    position: relative;

    &::after {
      content: url(${ToggleImg});
      position: absolute;
      top: 12px;
      right: 11px;
      opacity: 0.4;
      transition: 0.3s;
    }

    img {
      width: 21px;
      height: 21px;
      border-radius: 50%;
      margin-right: 7.5px;
    }
  }

  .list {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    z-index: 10;
    margin-top: 10px;
    background: ${({ theme }) => theme.colors.whiteColor};
    border: 1px solid ${({ theme }) => theme.colors.blackColor}0d;
    box-shadow: 0px 5px 20px ${({ theme }) => theme.colors.blackColor}11;
    padding: 10px 0;
    transform: scale(0.75) translateY(-20px);
    opacity: 0;
    visibility: hidden;
    border-radius: 15px;
    transition: all 0.2s ease-in-out;
    width: 200px;
    height: auto;
    right: 0;
    left: unset;
    top: 130%;
    list-style: none;
    margin: 0px;
    padding: 28px 30px 30px 30px;
  }

  .list-item {
    font-weight: 500;
    font-size: 15px;
    line-height: 18px;
    color: ${({ theme }) => theme.colors.textColor} !important;
    line-height: 333%;

    &:hover {
      color: ${({ theme }) => theme.colors.title};
      background-color: transparent;
    }
    .select {
      display: none;
    }
  }

  &.finance {
    button {
      background: transparent;
      border: 1px solid ${({ theme }) => theme.colors.whiteColor}30;
      color: ${({ theme }) => theme.colors.whiteColor};
      position: relative;

      &::after {
        opacity: 1;
        filter: brightness(100);
      }

      img {
        width: 21px;
        height: 21px;
        border-radius: 50%;
        margin-right: 7.5px;
        filter: brightness(100);
      }
    }
  }
`;

export default LanguageDropdownStyleWrapper;
