package picpay.people.plataform.exception;

public class FuncionarioNaoEncontradoException extends RuntimeException {
  public FuncionarioNaoEncontradoException(Long id) {
    super("Não existe funcionário com o ID " + id + ".");
  }
}