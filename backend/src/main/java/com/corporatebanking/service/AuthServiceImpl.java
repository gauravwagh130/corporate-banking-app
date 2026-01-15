package com.corporatebanking.service;

import com.corporatebanking.dto.LoginRequestDto;
import com.corporatebanking.dto.LoginResponseDto;
import com.corporatebanking.dto.RegisterRequestDto;
import com.corporatebanking.exception.AlreadyExistsException;
import com.corporatebanking.model.User;
import com.corporatebanking.repository.UserRepository;
import com.corporatebanking.security.AuthUtil;
import com.corporatebanking.security.CustomeUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final AuthUtil authUtil;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;

    public LoginResponseDto login(LoginRequestDto loginRequestDto) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequestDto.getEmail(),
                        loginRequestDto.getPassword()
                )
        );

        CustomeUserDetails userDetails = (CustomeUserDetails) authentication.getPrincipal();
        User user = userDetails.getUser();

        String jwtToken = authUtil.generateAccessToken(user.getEmail(), user.getUsername(), user.getRole().name());

        return new LoginResponseDto(jwtToken, user.getRole().name());
    }


    public User register(RegisterRequestDto registerRequestDto) {
        if (userRepository.existsByEmail(registerRequestDto.getEmail())) {
            throw new AlreadyExistsException(
                    "Email already exists"
            );
        }
        User user = new User();
        user.setUsername(registerRequestDto.getUsername());
        user.setPassword(passwordEncoder.encode(registerRequestDto.getPassword()));
        user.setEmail(registerRequestDto.getEmail());
        user.setRole(registerRequestDto.getRole());
        user.setActive(true);
        userRepository.save(user);
        return user;
    }
}
