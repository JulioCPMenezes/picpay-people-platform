package picpay.people.plataform.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.multipart.support.MissingServletRequestPartException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(DadosInvalidosException.class)
    public ResponseEntity<ApiErro> tratarDadosInvalidos(DadosInvalidosException exception) {
        return resposta(HttpStatus.BAD_REQUEST, "Dados inválidos", exception.getMessage());
    }

    @ExceptionHandler(CredenciaisInvalidasException.class)
    public ResponseEntity<ApiErro> tratarCredenciaisInvalidas(CredenciaisInvalidasException exception) {
        return resposta(HttpStatus.UNAUTHORIZED, "Não autorizado", exception.getMessage());
    }

    @ExceptionHandler(UsuarioNaoEncontradoException.class)
    public ResponseEntity<ApiErro> tratarUsuarioNaoEncontrado(UsuarioNaoEncontradoException exception) {
        return resposta(HttpStatus.NOT_FOUND, "Usuário não encontrado", exception.getMessage());
    }

    @ExceptionHandler(CurriculoNaoEncontradoException.class)
    public ResponseEntity<ApiErro> tratarCurriculoNaoEncontrado(CurriculoNaoEncontradoException exception) {
        return resposta(HttpStatus.NOT_FOUND, "Currículo não encontrado", exception.getMessage());
    }

    @ExceptionHandler(FuncionarioNaoEncontradoException.class)
    public ResponseEntity<ApiErro> tratarFuncionarioNaoEncontrado(FuncionarioNaoEncontradoException exception) {
        return resposta(HttpStatus.NOT_FOUND, "Funcionário não encontrado", exception.getMessage());
    }

    @ExceptionHandler(RecursoDuplicadoException.class)
    public ResponseEntity<ApiErro> tratarRecursoDuplicado(RecursoDuplicadoException exception) {
        return resposta(HttpStatus.CONFLICT, "Recurso duplicado", exception.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErro> tratarCamposInvalidos(MethodArgumentNotValidException exception) {
        Map<String, String> campos = new LinkedHashMap<>();
        for (FieldError erro : exception.getBindingResult().getFieldErrors()) {
            campos.putIfAbsent(erro.getField(), erro.getDefaultMessage());
        }

        ApiErro apiErro = new ApiErro(
                LocalDateTime.now(),
                HttpStatus.BAD_REQUEST.value(),
                "Dados inválidos",
                "Um ou mais campos são inválidos.",
                campos
        );
        return ResponseEntity.badRequest().body(apiErro);
    }

    @ExceptionHandler({
            HttpMessageNotReadableException.class,
            MissingServletRequestPartException.class,
            MissingServletRequestParameterException.class,
            MethodArgumentTypeMismatchException.class
    })
    public ResponseEntity<ApiErro> tratarRequisicaoInvalida(Exception exception) {
        return resposta(HttpStatus.BAD_REQUEST, "Requisição inválida", "O corpo da requisição é inválido.");
    }

    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<ApiErro> tratarRecursoNaoEncontrado(NoResourceFoundException exception) {
      return resposta(
            HttpStatus.NOT_FOUND,
            "Recurso não encontrado",
            "O recurso solicitado não foi encontrado."
    );
}

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErro> tratarErroInterno(Exception exception) {
        return resposta(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Erro interno",
                "Ocorreu um erro interno ao processar a requisição."
        );
    }

    private ResponseEntity<ApiErro> resposta(HttpStatus status, String erro, String mensagem) {
        ApiErro apiErro = new ApiErro(LocalDateTime.now(), status.value(), erro, mensagem, Map.of());
        return ResponseEntity.status(status).body(apiErro);
    }
}