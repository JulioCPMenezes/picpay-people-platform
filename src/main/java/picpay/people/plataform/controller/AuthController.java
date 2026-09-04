package picpay.people.plataform.controller;

import jakarta.validation.Valid;
import picpay.people.plataform.dto.CadastroUsuarioRequest;
import picpay.people.plataform.dto.LoginRequest;
import picpay.people.plataform.dto.UsuarioResponse;
import picpay.people.plataform.model.UsuarioModel;
import picpay.people.plataform.service.UsuarioService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UsuarioService usuarioService;

    public AuthController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @PostMapping("/cadastro")
    public ResponseEntity<UsuarioResponse> cadastrar(@Valid @RequestBody CadastroUsuarioRequest request) {
        UsuarioModel usuario = usuarioService.cadastrar(request);
        return ResponseEntity.status(201).body(UsuarioResponse.toModel(usuario));
    }

    @PostMapping("/login")
    public ResponseEntity<UsuarioResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(UsuarioResponse.toModel(usuarioService.autenticar(request)));
    }
}