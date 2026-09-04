package picpay.people.plataform.dto;

import picpay.people.plataform.model.UsuarioModel;

public record UsuarioResponse(
 Long id,
 String nome,
 String email,
 String cargo
) {
  public static UsuarioResponse toModel(UsuarioModel usuarioModel){
    return new UsuarioResponse(usuarioModel.getId(),usuarioModel.getNome(),usuarioModel.getEmail(),usuarioModel.getCargo());
  }
}
