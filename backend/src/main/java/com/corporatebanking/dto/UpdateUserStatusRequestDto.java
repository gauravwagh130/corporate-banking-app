package com.corporatebanking.dto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class UpdateUserStatusRequestDto {
    private boolean active;
}
