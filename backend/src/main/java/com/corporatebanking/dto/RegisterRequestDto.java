package com.corporatebanking.dto;

import com.corporatebanking.model.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequestDto {
    @NotBlank
    private String username;
    @Email
    private String email;
    @NotBlank
    @Size(min = 4, max = 20)
    private String password;
    @NotNull
    private Role role;
}
