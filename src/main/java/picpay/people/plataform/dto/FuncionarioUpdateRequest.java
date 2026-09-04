package picpay.people.plataform.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import picpay.people.plataform.model.StatusFuncionario;

public record FuncionarioUpdateRequest(
  @NotBlank (message = "O cargo não pode ser nulo")
  String cargo,
  StatusFuncionario status,
  @DecimalMin (value = "0.00", inclusive = true, message = "Salário não pode ser negativo")
  BigDecimal salario
) {
  
}
