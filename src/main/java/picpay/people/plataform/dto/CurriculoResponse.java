package picpay.people.plataform.dto;

import picpay.people.plataform.model.CurriculoModel;

public record CurriculoResponse(
  Long funcionarioId,
  String nomeArquivo,
  String tipoConteudo,
  long tamanho
) {
  public static CurriculoResponse toModel (CurriculoModel curriculo){
    return new CurriculoResponse(
      curriculo.getFuncionarioId(),
      curriculo.getNomeArquivo(),
      curriculo.getTipoConteudo(),
      curriculo.getDados().length
    );
  }
  
}
