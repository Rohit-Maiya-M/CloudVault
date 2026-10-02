import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import type { FileMetadata } from "../../types";

import "./Dashboard.css";

export default function Dashboard() {
    const { user, logout } = useAuth();

    const [files, setFiles] = useState<FileMetadata[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState("");

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const loadFiles = async () => {
        try {
            setError("");

            const response = await api.get<FileMetadata[]>(
                "/api/files"
            );

            setFiles(response.data);
        } catch {
            setError("Unable to load your files.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadFiles();
    }, []);

    const handleChooseFile = () => {
        fileInputRef.current?.click();
    };

    const handleFileUpload = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const selectedFile = event.target.files?.[0];

        if (!selectedFile) {
            return;
        }

        setIsUploading(true);
        setError("");

        try {
            const formData = new FormData();

            formData.append("file", selectedFile);

            const response = await api.post<FileMetadata>(
                "/api/files",
                formData
            );

            setFiles((currentFiles) => [
                response.data,
                ...currentFiles,
            ]);
        } catch {
            setError("Unable to upload the file.");
        } finally {
            setIsUploading(false);

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const handleDownload = async (file: FileMetadata) => {
        try {
            setError("");

            const response = await api.get(
                `/api/files/${file.id}/download`,
                {
                    responseType: "blob",
                }
            );

            const blob = new Blob(
                [response.data],
                {
                    type:
                        file.contentType ||
                        "application/octet-stream",
                }
            );

            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");

            link.href = url;
            link.download = file.fileName;

            document.body.appendChild(link);
            link.click();

            link.remove();

            window.URL.revokeObjectURL(url);
        } catch {
            setError("Unable to download the file.");
        }
    };

    const handleDelete = async (file: FileMetadata) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${file.fileName}"?`
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");

            await api.delete(`/api/files/${file.id}`);

            setFiles((currentFiles) =>
                currentFiles.filter(
                    (currentFile) =>
                        currentFile.id !== file.id
                )
            );
        } catch {
            setError("Unable to delete the file.");
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) {
            return "0 B";
        }

        const units = [
            "B",
            "KB",
            "MB",
            "GB",
            "TB",
        ];

        const index = Math.floor(
            Math.log(bytes) / Math.log(1024)
        );

        const size =
            bytes /
            Math.pow(1024, index);

        return `${size.toFixed(index === 0 ? 0 : 2)} ${
            units[index]
        }`;
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleString();
    };

    const totalStorage = files.reduce(
        (total, file) => total + file.fileSize,
        0
    );

    return (
        <div className="dashboard-page">

            <header className="dashboard-header">

                <div className="dashboard-brand">
                    <div className="dashboard-brand-mark">
                        C
                    </div>

                    <div>
                        <h1>CloudVault</h1>
                        <p>Cloud file storage</p>
                    </div>
                </div>

                <div className="dashboard-user">

                    <span>
                        Welcome, {user?.username}
                    </span>

                    <button onClick={logout}>
                        Logout
                    </button>

                </div>

            </header>

            <main className="dashboard-content">

                <section className="dashboard-intro">

                    <div>
                        <h2>Dashboard</h2>

                        <p>
                            Manage your files securely in the cloud.
                        </p>
                    </div>

                </section>

                {error && (
                    <div className="dashboard-error">
                        {error}
                    </div>
                )}

                <section className="dashboard-stats">

                    <div className="stat-card">

                        <span>Total Files</span>

                        <strong>
                            {files.length}
                        </strong>

                    </div>

                    <div className="stat-card">

                        <span>Storage Used</span>

                        <strong>
                            {formatFileSize(totalStorage)}
                        </strong>

                    </div>

                    <div className="stat-card">

                        <span>Storage Provider</span>

                        <strong>
                            Amazon S3
                        </strong>

                    </div>

                </section>

                <section className="upload-section">

                    <div className="upload-section-header">

                        <div>
                            <h3>Upload Files</h3>

                            <p>
                                Upload your files securely to
                                cloud storage.
                            </p>
                        </div>

                    </div>

                    <div className="upload-box">

                        <div className="upload-icon">
                            ↑
                        </div>

                        <h4>
                            Upload a file
                        </h4>

                        <p>
                            Select a file from your computer
                            to upload it to CloudVault.
                        </p>

                        <button
                            onClick={handleChooseFile}
                            disabled={isUploading}
                        >
                            {isUploading
                                ? "Uploading..."
                                : "Choose File"}
                        </button>

                        <input
                            ref={fileInputRef}
                            type="file"
                            hidden
                            onChange={handleFileUpload}
                        />

                    </div>

                </section>

                <section className="files-section">

                    <div className="section-header">

                        <div>
                            <h3>Your Files</h3>

                            <p>
                                Files stored in your CloudVault
                                account.
                            </p>
                        </div>

                        <span>
                            {files.length}{" "}
                            {files.length === 1
                                ? "file"
                                : "files"}
                        </span>

                    </div>

                    {isLoading ? (
                        <div className="empty-state">
                            <h4>
                                Loading files...
                            </h4>
                        </div>
                    ) : files.length === 0 ? (
                        <div className="empty-state">

                            <div className="empty-icon">
                                ☁
                            </div>

                            <h4>
                                No files yet
                            </h4>

                            <p>
                                Upload your first file to get
                                started with CloudVault.
                            </p>

                        </div>
                    ) : (
                        <div className="file-list">

                            {files.map((file) => (
                                <div
                                    className="file-row"
                                    key={file.id}
                                >

                                    <div className="file-info">

                                        <div className="file-icon">
                                            FILE
                                        </div>

                                        <div className="file-details">

                                            <strong>
                                                {file.fileName}
                                            </strong>

                                            <span>
                                                {formatFileSize(
                                                    file.fileSize
                                                )}{" "}
                                                •{" "}
                                                {formatDate(
                                                    file.uploadedAt
                                                )}
                                            </span>

                                        </div>

                                    </div>

                                    <div className="file-actions">

                                        <button
                                            className="download-button"
                                            onClick={() =>
                                                handleDownload(
                                                    file
                                                )
                                            }
                                        >
                                            Download
                                        </button>

                                        <button
                                            className="delete-button"
                                            onClick={() =>
                                                handleDelete(
                                                    file
                                                )
                                            }
                                        >
                                            Delete
                                        </button>

                                    </div>

                                </div>
                            ))}

                        </div>
                    )}

                </section>

            </main>

        </div>
    );
}