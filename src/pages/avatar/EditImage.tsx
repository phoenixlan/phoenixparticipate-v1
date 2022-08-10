/*
 * @created 29/03/2021 - 12:19
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { NegativeButton, PositiveButton } from '../../sharedComponents/forms/Button';
import styled from 'styled-components';

const Container = styled.div`
    padding: ${({ theme }) => theme.spacing.m};
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const Controls = styled.div`
    margin-top: ${({ theme }) => theme.spacing.m};
`;

const UploadButton = styled(PositiveButton)`
    margin-right: ${({ theme }) => theme.spacing.m};
`;

interface Props {
    file: File;
    upload: (x: number, y: number, w: number, h: number) => void;
    cancel: () => void;
}

export const EditImage: React.FC<Props> = ({ file, cancel, upload }) => {
    const imageRef = useRef<HTMLImageElement>();
    const [crop, setCrop] = useState<ReactCrop.Crop>({});
    const [blob, setBlob] = useState<string>('');
    const [isUploading, setIsUploading] = useState(false);
    const [minWidth, setMinWidth] = useState(600);
    const [minHeight, setMinHeight] = useState(450);

    // Create a blob from the image file at first render.
    useEffect(() => {
        const objectURL = URL.createObjectURL(file);
        setBlob(objectURL);

        return () => {
            URL.revokeObjectURL(objectURL);
        };
    }, []);

    // When both the original image (blob) and the rendered image (imageRef.current) are set
    // then set the crop area
    useEffect(() => {
        if (blob !== '' && imageRef && imageRef.current) {
            LoadImage((originalWidth, originalHeight, image) => {
                const ratio = originalWidth < image.width ? originalWidth / image.width : image.width / originalWidth;
                const y = image.height / 2 - ratio * (minHeight / 2);
                const x = image.width / 2 - ratio * (minWidth / 2);

                setMinHeight(minHeight * ratio);
                setMinWidth(minWidth * ratio);

                setCrop({
                    unit: 'px',
                    aspect: 4 / 3,
                    width: ratio * 600,
                    height: ratio * 450,
                    x,
                    y,
                });
            }, imageRef.current);
        }
    }, [blob, imageRef.current]);

    // Load an image (needed to get the original width of an image)
    const LoadImage = (
        func: (width: number, height: number, image: HTMLImageElement) => void,
        renderedImage: HTMLImageElement,
    ) => {
        const image = new Image();

        image.onload = async () => {
            func(image.width, image.height, renderedImage);
        };

        image.src = blob;
    };

    // Callback function for ReactCrop to get the rendered image
    const onLoad = useCallback((img: HTMLImageElement) => {
        imageRef.current = img;
    }, []);

    const onUpload = async () => {
        if (!imageRef.current) {
            return;
        }

        const round = (num: number, decimal: number) => {
            return Math.round((num + Number.EPSILON) * Math.pow(10, decimal)) / Math.pow(10, decimal);
        };

        LoadImage(async (originalWidth, originalHeight, image) => {
            if (
                crop.x === undefined ||
                crop.y === undefined ||
                crop.width === undefined ||
                crop.height === undefined ||
                crop.unit === undefined
            ) {
                return;
            }

            const ratio = originalWidth > image.width ? originalWidth / image.width : image.width / originalWidth;
            let x;
            let y;
            let w;
            let h;
            if (crop.unit === '%') {
                w = round((originalWidth * crop.width) / 100, 0);
                h = round((originalHeight * crop.height) / 100, 0);
                x = round((originalWidth * crop.x) / 100, 0);
                y = round((originalHeight * crop.y) / 100, 0);
            } else {
                w = round(crop.width * ratio, 0);
                h = round(crop.height * ratio, 0);
                x = round(crop.x * ratio, 0);
                y = round(crop.y * ratio, 0);
            }

            setIsUploading(true);
            await upload(x, y, w, h);
            setIsUploading(false);
        }, imageRef.current);
    };

    return (
        <Container>
            <ReactCrop
                src={blob}
                crop={crop}
                minWidth={minWidth}
                minHeight={minHeight}
                onImageLoaded={onLoad}
                keepSelection={true}
                onChange={(newCrop) => setCrop(newCrop)}
            />
            <Controls>
                <UploadButton isLoading={isUploading} onClick={onUpload}>
                    Upload
                </UploadButton>
                <NegativeButton onClick={cancel}>Cancel</NegativeButton>
            </Controls>
        </Container>
    );
};
