package com.trip_app_backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequestDto {
    @Email
    @NotBlank
    private String email;
    @NotBlank
    @Size(min = 8, max = 100)
    private String password;
    @NotBlank
    @Size(min = 1, max = 100)
    private String displayName;
}
