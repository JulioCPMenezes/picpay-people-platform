package picpay.people.plataform.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record AtualizarPerfilRequest(

  @NotBlank (message = "O nome não pode ser nulo")
  String nome,
  @Email (message = "Email inválido")
  @NotBlank (message = "O email não pode ser nulo")
  String email,
  @NotBlank (message = "Cargo não pode ser vazio")
  String cargo
) {
  
}
