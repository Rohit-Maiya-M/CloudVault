package com.rohit.cloudvault.repository;

import com.rohit.cloudvault.model.FileMetadata;
import com.rohit.cloudvault.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FileMetadataRepository extends JpaRepository<FileMetadata, Long> {

    List<FileMetadata> findByOwner(User owner);

    Optional<FileMetadata> findByIdAndOwner(Long id, User owner);

    Optional<FileMetadata> findByS3Key(String s3Key);

    boolean existsByS3Key(String s3Key);
}