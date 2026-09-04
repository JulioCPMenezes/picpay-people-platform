package picpay.people.plataform.service;

import org.springframework.stereotype.Service;

import picpay.people.plataform.dto.AtualizarPerfilRequest;
import picpay.people.plataform.dto.CadastroUsuarioRequest;
import picpay.people.plataform.dto.LoginRequest;
import picpay.people.plataform.exception.CredenciaisInvalidasException;
import picpay.people.plataform.exception.DadosInvalidosException;
import picpay.people.plataform.exception.RecursoDuplicadoException;
import picpay.people.plataform.exception.UsuarioNaoEncontradoException;
import picpay.people.plataform.model.UsuarioModel;

import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
import java.security.GeneralSecurityException;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Locale;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class UsuarioService {

    private static final int ITERACOES = 120_000;
    private static final int TAMANHO_SALT = 16;
    private static final int TAMANHO_HASH = 256;

    private final ArrayList<UsuarioModel> usuarios = new ArrayList<>();
    private final AtomicLong proximoId = new AtomicLong(1);
    private final SecureRandom secureRandom = new SecureRandom();

    public synchronized UsuarioModel cadastrar(CadastroUsuarioRequest request) {
        String email = normalizarEmail(request.email());
        verificarEmailDisponivel(email, null);
        String cargo = request.cargo() == null || request.cargo().isBlank()
                ? "People Partner"
                : request.cargo().trim();
        UsuarioModel usuario = new UsuarioModel(
                proximoId.getAndIncrement(),
                request.nome().trim(),
                email,
                cargo,
                gerarHash(request.senha())
        );
        usuarios.add(usuario);
        return usuario;
    }

    public synchronized UsuarioModel autenticar(LoginRequest request) {
        String email = normalizarEmail(request.email());
        UsuarioModel usuario = usuarios.stream()
                .filter(item -> item.getEmail().equals(email))
                .findFirst()
                .orElseThrow(CredenciaisInvalidasException::new);
        if (!compararSenha(request.senha(), usuario.getSenha())) {
            throw new CredenciaisInvalidasException();
        }
        return usuario;
    }

    public synchronized UsuarioModel buscarPorId(Long id) {
        return usuarios.stream()
                .filter(usuario -> usuario.getId().equals(id))
                .findFirst()
                .orElseThrow(() -> new UsuarioNaoEncontradoException(id));
    }

    public synchronized UsuarioModel atualizarPerfil(Long id, AtualizarPerfilRequest request) {
        if (request.nome() == null && request.email() == null && request.cargo() == null) {
            throw new DadosInvalidosException("Informe ao menos um campo para atualização.");
        }

        UsuarioModel usuario = buscarPorId(id);
        String email = request.email() == null ? null : normalizarEmail(request.email());
        if (email != null) {
            verificarEmailDisponivel(email, id);
            usuario.setEmail(email);
        }
        if (request.nome() != null) {
            usuario.setNome(request.nome().trim());
        }
        if (request.cargo() != null) {
            usuario.setCargo(request.cargo().trim());
        }
        return usuario;
    }

    private void verificarEmailDisponivel(String email, Long idIgnorado) {
        usuarios.stream()
                .filter(usuario -> idIgnorado == null || !usuario.getId().equals(idIgnorado))
                .filter(usuario -> usuario.getEmail().equals(email))
                .findFirst()
                .ifPresent(usuario -> {
                    throw new RecursoDuplicadoException("Já existe usuário cadastrado com este e-mail.");
                });
    }

    private String gerarHash(String senha) {
        byte[] salt = new byte[TAMANHO_SALT];
        secureRandom.nextBytes(salt);
        byte[] hash = derivarChave(senha.toCharArray(), salt);
        return ITERACOES + ":"
                + Base64.getEncoder().encodeToString(salt) + ":"
                + Base64.getEncoder().encodeToString(hash);
    }

    private boolean compararSenha(String senha, String senhaHash) {
        String[] partes = senhaHash.split(":");
        byte[] salt = Base64.getDecoder().decode(partes[1]);
        byte[] hashEsperado = Base64.getDecoder().decode(partes[2]);
        byte[] hashRecebido = derivarChave(senha.toCharArray(), salt);
        return MessageDigest.isEqual(hashEsperado, hashRecebido);
    }

    private byte[] derivarChave(char[] senha, byte[] salt) {
        PBEKeySpec especificacao = new PBEKeySpec(senha, salt, ITERACOES, TAMANHO_HASH);
        try {
            return SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256")
                    .generateSecret(especificacao)
                    .getEncoded();
        } catch (GeneralSecurityException exception) {
            throw new IllegalStateException("Não foi possível proteger a senha.", exception);
        } finally {
            especificacao.clearPassword();
        }
    }

    private String normalizarEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }
}