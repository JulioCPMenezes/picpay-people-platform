package picpay.people.plataform.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CadastroUsuarioRequest(
  @NotBlank (message = "O nome não pode ser nulo")
  String nome,
  @Email (message = "Email inválido")
  @NotBlank (message = "O email não pode ser nulo")
  String email,
  @NotBlank (message = "Cargo não pode ser vazio")
  String cargo,
  @NotBlank (message = "A senha não pode ser vazia")
  @Size(min = 6, message = "A senha precisa ter no mínimo 6 caracteres")
  String senha) {
 
}
