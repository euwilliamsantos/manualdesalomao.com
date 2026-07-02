document.addEventListener('DOMContentLoaded', () => {
    
    /* -------------------------------------------------------------
       1. ANIMACAO DE SCROLL REVEAL (INTERSECTION OBSERVER)
    ------------------------------------------------------------- */
    const revealElements = document.querySelectorAll('.reveal');
    
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    // Uma vez revelado, não precisamos mais observar o elemento
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12, // Dispara quando 12% do elemento estiver visível
            rootMargin: '0px 0px -50px 0px' // Margem inferior sutil para melhor timing
        });
        
        revealElements.forEach(element => {
            revealObserver.observe(element);
        });
    } else {
        // Fallback para navegadores antigos
        revealElements.forEach(element => {
            element.classList.add('active');
        });
    }

    /* -------------------------------------------------------------
       2. CRONÔMETRO DE ESCASSEZ PERSISTENTE (COUNTDOWN)
    ------------------------------------------------------------- */
    const countdownElement = document.getElementById('countdown');
    const timerKey = 'manual_salomao_timer_time';
    const timerDuration = 15 * 60; // 15 minutos em segundos

    let timeRemaining;
    const storedTime = localStorage.getItem(timerKey);
    const storedTimestamp = localStorage.getItem(timerKey + '_timestamp');
    const now = Math.floor(Date.now() / 1000);

    if (storedTime && storedTimestamp) {
        const elapsed = now - parseInt(storedTimestamp, 10);
        timeRemaining = parseInt(storedTime, 10) - elapsed;

        // Se o tempo expirou, reinicia a contagem de 15 minutos para novos visitantes
        if (timeRemaining <= 0) {
            timeRemaining = timerDuration;
            localStorage.setItem(timerKey, timeRemaining.toString());
            localStorage.setItem(timerKey + '_timestamp', now.toString());
        }
    } else {
        timeRemaining = timerDuration;
        localStorage.setItem(timerKey, timeRemaining.toString());
        localStorage.setItem(timerKey + '_timestamp', now.toString());
    }

    function updateCountdown() {
        if (timeRemaining <= 0) {
            // Em vez de expirar totalmente ou sumir, resetamos para 10 minutos para manter urgência sutil
            timeRemaining = 10 * 60; 
            localStorage.setItem(timerKey, timeRemaining.toString());
            localStorage.setItem(timerKey + '_timestamp', Math.floor(Date.now() / 1000).toString());
        }

        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;

        const minutesStr = minutes < 10 ? '0' + minutes : minutes;
        const secondsStr = seconds < 10 ? '0' + seconds : seconds;

        countdownElement.textContent = `${minutesStr}:${secondsStr}`;
        
        // Salva o progresso a cada segundo
        timeRemaining--;
        localStorage.setItem(timerKey, timeRemaining.toString());
        localStorage.setItem(timerKey + '_timestamp', Math.floor(Date.now() / 1000).toString());
    }

    // Inicializa e roda a cada segundo
    updateCountdown();
    const countdownInterval = setInterval(updateCountdown, 1000);

    /* -------------------------------------------------------------
       3. INTERATIVIDADE DO FAQ (ACCORDION)
    ------------------------------------------------------------- */
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const currentItem = question.parentElement;
            const isOpen = currentItem.classList.contains('active');

            // Fecha todos os outros itens de FAQ abertos
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
            });

            // Se o item clicado não estava aberto, abra-o
            if (!isOpen) {
                currentItem.classList.add('active');
            }
        });
    });

    /* -------------------------------------------------------------
       4. ANIMAÇÕES DE DIGITAÇÃO NOS MOCKUPS DE WHATSAPP (DYNAMIC SIMULATION)
    ------------------------------------------------------------- */
    // Para dar vida à página de vendas e "não parecer estática", simulamos
    // uma digitação sutil antes das mensagens aparecerem nos chats da seção de resultados.
    const chatBodies = document.querySelectorAll('.whatsapp-chat .chat-body, .instagram-chat .chat-body');
    
    // Configura os elementos de mensagens para surgirem com pequenos delays
    // Isso cria uma sensação de dinamismo quando entram na tela
    chatBodies.forEach(body => {
        const messages = body.querySelectorAll('.message');
        messages.forEach((msg, idx) => {
            // Opcional: Adiciona um atraso baseado na ordem das mensagens para simular envio dinâmico
            msg.style.opacity = '0';
            msg.style.transform = 'translateY(10px)';
            msg.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            
            // Usamos a mesma animação do intersection observer para revelar as mensagens gradualmente
            // quando a seção inteira for revelada.
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            msg.style.opacity = '1';
                            msg.style.transform = 'translateY(0)';
                        }, idx * 450); // Delay progressivo de 450ms por mensagem
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            
            observer.observe(body);
        });
    });
});
