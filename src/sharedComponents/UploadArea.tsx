/*
 * @created 29/03/2021 - 10:32
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { Upload } from '@styled-icons/fa-solid/Upload';
import { toast } from 'react-toastify';

const Container = styled.div<{ highlight: boolean }>`
    min-height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: ${({ theme, highlight }) => (highlight ? theme.shadow.blueStrong : null)};
`;

const Info = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const StyledUpload = styled(Upload)`
    height: 2rem;
    margin-bottom: ${({ theme }) => theme.spacing.s};
`;

const Input = styled.input`
    display: none;
`;

interface Props {
    onFileDrop: (file: File) => void;
    maxSize?: number;
    minWidth?: number;
    minHeight?: number;
}

export const UploadArea: React.FC<Props> = ({ onFileDrop, maxSize = 16000000, minWidth = 600, minHeight = 450 }) => {
    const [highlightArea, setHighlightArea] = useState(false);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const openInput = () => {
        if (inputRef.current) {
            inputRef.current.click();
        }
    };

    const fileCheck = (file: File) => {
        if (file.size > maxSize) {
            return onFileError(`File must be less than ${maxSize / 1000000}MB`);
        }

        const fileReader = new FileReader();

        fileReader.onload = () => {
            const img = new Image();

            img.onload = () => {
                if (img.width < minWidth || img.height < minHeight) {
                    return onFileError(`Image is too small, it must be at least ${minWidth}x${minHeight}`);
                }
                onFileDrop(file);
            };

            if (typeof fileReader.result === 'string') {
                img.src = fileReader.result;
            } else {
                return onFileError('Failed to load image');
            }
        };

        fileReader.readAsDataURL(file);
    };

    const onFileError = (error: string) => {
        toast.error(error);
    };

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.item(0);
        if (file) {
            fileCheck(file);
        }
    };

    const onDragEnter = () => {
        setHighlightArea(true);
    };

    const onDragLeave = () => {
        setHighlightArea(false);
    };

    const onDragOver = (e: React.DragEvent<HTMLInputElement>) => {
        e.preventDefault();
        setHighlightArea(true);
    };

    const onDrop = (e: React.DragEvent<HTMLInputElement>) => {
        e.preventDefault();
        setHighlightArea(false);

        if (e.dataTransfer.items.length > 0) {
            if (e.dataTransfer.items[0].kind === 'file') {
                const file = e.dataTransfer.items[0].getAsFile();
                if (file) {
                    fileCheck(file);
                }
            }
        } else {
            const file = e.dataTransfer.files.item(0);
            if (file) {
                fileCheck(file);
            }
        }
    };

    return (
        <Container
            highlight={highlightArea}
            onClick={openInput}
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
            onDragOver={onDragOver}
            onDrop={onDrop}
        >
            <Info>
                <StyledUpload />
                <Input ref={inputRef} type="file" id="fileElem" accept="image/*" onChange={onFileChange} />
                <label htmlFor="fileElem">Click or drag file to upload</label>
            </Info>
        </Container>
    );
};
