package picpay.people.plataform.exception;

public class CurriculoNaoEncontradoException extends RuntimeException {

public CurriculoNaoEncontradoException(Long funcionarioId) {
  super("Não existe currículo para o funcionário com o ID " + funcionarioId + ".");
  }
}
