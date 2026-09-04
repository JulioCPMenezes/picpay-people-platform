package picpay.people.plataform.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
 
@AllArgsConstructor 
@NoArgsConstructor 
@Getter 
@Setter 
public class CurriculoModel {
  private Long funcionarioId;
  private String nomeArquivo;
  private String tipoConteudo;
  private byte[] dados;

  public void substituir(String nomeArquivo, String tipoConteudo, byte[] dados){
    this.nomeArquivo = nomeArquivo;
    this.tipoConteudo = tipoConteudo;
    this.dados = dados;
  }
}
