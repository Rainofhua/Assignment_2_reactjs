import React, { useState } from 'react';
import axios from 'axios';

const FileUploadComponent = () => {
    const [file, setFile] = useState(null);
    const [uploadedFileUrl, setUploadedFileUrl] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleFileUpload = async () => {
        if (!file) {
            alert('Please select a file first!');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('/api/upload/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setUploadedFileUrl(response.data.uploaded_file_url);
            alert('File uploaded successfully!');
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('Failed to upload file.');
        }
    };

    return (
        <div>
            <h2>Upload Excel File</h2>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleFileUpload}>Upload</button>
            {uploadedFileUrl && (
                <p>
                    File uploaded: <a href={uploadedFileUrl} target="_blank" rel="noopener noreferrer">{uploadedFileUrl}</a>
                </p>
            )}
        </div>
    );
};

export default FileUploadComponent;
