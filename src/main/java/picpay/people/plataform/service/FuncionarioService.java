package picpay.people.plataform.service;

import org.springframework.stereotype.Service;

import picpay.people.plataform.dto.FuncionarioRequest;
import picpay.people.plataform.dto.FuncionarioUpdateRequest;
import picpay.people.plataform.exception.DadosInvalidosException;
import picpay.people.plataform.exception.FuncionarioNaoEncontradoException;
import picpay.people.plataform.exception.RecursoDuplicadoException;
import picpay.people.plataform.model.FuncionarioModel;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class FuncionarioService {

    private final ArrayList<FuncionarioModel> funcionarios = new ArrayList<>();
    private final AtomicLong proximoId = new AtomicLong(1);

    public synchronized List<FuncionarioModel> listar() {
        return List.copyOf(funcionarios);
    }

    public synchronized FuncionarioModel buscarPorId(Long id) {
        return funcionarios.stream()
                .filter(funcionario -> funcionario.getId().equals(id))
                .findFirst()
                .orElseThrow(() -> new FuncionarioNaoEncontradoException(id));
    }

    public synchronized FuncionarioModel criar(FuncionarioRequest request) {
        String cpf = normalizarCpf(request.cpf());
        String email = normalizarEmail(request.email());
        validarCpf(cpf);
        verificarDuplicidade(cpf, email, null);

        LocalDateTime agora = LocalDateTime.now();
        FuncionarioModel funcionario = new FuncionarioModel(
                proximoId.getAndIncrement(),
                texto(request.nome()),
                cpf,
                email,
                texto(request.telefone()),
                texto(request.cargo()),
                texto(request.departamento()),
                request.salario(),
                texto(request.cidade()),
                request.status(),
                agora,
                agora
        );
        funcionarios.add(funcionario);
        return funcionario;
    }

    public synchronized FuncionarioModel atualizarCompleto(Long id, FuncionarioRequest request) {
        FuncionarioModel funcionario = buscarPorId(id);
        String cpf = normalizarCpf(request.cpf());
        String email = normalizarEmail(request.email());
        validarCpf(cpf);
        verificarDuplicidade(cpf, email, id);

        funcionario.setNome(texto(request.nome()));
        funcionario.setCpf(cpf);
        funcionario.setEmail(email);
        funcionario.setTelefone(texto(request.telefone()));
        funcionario.setCidade(texto(request.cidade()));
        funcionario.setCargo(texto(request.cargo()));
        funcionario.setDepartamento(texto(request.departamento()));
        funcionario.setSalario(request.salario());
        funcionario.setStatus(request.status());
        funcionario.setDataAtualizado(LocalDateTime.now());
        return funcionario;
    }

    public synchronized FuncionarioModel atualizarParcial(Long id, FuncionarioUpdateRequest request) {
        if (request.cargo() == null && request.status() == null && request.salario() == null) {
            throw new DadosInvalidosException("Informe ao menos um campo para atualização.");
        }
        if (request.cargo() != null && request.cargo().isBlank()) {
            throw new DadosInvalidosException("Cargo não pode ser vazio.");
        }
        if (request.salario() != null && request.salario().compareTo(BigDecimal.ZERO) < 0) {
            throw new DadosInvalidosException("Salário não pode ser negativo.");
        }

        FuncionarioModel funcionario = buscarPorId(id);
        if (request.cargo() != null) {
            funcionario.setCargo(texto(request.cargo()));
        }
        if (request.status() != null) {
            funcionario.setStatus(request.status());
        }
        if (request.salario() != null) {
            funcionario.setSalario(request.salario());
        }
        funcionario.setDataAtualizado(LocalDateTime.now());
        return funcionario;
    }

    public synchronized void excluir(Long id) {
        FuncionarioModel funcionario = buscarPorId(id);
        funcionarios.remove(funcionario);
    }

    private void verificarDuplicidade(String cpf, String email, Long idIgnorado) {
        funcionarios.stream()
                .filter(funcionario -> idIgnorado == null || !funcionario.getId().equals(idIgnorado))
                .filter(funcionario -> funcionario.getCpf().equals(cpf))
                .findFirst()
                .ifPresent(funcionario -> {
                    throw new RecursoDuplicadoException("Já existe funcionário cadastrado com este CPF.");
                });

        funcionarios.stream()
                .filter(funcionario -> idIgnorado == null || !funcionario.getId().equals(idIgnorado))
                .filter(funcionario -> funcionario.getEmail().equals(email))
                .findFirst()
                .ifPresent(funcionario -> {
                    throw new RecursoDuplicadoException("Já existe funcionário cadastrado com este e-mail.");
                });
    }

    private String normalizarCpf(String cpf) {
        return cpf == null ? null : cpf.replaceAll("\\D", "");
    }

    private String normalizarEmail(String email) {
        return email == null ? null : email.trim().toLowerCase();
    }

    private String texto(String valor) {
        return valor == null ? null : valor.trim();
    }

    private void validarCpf(String cpf) {
        if (cpf == null || !cpf.matches("\\d{11}") || cpf.chars().distinct().count() == 1) {
            throw new DadosInvalidosException("CPF inválido.");
        }

        int primeiroDigito = calcularDigito(cpf, 9);
        int segundoDigito = calcularDigito(cpf, 10);
        if (primeiroDigito != Character.digit(cpf.charAt(9), 10)
                || segundoDigito != Character.digit(cpf.charAt(10), 10)) {
            throw new DadosInvalidosException("CPF inválido.");
        }
    }

    private int calcularDigito(String cpf, int posicao) {
        int soma = 0;
        for (int indice = 0; indice < posicao; indice++) {
            soma += Character.digit(cpf.charAt(indice), 10) * (posicao + 1 - indice);
        }
        int resto = soma % 11;
        return resto < 2 ? 0 : 11 - resto;
    }
}