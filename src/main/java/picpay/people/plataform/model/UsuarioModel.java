package picpay.people.plataform.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor 
@NoArgsConstructor 
@Getter 
@Setter 
public class UsuarioModel {
  private Long id;
  private String nome;
  private String email;
  private String cargo;
  @JsonIgnore 
  private String senha;
}
