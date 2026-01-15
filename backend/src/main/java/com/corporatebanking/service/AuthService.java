package com.corporatebanking.service;

import com.corporatebanking.dto.LoginRequestDto;
import com.corporatebanking.dto.LoginResponseDto;
import com.corporatebanking.dto.RegisterRequestDto;
import com.corporatebanking.model.User;

public interface AuthService {

    LoginResponseDto login(LoginRequestDto loginRequestDto);

    User register(RegisterRequestDto registerRequestDto);
}
