import { Col, Image, InputNumber } from "antd";
import styled from "styled-components";

export const WrapperImageSmall = styled(Image)`
    height: 64px;
    width: 64px;
`

export const WrapperStyleColImage = styled(Col)`
    flex-basic:uset;
`

export const WrapperStyleProductName = styled.h1`
    color: rgb(36, 36, 36);
    font-size: 24px;
    font-weight: 300;
    line-height: 32px;
    word-break: break-word;
`

export const WrapperPriceProduct = styled.div`
    background: rgb(250, 250, 250);
    border-radius: 4px;
`

export const WrapperPriceTextProduct = styled.h1`
    padding: 20px;
    font-size: 32px;
    line-height: 40px;
    margin-right: 8px;
    font-weight: 500;
    margin-top: 10px;
`

export const WrapperAdress = styled.div`
    span.adress {
        text-decoration: underline;
        font-size: 15px;
        line-height: 24px;
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    };
    span.changeAdress {
        color: rgb(11, 116, 229);
        font-size: 16px;
        line-height: 24px;
        font-weight: 500;
    }
`

export const WrapperQuantityProduct = styled.h1`
    display: flex;
    gap:4px;
    border-radius:4px;
    flex-direction: column;
    padding: 10px;
`

export const WrapperInputNumber = styled(InputNumber)`
   &.ant-input-number {
        width: 40px;
        border-radius: 0
    }
    &.ant-input-number .ant-input-number-handler-wrap {
        display: none;
    }
    &.ant-input-number .ant-input-number-input {

        text-align: center;
    }
`