// FUNÇÕES PRINCIPAIS E LÓGICA DE NAVEGAÇÃO
// Este script centraliza toda a funcionalidade JS do projeto ONG Conecta.

// --- 1. LÓGICA DE NAVEGAÇÃO E ACESSIBILIDADE ---

/**
 * Alterna a visibilidade do menu de navegação em dispositivos móveis (Menu Hambúrguer).
 */
function toggleMenu() {
    const nav = document.getElementById('main-nav');
    const iconMenu = document.getElementById('icon-menu');
    const iconClose = document.getElementById('icon-close');
    const isMenuOpen = nav.classList.toggle('menu-open');
    
    // Alterna os ícones do botão
    iconMenu.classList.toggle('hidden', isMenuOpen);
    iconClose.classList.toggle('hidden', !isMenuOpen);
    
    // Atualiza o atributo ARIA para leitores de tela
    document.querySelector('.hamburger-button').setAttribute('aria-expanded', isMenuOpen);

    // Lógica para alternar a posição do menu lateral (definida no CSS)
    if (isMenuOpen) {
        nav.style.right = '0';
    } else {
        nav.style.right = '-100%';
    }
}

/**
 * Alterna o tema (Modo Escuro / Alto Contraste) no <body> e salva a preferência.
 * Requisito WCAG 2.1 AA (Acessibilidade)
 */
function toggleTheme() {
    const body = document.body;
    const isDarkMode = body.classList.toggle('dark-mode');
    
    // Salva a preferência no armazenamento local
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
}

/**
 * Carrega o tema preferido do usuário ao iniciar a aplicação.
 */
function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }
}


// --- 2. LÓGICA DO FORMULÁRIO (VALIDAÇÃO DE CONSISTÊNCIA) ---

/**
 * Verifica se o usuário tem pelo menos 16 anos (regra de consistência).
 */
function validarIdade(dataNascimento) {
    if (!dataNascimento) return false;
    
    const hoje = new Date();
    const dataNasc = new Date(dataNascimento);
    
    let idade = hoje.getFullYear() - dataNasc.getFullYear();
    const mes = hoje.getMonth() - dataNasc.getMonth();
    const dia = hoje.getDate() - dataNasc.getDate();

    if (mes < 0 || (mes === 0 && dia < 0)) {
        idade--;
    }
    
    // Requisito: Idade mínima de 16 anos para voluntariado/apoio
    return idade >= 16; 
}

/**
 * Função principal de validação de consistência (chamada no onsubmit do cadastro.html).
 */
function validarConsistencia(event) {
    let isValid = true;
    
    // 1. Limpa mensagens de erro e classes inválidas
    document.querySelectorAll('.validation-message').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));

    // 2. Validação de Idade (Data de Nascimento)
    const dataNascInput = document.getElementById('data_nasc');
    if (dataNascInput && dataNascInput.value && !validarIdade(dataNascInput.value)) {
        dataNascInput.classList.add('is-invalid');
        document.getElementById('error-data_nasc').classList.remove('hidden');
        isValid = false;
    }

    // 3. Validação de Formato de Estado (2 letras MAIÚSCULAS)
    const estadoInput = document.getElementById('estado');
    // Verifica a validade via checkValidity (padrão HTML5)
    if (estadoInput && estadoInput.value && !estadoInput.checkValidity()) {
         estadoInput.classList.add('is-invalid');
         document.getElementById('error-estado').classList.remove('hidden');
         isValid = false;
    }
    
    // 4. Se a validação de consistência falhar, impede o envio e rola para o erro
    if (!isValid) {
        event.preventDefault();
        // Rola para o primeiro erro visível
        document.querySelector('.is-invalid').scrollIntoView({ behavior: 'smooth', block: 'center' });
        return false;
    }
    
    // Se tudo passar, simula o envio
    event.preventDefault();
    alert('Formulário de Cadastro Enviado com Sucesso! (Simulação da Entrega III)');
    return true;
}


// --- 3. LÓGICA DA CALCULADORA DE IMPACTO (INDEX.HTML) ---

/**
 * Calcula e exibe o impacto da doação (chamada no index.html).
 */
