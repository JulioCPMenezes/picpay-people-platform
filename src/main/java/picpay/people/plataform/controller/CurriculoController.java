package picpay.people.plataform.controller;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import picpay.people.plataform.dto.CurriculoResponse;
import picpay.people.plataform.model.CurriculoModel;
import picpay.people.plataform.service.CurriculoService;

import java.net.URI;

@RestController
@RequestMapping("/funcionarios/{funcionarioId}/curriculo")
public class CurriculoController {

    private final CurriculoService curriculoService;

    public CurriculoController(CurriculoService curriculoService) {
        this.curriculoService = curriculoService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CurriculoResponse> criar(
            @PathVariable Long funcionarioId,
            @RequestPart("arquivo") MultipartFile arquivo
    ) {
        CurriculoModel curriculo = curriculoService.criar(funcionarioId, arquivo);
        URI localizacao = URI.create("/funcionarios/" + funcionarioId + "/curriculo");
        return ResponseEntity.created(localizacao).body(CurriculoResponse.toModel(curriculo));
    }

    @GetMapping
    public ResponseEntity<ByteArrayResource> abrir(@PathVariable Long funcionarioId) {
        CurriculoModel curriculo = curriculoService.buscar(funcionarioId);
        ByteArrayResource recurso = new ByteArrayResource(curriculo.getDados());
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(curriculo.getTipoConteudo()))
                .contentLength(curriculo.getDados().length)
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + curriculo.getNomeArquivo() + "\"")
                .body(recurso);
    }

    @PutMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CurriculoResponse> substituir(
            @PathVariable Long funcionarioId,
            @RequestPart("arquivo") MultipartFile arquivo
    ) {
        return ResponseEntity.ok(CurriculoResponse.toModel(curriculoService.substituir(funcionarioId, arquivo)));
    }

    @DeleteMapping
    public ResponseEntity<Void> excluir(@PathVariable Long funcionarioId) {
        curriculoService.excluir(funcionarioId);
        return ResponseEntity.noContent().build();
    }
}