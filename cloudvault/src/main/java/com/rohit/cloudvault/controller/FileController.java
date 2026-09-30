package com.rohit.cloudvault.controller;

import com.rohit.cloudvault.dto.FileMetadataResponse;
import com.rohit.cloudvault.model.FileMetadata;
import com.rohit.cloudvault.model.User;
import com.rohit.cloudvault.service.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
public class FileController {

    private final FileService fileService;

    @PostMapping
    public ResponseEntity<FileMetadataResponse> uploadFile(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal User user
    ) throws IOException {

        FileMetadata metadata = fileService.upload(file, user);

        return ResponseEntity.ok(
                FileMetadataResponse.from(metadata)
        );
    }

    @GetMapping
    public ResponseEntity<List<FileMetadataResponse>> getFiles(
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(
                fileService.getUserFiles(user)
                        .stream()
                        .map(FileMetadataResponse::from)
                        .toList()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<FileMetadataResponse> getFile(
            @PathVariable Long id,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(
                FileMetadataResponse.from(
                        fileService.getUserFile(id, user)
                )
        );
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<byte[]> downloadFile(
            @PathVariable Long id,
            @AuthenticationPrincipal User user
    ) {
        FileMetadata metadata = fileService.getUserFile(id, user);
        byte[] fileData = fileService.download(id, user);

        HttpHeaders headers = new HttpHeaders();

        headers.setContentType(
                MediaType.parseMediaType(metadata.getContentType())
        );

        headers.setContentLength(fileData.length);

        headers.setContentDisposition(
                ContentDisposition.attachment()
                        .filename(metadata.getFileName())
                        .build()
        );

        return ResponseEntity.ok()
                .headers(headers)
                .body(fileData);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFile(
            @PathVariable Long id,
            @AuthenticationPrincipal User user
    ) {
        fileService.delete(id, user);

        return ResponseEntity.noContent().build();
    }
}