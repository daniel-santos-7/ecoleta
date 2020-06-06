import React, {useCallback, useState, ReactElement} from 'react';
import {useDropzone} from 'react-dropzone';
import './styles.css';
import { FiUpload } from 'react-icons/fi';

interface Props {
    onFileUploaded: (file: File) => void;
}

export default function Dropzone(props:Props):ReactElement {

    const [selectedFileUrl, setSelectedFileUrl] = useState<string>('');

    const onDrop = useCallback((acceptedFiles:File[]) => {

        const [file] = acceptedFiles;

        const fileURL = URL.createObjectURL(file);

        setSelectedFileUrl(fileURL);

        props.onFileUploaded(file);

    }, [props]);

const {getRootProps, getInputProps} = useDropzone({onDrop,accept:'image/*'});

return (
    <div {...getRootProps()} className="dropzone">
        <input {...getInputProps()} accept="image/*"/>
        { selectedFileUrl ? <img src={selectedFileUrl} alt="Upload preview"/>:<p><FiUpload/>Imagem do estabelecimento</p> }
    </div>
);

}