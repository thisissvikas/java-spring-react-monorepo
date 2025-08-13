package com.dataproduct.commons.exception;

public class DataProductNotFoundException extends RuntimeException {
    public DataProductNotFoundException(String message) {
        super(message);
    }

    public DataProductNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}