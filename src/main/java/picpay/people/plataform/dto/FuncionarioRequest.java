package picpay.people.plataform.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import picpay.people.plataform.model.StatusFuncionario;

import java.math.BigDecimal;

public record FuncionarioRequest(
        @NotBlank(message = "Nome é obrigatório")
        String nome,

        @NotBlank(message = "CPF é obrigatório")
        @Pattern(
                regexp = "\\d{11}|\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}",
                message = "CPF deve conter 11 dígitos"
        )
        String cpf,

        @NotBlank(message = "E-mail é obrigatório")
        @Email(message = "E-mail inválido")
        String email,

        @NotBlank(message = "Telefone é obrigatório")
        String telefone,

        @NotBlank(message = "Cidade é obrigatória")
        String cidade,

        @NotBlank(message = "Cargo é obrigatório")
        String cargo,

        @NotBlank(message = "Departamento é obrigatório")
        String departamento,

        @NotNull(message = "Salário é obrigatório")
        @DecimalMin(value = "0.00", inclusive = true, message = "Salário não pode ser negativo")
        BigDecimal salario,

        @NotNull(message = "Status é obrigatório")
        StatusFuncionario status
) {
}