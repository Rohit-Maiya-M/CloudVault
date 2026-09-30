package com.rohit.cloudvault.service;

import com.rohit.cloudvault.model.FileMetadata;
import com.rohit.cloudvault.model.User;
import com.rohit.cloudvault.repository.FileMetadataRepository;
import com.rohit.cloudvault.storage.S3StorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FileService {

    private final FileMetadataRepository fileMetadataRepository;
    private final S3StorageService s3StorageService;

    public FileMetadata upload(MultipartFile file, User owner) throws IOException {

        String s3Key = s3StorageService.upload(file);

        FileMetadata metadata = FileMetadata.builder()
                .fileName(file.getOriginalFilename())
                .s3Key(s3Key)
                .fileSize(file.getSize())
                .contentType(file.getContentType())
                .storageProvider("S3")
                .owner(owner)
                .build();

        try {
            return fileMetadataRepository.save(metadata);
        } catch (Exception e) {
            s3StorageService.delete(s3Key);
            throw e;
        }
    }

    public List<FileMetadata> getUserFiles(User owner) {
        return fileMetadataRepository.findByOwner(owner);
    }

    public FileMetadata getUserFile(Long fileId, User owner) {
        return fileMetadataRepository.findByIdAndOwner(fileId, owner)
                .orElseThrow(() -> new RuntimeException("File not found"));
    }

    public byte[] download(Long fileId, User owner) {

        FileMetadata metadata = getUserFile(fileId, owner);

        return s3StorageService.download(metadata.getS3Key());
    }

    public void delete(Long fileId, User owner) {

        FileMetadata metadata = getUserFile(fileId, owner);

        s3StorageService.delete(metadata.getS3Key());

        fileMetadataRepository.delete(metadata);
    }
}