import { Upload } from "antd";
import styled from "styled-components";

export const WrapperHeader = styled.h1`
    color: #030;
    font-size: 16px;
    margin: 4px 0;
`

export const WrapperContentProfile = styled.div`
    display: flex;
    flex-direction: column;
    border: 1px solid #ccc;
    width: 500px;
    margin: 0 auto;
    padding: 20px;
    gap: 30px;
`

export const WrapperLabels = styled.label`
    color: #000;
    font-size:12px;
    line-height: 30px;
    font-weight:600;
`

export const WrapperInput = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    justify-content: space-between;
`

export const WrapperUploadFile = styled(Upload)`
    & .ant-upload.ant-upload-select.ant-upload-select-picture-card {
        width: 50px;
        height: 50px;
        border-radius: 50%;
    }
    & .ant-upload-list-item-container {
        display: none;
    }
`