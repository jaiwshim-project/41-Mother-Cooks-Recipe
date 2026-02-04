/* ===================================
   어머니의 손맛 레시피 - 메인 JavaScript
   =================================== */

// DOM 로드 후 실행
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initFilters();
    initChat();
    initAnimations();
});

/* ===================================
   네비게이션
   =================================== */
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
        });

        // 메뉴 클릭 시 닫기
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
    }

    // 현재 페이지 활성화
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-menu a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}

/* ===================================
   필터 기능
   =================================== */
function initFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.card[data-category]');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // 버튼 활성화
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const filter = this.dataset.filter;

            // 카드 필터링
            cards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.style.display = 'block';
                    card.classList.add('fade-in');
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

/* ===================================
   AI 채팅 기능
   =================================== */
function initChat() {
    const chatInput = document.querySelector('.chat-input');
    const sendBtn = document.querySelector('.send-btn');
    const messagesContainer = document.querySelector('.chat-messages');
    const suggestedBtns = document.querySelectorAll('.suggested-btn');

    if (!chatInput || !sendBtn || !messagesContainer) return;

    // 전송 버튼 클릭
    sendBtn.addEventListener('click', () => sendMessage());

    // 엔터 키로 전송
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    // 추천 질문 클릭
    suggestedBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            chatInput.value = this.textContent;
            sendMessage();
        });
    });

    function sendMessage() {
        const message = chatInput.value.trim();
        if (!message) return;

        // 사용자 메시지 추가
        addMessage(message, 'user');
        chatInput.value = '';

        // AI 응답 (시뮬레이션)
        showTypingIndicator();
        setTimeout(() => {
            removeTypingIndicator();
            const response = generateMotherResponse(message);
            addMessage(response, 'mother');
        }, 1500);
    }

    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;

        const avatar = sender === 'user' ? '👤' : '👩‍🍳';

        messageDiv.innerHTML = `
            <div class="message-avatar">${avatar}</div>
            <div class="message-content">${text}</div>
        `;

        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function showTypingIndicator() {
        const typing = document.createElement('div');
        typing.className = 'message mother typing-indicator';
        typing.innerHTML = `
            <div class="message-avatar">👩‍🍳</div>
            <div class="message-content">
                <span class="loading"></span> 생각하고 있어요...
            </div>
        `;
        messagesContainer.appendChild(typing);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function removeTypingIndicator() {
        const typing = document.querySelector('.typing-indicator');
        if (typing) typing.remove();
    }
}

// 어머니 스타일 응답 생성 (데모용)
function generateMotherResponse(question) {
    const responses = {
        default: [
            "그래, 그 질문 참 좋구나. 요리라는 건 말이야, 단순히 음식을 만드는 게 아니라 사랑을 담는 거란다.",
            "음, 그런 생각을 하고 있었구나. 어머니가 요리를 할 때는 항상 먹을 사람 생각을 먼저 했어.",
            "좋은 질문이야. 세상에 완벽한 요리는 없단다. 정성이 담긴 요리가 최고의 요리야.",
            "그거 알아? 요리의 비결은 따로 없어. 사랑하는 마음으로 만들면 다 맛있어지는 거야."
        ],
        recipe: [
            "그 요리 말이야, 네 아버지가 참 좋아했었지. 만드는 법은 간단해. 마음을 담아서 천천히 하면 돼.",
            "레시피보다 중요한 건 손맛이야. 같은 재료로 만들어도 정성에 따라 맛이 달라지거든."
        ],
        memory: [
            "그때 생각이 나는구나. 어머니도 그 시절이 그리워. 함께했던 시간들이 다 소중했어.",
            "추억이라는 건 말이야, 음식과 함께 남는 거야. 냄새를 맡으면 그때로 돌아가곤 하지."
        ]
    };

    const lowerQ = question.toLowerCase();

    if (lowerQ.includes('레시피') || lowerQ.includes('만드') || lowerQ.includes('요리법')) {
        return responses.recipe[Math.floor(Math.random() * responses.recipe.length)];
    } else if (lowerQ.includes('추억') || lowerQ.includes('기억') || lowerQ.includes('그때')) {
        return responses.memory[Math.floor(Math.random() * responses.memory.length)];
    } else {
        return responses.default[Math.floor(Math.random() * responses.default.length)];
    }
}

/* ===================================
   스크롤 애니메이션
   =================================== */
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // 카드와 섹션에 애니메이션 적용
    document.querySelectorAll('.card, .timeline-item, .gallery-item').forEach(el => {
        observer.observe(el);
    });
}

/* ===================================
   갤러리 모달
   =================================== */
function openGalleryModal(imageSrc, title, description) {
    const modal = document.createElement('div');
    modal.className = 'gallery-modal';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeGalleryModal()"></div>
        <div class="modal-content">
            <button class="modal-close" onclick="closeGalleryModal()">&times;</button>
            <img src="${imageSrc}" alt="${title}">
            <h3>${title}</h3>
            <p>${description}</p>
        </div>
    `;
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
}

function closeGalleryModal() {
    const modal = document.querySelector('.gallery-modal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = '';
    }
}

/* ===================================
   도슨트 음성 재생 (TTS 시뮬레이션)
   =================================== */
function playDocent(text) {
    // Web Speech API 사용 (브라우저 지원 시)
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ko-KR';
        utterance.rate = 0.9;
        utterance.pitch = 1;
        speechSynthesis.speak(utterance);
    } else {
        alert('이 브라우저는 음성 재생을 지원하지 않습니다.');
    }
}

function stopDocent() {
    if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
    }
}

/* ===================================
   유틸리티 함수
   =================================== */
// 날짜 포맷
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ko-KR', options);
}

// 로컬 스토리지 헬퍼
const storage = {
    get: (key) => {
        try {
            return JSON.parse(localStorage.getItem(key));
        } catch {
            return null;
        }
    },
    set: (key, value) => {
        localStorage.setItem(key, JSON.stringify(value));
    },
    remove: (key) => {
        localStorage.removeItem(key);
    }
};

// 스크롤 위치 저장/복원
function saveScrollPosition() {
    storage.set('scrollPosition', window.scrollY);
}

function restoreScrollPosition() {
    const pos = storage.get('scrollPosition');
    if (pos) {
        window.scrollTo(0, pos);
        storage.remove('scrollPosition');
    }
}
