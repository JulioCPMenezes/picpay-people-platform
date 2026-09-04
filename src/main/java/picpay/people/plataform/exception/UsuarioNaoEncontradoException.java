package picpay.people.plataform.exception;

public class UsuarioNaoEncontradoException extends RuntimeException {

  public UsuarioNaoEncontradoException(Long id) {
    super("Não existe usuário com o ID " + id + ".");
  }
}