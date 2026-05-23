package com.trip_app_backend.services;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;

@Service
public class FileService {

    public final Path BASE_PATH;
    // public final Path TMP_PATH;

    public FileService(Environment env) {
        BASE_PATH = Paths.get(env.getProperty("tripapp.filepath"));
        // TMP_PATH = BASE_PATH.resolve(Paths.get("tmp"));
    }

    public Path generateUniqueFileName(String prefix, String extension) {
        Path path;
        do {
            path = BASE_PATH.resolve(Paths.get(prefix + "-" + UUID.randomUUID() + "." + extension));
        } while (Files.exists(path));
        return path.getFileName();
    }

    public Path getFilePath(String fileName) {
        return BASE_PATH.resolve(fileName);
    }

    public Path getFilePath(Path fileName) {
        return BASE_PATH.resolve(fileName);
    }

    // public Path getTempFilePath(String fileName) {
    //     return TMP_PATH.resolve(fileName);
    // }
}
