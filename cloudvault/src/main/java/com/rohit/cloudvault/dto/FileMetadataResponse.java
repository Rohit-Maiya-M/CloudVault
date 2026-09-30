package com.rohit.cloudvault.dto;

import com.rohit.cloudvault.model.FileMetadata;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class FileMetadataResponse {

    private Long id;
    private String fileName;
    private String s3Key;
    private Long fileSize;
    private String contentType;
    private String etag;
    private LocalDateTime uploadedAt;
    private LocalDateTime updatedAt;
    private String storageProvider;
    private UserResponse owner;

    public static FileMetadataResponse from(FileMetadata file) {
        return FileMetadataResponse.builder()
                .id(file.getId())
                .fileName(file.getFileName())
                .s3Key(file.getS3Key())
                .fileSize(file.getFileSize())
                .contentType(file.getContentType())
                .etag(file.getEtag())
                .uploadedAt(file.getUploadedAt())
                .updatedAt(file.getUpdatedAt())
                .storageProvider(file.getStorageProvider())
                .owner(UserResponse.from(file.getOwner()))
                .build();
    }
}