function calcularImpacto() {
    const valorInput = document.getElementById('doacao-valor');
    const resultadoElement = document.getElementById('resultado-impacto');
    
    if (!valorInput || !resultadoElement) return; // Garante que só roda no index.html

    const valor = parseFloat(valorInput.value);

    if (isNaN(valor) || valor <= 0) {
        resultadoElement.textContent = 'Por favor, insira um valor válido.';
        return;
    }

    // Regras de Impacto Fictícias (Métrica da ONG)
    const custo_mentoria_hora = 2.5; 
    const custo_kit_basico = 50.0;

    let impactoTexto = "";

    if (valor < 50) {
        const horas = Math.floor(valor / custo_mentoria_hora);
        impactoTexto = `Sua doação de R$ ${valor.toFixed(2)} pode financiar **${horas} horas de mentoria** para um iniciante digital.`;
    } else if (valor >= 50 && valor < 200) {
        const kits = Math.floor(valor / custo_kit_basico);
        const horas = Math.floor((valor % custo_kit_basico) / custo_mentoria_hora);
        impactoTexto = `Sua doação de R$ ${valor.toFixed(2)} garante **${kits} kits básicos** e **${horas} horas de mentoria**.`;
    } else {
        impactoTexto = `Sua doação de R$ ${valor.toFixed(2)} gera um **impacto profundo**, garantindo capacitação completa para **várias famílias** por um mês.`;
    }

    resultadoElement.innerHTML = impactoTexto.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
}


// --- 4. FUNÇÕES DE MÁSCARA (UX) ---

function aplicarMascaraCPF(e) {
    var value = e.target.value.replace(/\D/g, ''); 
    if (value.length > 3) value = value.substring(0, 3) + '.' + value.substring(3);
    if (value.length > 7) value = value.substring(0, 7) + '.' + value.substring(7);
    if (value.length > 11) value = value.substring(0, 11) + '-' + value.substring(11);
    e.target.value = value.substring(0, 14);
}

function aplicarMascaraTelefone(e) {
    var value = e.target.value.replace(/\D/g, '');
    if (value.length > 0) value = '(' + value;
    if (value.length > 3) value = value.substring(0, 3) + ') ' + value.substring(3);
    if (value.length > 9) value = value.substring(0, 9) + '-' + value.substring(9, 14);
    e.target.value = value;
}

function aplicarMascaraCEP(e) {
    var value = e.target.value.replace(/\D/g, '');
    if (value.length > 5) value = value.substring(0, 5) + '-' + value.substring(5, 8);
    e.target.value = value.substring(0, 9);
}


// --- 5. INICIALIZAÇÃO DE EVENTOS ---

document.addEventListener('DOMContentLoaded', function() {
    loadTheme(); // Carrega o tema do localStorage

    // Inicializa a calculadora (se estiver no index.html)
    if (document.getElementById('doacao-valor')) {
        calcularImpacto();
        document.getElementById('doacao-valor').addEventListener('input', calcularImpacto);
    }
    
    // Aplica as máscaras (se estiver no cadastro.html)
    if (document.getElementById('cpf')) {
        document.getElementById('cpf').addEventListener('input', aplicarMascaraCPF);
        document.getElementById('telefone').addEventListener('input', aplicarMascaraTelefone);
        document.getElementById('cep').addEventListener('input', aplicarMascaraCEP);
    }

    // Lógica para fechar o menu mobile ao clicar em um link
    const nav = document.getElementById('main-nav');
    if (nav) {
        nav.addEventListener('click', function(event) {
            // Verifica se o clique foi em um link ou botão de dropdown
            if (event.target.tagName === 'A' || event.target.closest('.dropdown-container')) {
                // Pequeno delay para permitir a navegação/ação antes de fechar o menu
                setTimeout(function() {
                     if (nav.classList.contains('menu-open')) {
                         toggleMenu();
                     }
                }, 100); 
            }
        });
    }
});

// Garante que a função toggleMenu esteja acessível globalmente (chamada pelo onclick do HTML)
window.toggleMenu = toggleMenu;
window.toggleTheme = toggleTheme; 
window.validarConsistencia = validarConsistencia; // Essencial para o onsubmit do cadastro.html
