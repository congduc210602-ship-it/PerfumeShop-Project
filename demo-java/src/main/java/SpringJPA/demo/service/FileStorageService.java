package SpringJPA.demo.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
// ----- THÊM IMPORT NÀY -----
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
// --------------------------

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {

    // Đường dẫn đến thư mục 'uploads'
    // Đảm bảo thư mục 'uploads' tồn tại ở thư mục gốc dự án
    private final Path storageFolder = Paths.get("uploads").toAbsolutePath().normalize();

    public FileStorageService() {
        try {
            // Tạo thư mục 'uploads' nếu nó không tồn tại
            Files.createDirectories(storageFolder);
        } catch (IOException e) {
            throw new RuntimeException("Cannot initialize storage folder: uploads", e);
        }
    }

    // Hàm kiểm tra có phải file ảnh không (Giữ nguyên)
    private boolean isImageFile(MultipartFile file) {
        String contentType = file.getContentType();
        return contentType != null && contentType.startsWith("image/");
    }

    // Hàm lưu file (Giữ nguyên logic của bạn, chỉ sửa import Guava)
    public String storeFile(MultipartFile file) {
        try {
            if (file.isEmpty()) {
                throw new RuntimeException("Failed to store empty file.");
            }

            // Chỉ chấp nhận file ảnh
            if (!isImageFile(file)) {
                throw new RuntimeException("You can only upload image files.");
            }

            // Tạo tên file duy nhất (để tránh trùng lặp)
            // Lấy phần mở rộng file (đuôi file) một cách an toàn
            String originalFilename = file.getOriginalFilename();
            String fileExtension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                 fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            // Loại bỏ dấu chấm nếu có trong tên file UUID
            String uniqueFileNameBase = UUID.randomUUID().toString().replace("-", "");
            String uniqueFileName = uniqueFileNameBase + fileExtension;


            // Đường dẫn đầy đủ đến file (Đảm bảo đường dẫn tuyệt đối)
            Path destinationFile = this.storageFolder.resolve(uniqueFileName).normalize();

            // Kiểm tra xem destinationFile có nằm ngoài thư mục storageFolder không (Security check)
             if (!destinationFile.getParent().equals(this.storageFolder)) {
                 throw new RuntimeException("Cannot store file outside current directory.");
             }

            // Sao chép file vào thư mục đích
            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, destinationFile, StandardCopyOption.REPLACE_EXISTING);
            }

            // Trả về *tên* file đã lưu
            return uniqueFileName;

        } catch (IOException e) {
            throw new RuntimeException("Failed to store file.", e);
        }
    }

    // ----- HÀM QUAN TRỌNG BỊ THIẾU ĐÃ ĐƯỢC THÊM LẠI -----
    public String getFileUrl(String fileName) {
        // Tạo URL đầy đủ để truy cập file từ bên ngoài
        // Ví dụ: http://localhost:8080/uploads/ten_file_anh.jpg
        return ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/uploads/") // Đường dẫn này phải khớp với WebConfig và SecurityConfig
                .path(fileName)
                .toUriString();
    }
    // --------------------------------------------------
}

