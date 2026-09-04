package picpay.people.plataform.exception;


import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.LocalDateTime;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_EMPTY)
public record ApiErro(
  LocalDateTime timestamp,
  int status,
  String erro,
  String mensagem,
  Map<String, String> campos
) {
}