package picpay.people.plataform.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
  @Email (message = "Email inválido")
  @NotBlank (message = "O email não pode ser nulo")
  String email,
  @NotBlank (message = "A senha não pode ser vazia")
  String senha
) {
  
}
