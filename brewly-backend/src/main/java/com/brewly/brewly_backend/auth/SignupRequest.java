package com.brewly.brewly_backend.auth;

import lombok.Data;

@Data
public class SignupRequest {

    private String name;
    private String email;
    private String password;
}
