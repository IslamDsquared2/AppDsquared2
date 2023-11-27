// Utils/useDragAndDrop.js
import { useCallback, useState } from 'react';

const useDragAndDrop = (handleFileChange) => {
    const [isDragActive, setIsDragActive] = useState(false);

    const handleDragEnter = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(true);
    }, []);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);
    }, []);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);

        const event = { target: { files: e.dataTransfer.files } };
        handleFileChange(event);
    }, [handleFileChange]);

    return {
        isDragActive,
        handleDragEnter,
        handleDragLeave,
        handleDragOver,
        handleDrop,
    };
};

export default useDragAndDrop;
