package picpay.people.plataform.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor 
@AllArgsConstructor 
@Getter 
@Setter 
public class FuncionarioModel {
  private Long id;
  private String nome;
  private String cpf;
  private String email;
  private String telefone;
  private String cargo;
  private String departamento;
  private BigDecimal salario;
  private String cidade;
  private StatusFuncionario status;
  private LocalDateTime dataCadastro;
  private LocalDateTime dataAtualizado;
  
}
