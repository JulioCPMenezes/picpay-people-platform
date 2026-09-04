package picpay.people.plataform.controller;

import jakarta.validation.Valid;
import picpay.people.plataform.dto.FuncionarioRequest;
import picpay.people.plataform.dto.FuncionarioUpdateRequest;
import picpay.people.plataform.model.FuncionarioModel;
import picpay.people.plataform.service.FuncionarioService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/funcionarios")
public class FuncionarioController {

    private final FuncionarioService funcionarioService;

    public FuncionarioController(FuncionarioService funcionarioService) {
        this.funcionarioService = funcionarioService;
    }

    @GetMapping
    public ResponseEntity<List<FuncionarioModel>> listar() {
        return ResponseEntity.ok(funcionarioService.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FuncionarioModel> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(funcionarioService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<FuncionarioModel> criar(@Valid @RequestBody FuncionarioRequest request) {
        FuncionarioModel funcionario = funcionarioService.criar(request);
        URI localizacao = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(funcionario.getId())
                .toUri();
        return ResponseEntity.created(localizacao).body(funcionario);
    }

    @PutMapping("/{id}")
    public ResponseEntity<FuncionarioModel> atualizarCompleto(
            @PathVariable Long id,
            @Valid @RequestBody FuncionarioRequest request
    ) {
        return ResponseEntity.ok(funcionarioService.atualizarCompleto(id, request));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<FuncionarioModel> atualizarParcial(
            @PathVariable Long id,
            @Valid @RequestBody FuncionarioUpdateRequest request
    ) {
        return ResponseEntity.ok(funcionarioService.atualizarParcial(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        funcionarioService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}