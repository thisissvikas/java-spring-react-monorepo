package com.dataproduct.commons.exception;

public class DataProductAlreadyExistsException extends RuntimeException {
    public DataProductAlreadyExistsException(String message) {
        super(message);
    }

    public DataProductAlreadyExistsException(String message, Throwable cause) {
        super(message, cause);
    }
}