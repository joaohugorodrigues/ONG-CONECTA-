// FUNÇÕES GLOBAIS PARA NAVEGAÇÃO E INTERATIVIDADE (Entrega III)

document.addEventListener('DOMContentLoaded', function() {
    // ----------------------------------------------------
    // 1. CONTROLE DO MENU HAMBÚRGUER (MOBILE)
    // ----------------------------------------------------
    window.toggleMenu = function() {
        const nav = document.getElementById('main-nav');
        const iconMenu = document.getElementById('icon-menu');
        const iconClose = document.getElementById('icon-close');
        const isMenuOpen = nav.classList.toggle('menu-open');
        
        // Alterna os ícones do botão
        iconMenu.classList.toggle('hidden', isMenuOpen);
        iconClose.classList.toggle('hidden', !isMenuOpen);
        
        // Atualiza o atributo ARIA
        document.querySelector('.hamburger-button').setAttribute('aria-expanded', isMenuOpen);

        // O CSS controla a transição do menu
        if (isMenuOpen) {
            nav.style.right = '0';
        } else {
            nav.style.right = '-100%';
        }
    }

    // ----------------------------------------------------
    // 2. FUNÇÃO DE ROTEAMENTO (SIMULAÇÃO BÁSICA DE SPA)
    // OBS: O conteúdo estático é carregado diretamente no HTML
    // Esta função apenas garante que o menu feche ao clicar em links
    // ----------------------------------------------------
    function closeMenuOnLinkClick(event) {
        if (event.target.tagName === 'A' || event.target.tagName === 'BUTTON') {
            // Pequeno delay para permitir a navegação/ação antes de fechar
            setTimeout(window.toggleMenu, 100); 
        }
    }

    // Adiciona evento de clique global para fechar o menu ao navegar
    const mainNav = document.getElementById('main-nav');
    if (mainNav) {
        mainNav.addEventListener('click', closeMenuOnLinkClick);
    }
    
    // ----------------------------------------------------
    // 3. CONTROLE DO DROPDOWN EM MOBILE
    // ----------------------------------------------------
    const dropdownButton = document.querySelector('.dropdown-container button');
    const dropdownContainer = document.querySelector('.dropdown-container');

    if (dropdownButton) {
        dropdownButton.addEventListener('click', function(e) {
            // Verifica se está em modo mobile (media query do CSS é o melhor proxy)
            const isMobile = window.matchMedia("(max-width: 768px)").matches;
            
            if (isMobile) {
                e.preventDefault(); 
                dropdownContainer.classList.toggle('active');
                const isExpanded = dropdownContainer.classList.contains('active');
                dropdownButton.setAttribute('aria-expanded', isExpanded);
            }
            // Em desktop, o CSS cuida do hover
        });
    }


    // ----------------------------------------------------
    // 4. FUNÇÕES GERAIS DA PÁGINA INICIAL (index.html)
    // ----------------------------------------------------
    if (document.getElementById('doacao-valor')) {
        // Função da Calculadora de Impacto (Reutilizada do código anterior)
        window.calcularImpacto = function() {
            const valorInput = document.getElementById('doacao-valor');
            const resultadoElement = document.getElementById('resultado-impacto');
            const valor = parseFloat(valorInput.value);

            if (isNaN(valor) || valor <= 0) {
                resultadoElement.textContent = 'Por favor, insira um valor válido.';
                return;
            }

            // Regras de Impacto Fictícias (para simular a métrica da ONG)
            const custo_mentoria_hora = 2.5; // R$ 2.50 por hora de mentoria
            const custo_kit_basico = 50.0; // R$ 50.00 = 1 kit básico de higiene e materiais

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

        // Inicializa a calculadora no carregamento da página
        window.calcularImpacto();
        
        // Adiciona evento ao input
        document.getElementById('doacao-valor').addEventListener('input', window.calcularImpacto);
    }
});
