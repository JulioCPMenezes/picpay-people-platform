package picpay.people.plataform.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import picpay.people.plataform.exception.CurriculoNaoEncontradoException;
import picpay.people.plataform.exception.DadosInvalidosException;
import picpay.people.plataform.exception.RecursoDuplicadoException;
import picpay.people.plataform.model.CurriculoModel;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Paths;
import java.util.ArrayList;

@Service
public class CurriculoService {

    private static final long TAMANHO_MAXIMO = 10 * 1024 * 1024;

    private final ArrayList<CurriculoModel> curriculos = new ArrayList<>();
    private final FuncionarioService funcionarioService;

    public CurriculoService(FuncionarioService funcionarioService) {
        this.funcionarioService = funcionarioService;
    }

    public synchronized CurriculoModel criar(Long funcionarioId, MultipartFile arquivo) {
        validarFuncionario(funcionarioId);
        validarArquivo(arquivo);
        if (encontrar(funcionarioId) != null) {
            throw new RecursoDuplicadoException("O funcionário já possui um currículo cadastrado.");
        }
        CurriculoModel curriculo = converter(funcionarioId, arquivo);
        curriculos.add(curriculo);
        return curriculo;
    }

    public synchronized CurriculoModel buscar(Long funcionarioId) {
        validarFuncionario(funcionarioId);
        CurriculoModel curriculo = encontrar(funcionarioId);
        if (curriculo == null) {
            throw new CurriculoNaoEncontradoException(funcionarioId);
        }
        return curriculo;
    }

    public synchronized CurriculoModel substituir(Long funcionarioId, MultipartFile arquivo) {
        validarFuncionario(funcionarioId);
        validarArquivo(arquivo);
        CurriculoModel curriculo = buscar(funcionarioId);
        CurriculoModel novo = converter(funcionarioId, arquivo);
        curriculo.substituir(novo.getNomeArquivo(), novo.getTipoConteudo(), novo.getDados());
        return curriculo;
    }

    public synchronized void excluir(Long funcionarioId) {
        CurriculoModel curriculo = buscar(funcionarioId);
        curriculos.remove(curriculo);
    }

    private CurriculoModel encontrar(Long funcionarioId) {
        return curriculos.stream()
                .filter(curriculo -> curriculo.getFuncionarioId().equals(funcionarioId))
                .findFirst()
                .orElse(null);
    }

    private CurriculoModel converter(Long funcionarioId, MultipartFile arquivo) {
        try {
            String nomeOriginal = arquivo.getOriginalFilename().replace('\\', '/');
            String nomeArquivo = Paths.get(nomeOriginal).getFileName().toString();
            return new CurriculoModel(funcionarioId, nomeArquivo, MediaType.APPLICATION_PDF_VALUE, arquivo.getBytes());
        } catch (IOException | RuntimeException exception) {
            throw new DadosInvalidosException("Não foi possível ler o currículo enviado.");
        }
    }

    private void validarArquivo(MultipartFile arquivo) {
        if (arquivo == null || arquivo.isEmpty()) {
            throw new DadosInvalidosException("O arquivo do currículo é obrigatório.");
        }
        if (arquivo.getSize() > TAMANHO_MAXIMO) {
            throw new DadosInvalidosException("O currículo não pode ultrapassar 10 MB.");
        }
        if (!"application/pdf".equalsIgnoreCase(arquivo.getContentType())) {
            throw new DadosInvalidosException("O currículo deve ser um arquivo PDF.");
        }
        if (arquivo.getOriginalFilename() == null || arquivo.getOriginalFilename().isBlank()) {
            throw new DadosInvalidosException("O nome do currículo é obrigatório.");
        }
        try {
            byte[] dados = arquivo.getBytes();
            String inicio = new String(dados, 0, Math.min(5, dados.length), StandardCharsets.US_ASCII);
            if (!inicio.startsWith("%PDF-")) {
                throw new DadosInvalidosException("O conteúdo enviado não é um PDF válido.");
            }
        } catch (IOException exception) {
            throw new DadosInvalidosException("Não foi possível validar o currículo enviado.");
        }
    }

    private void validarFuncionario(Long funcionarioId) {
        funcionarioService.buscarPorId(funcionarioId);
    }

    private static final class MediaType {
        private static final String APPLICATION_PDF_VALUE = "application/pdf";
    }
}