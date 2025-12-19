<<<<<<< HEAD
<<<<<<< HEAD
//package com.brewly.brewly_backend.exception;
//
//import org.springframework.http.*;
//import org.springframework.web.bind.annotation.*;
//
//@RestControllerAdvice
//public class GlobalExceptionHandler {
//
//    @ExceptionHandler(RuntimeException.class)
//    public ResponseEntity<?> handle(RuntimeException ex) {
//        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
//                .body(ex.getMessage());
//    }
//}
=======
//package com.brewly.brewly_backend.exception;
//
//import org.springframework.http.*;
//import org.springframework.web.bind.annotation.*;
//
//@RestControllerAdvice
//public class GlobalExceptionHandler {
//
//    @ExceptionHandler(RuntimeException.class)
//    public ResponseEntity<?> handle(RuntimeException ex) {
//        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
//                .body(ex.getMessage());
//    }
//}
>>>>>>> 564c4ca (Initial commit: frontend and backend setup)
=======
package com.brewly.brewly_backend.exception;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<?> handle(RuntimeException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ex.getMessage());
    }
}
>>>>>>> e55e188 (Add frontend and backend project structure)
