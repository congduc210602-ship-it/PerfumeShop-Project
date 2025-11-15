package SpringJPA.demo.exception;

import SpringJPA.demo.dto.ErrorResponse; // Import DTO mới
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest; // Dùng WebRequest để lấy path

import java.time.LocalDateTime;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // Bắt lỗi ResourceNotFoundException (404)
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFoundException(
            ResourceNotFoundException ex, WebRequest request) {
        
        ErrorResponse errorResponse = new ErrorResponse(
                LocalDateTime.now(), // timestamp
                HttpStatus.NOT_FOUND.value(), // status (404)
                HttpStatus.NOT_FOUND.getReasonPhrase(), // error ("Not Found")
                ex.getMessage(), // message (VD: "Product not found...")
                request.getDescription(false).replace("uri=", "") // path
        );
        
        return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
    }

    // Bắt tất cả các lỗi khác (500)
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGlobalException(
            Exception ex, WebRequest request) {
        
        ErrorResponse errorResponse = new ErrorResponse(
                LocalDateTime.now(),
                HttpStatus.INTERNAL_SERVER_ERROR.value(), // 500
                HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase(), // "Internal Server Error"
                "Đã có lỗi xảy ra ở máy chủ: " + ex.getMessage(),
                request.getDescription(false).replace("uri=", "")
        );
        
        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}


// package SpringJPA.demo.exception;

// import java.util.HashMap;
// import java.util.Map;

// import org.springframework.http.HttpStatus;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.ExceptionHandler;
// import org.springframework.web.bind.annotation.RestControllerAdvice;

// @RestControllerAdvice
// public class GlobalExceptionHandler {

//    @ExceptionHandler(ResourceNotFoundException.class)
//    public ResponseEntity<Map<String, String>> handleNotFound(ResourceNotFoundException ex) {
//        Map<String, String> body = new HashMap<>();
//        body.put("error", ex.getMessage());
//        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(body);
//    }

//    @ExceptionHandler(Exception.class)
//    public ResponseEntity<Map<String, String>> handleAll(Exception ex) {
//        Map<String, String> body = new HashMap<>();
//        body.put("error", ex.getMessage());
//        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
//    }
// }
