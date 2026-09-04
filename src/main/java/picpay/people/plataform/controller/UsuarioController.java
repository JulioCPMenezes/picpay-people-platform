package picpay.people.plataform.controller;

import jakarta.validation.Valid;
import picpay.people.plataform.dto.AtualizarPerfilRequest;
import picpay.people.plataform.dto.UsuarioResponse;
import picpay.people.plataform.service.UsuarioService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(UsuarioResponse.toModel(usuarioService.buscarPorId(id)));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<UsuarioResponse> atualizarPerfil(
            @PathVariable Long id,
            @Valid @RequestBody AtualizarPerfilRequest request
    ) {
        return ResponseEntity.ok(UsuarioResponse.toModel(usuarioService.atualizarPerfil(id, request)));
    }
}