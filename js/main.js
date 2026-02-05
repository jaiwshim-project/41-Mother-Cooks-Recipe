/* ===================================
   어머니의 손맛 레시피 - 메인 JavaScript
   =================================== */

// DOM 로드 후 실행
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initFilters();
    initChat();
    initAnimations();
    initCalendar();
    initIngredients();
    initGuestbook();
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
        document.querySelectorAll('.nav-menu > li > a').forEach(link => {
            link.addEventListener('click', () => {
                if (!link.classList.contains('dropdown-toggle')) {
                    navMenu.classList.remove('active');
                    hamburger.classList.remove('active');
                }
            });
        });
    }

    // 드롭다운 토글 (모바일)
    document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            const parent = this.closest('.nav-dropdown');
            parent.classList.toggle('open');
        });
    });

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
            // 같은 그룹의 버튼만 비활성화
            const parent = this.closest('.filter-bar') || this.closest('.season-filter-bar');
            if (parent) {
                parent.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            }
            this.classList.add('active');

            const filter = this.dataset.filter || this.dataset.season;

            // 카드 필터링
            cards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.style.display = 'block';
                    card.classList.add('fade-in');
                } else {
                    card.style.display = 'none';
                }
            });

            // 캘린더 필터
            if (this.dataset.season !== undefined) {
                filterCalendar(this.dataset.season);
            }

            // 식재료 필터
            if (this.closest('#ingredientGrid')?.parentElement || this.dataset.filter) {
                filterIngredients(filter);
            }
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
    document.querySelectorAll('.card, .timeline-item, .gallery-item, .food-timeline-item, .calendar-card, .ingredient-card, .guestbook-entry').forEach(el => {
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
   도슨트 음성 재생 (TTS)
   =================================== */
function playDocent(text) {
    if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
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
   조리 모드 (Cooking Mode)
   =================================== */
let cookingState = {
    currentStep: 0,
    steps: [],
    timerInterval: null,
    timerSeconds: 0,
    timerRunning: false,
    timerTarget: 0
};

function startCookingMode() {
    const stepsElements = document.querySelectorAll('.cooking-steps li');
    if (stepsElements.length === 0) return;

    cookingState.steps = Array.from(stepsElements).map(li => ({
        text: li.textContent,
        timer: parseInt(li.dataset.timer) || 0
    }));
    cookingState.currentStep = 0;

    const overlay = document.getElementById('cookingModeOverlay');
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    document.getElementById('cookingStepTotal').textContent = cookingState.steps.length;

    showCookingStep();
}

function exitCookingMode() {
    const overlay = document.getElementById('cookingModeOverlay');
    overlay.style.display = 'none';
    document.body.style.overflow = '';
    clearInterval(cookingState.timerInterval);
    cookingState.timerRunning = false;
}

function showCookingStep() {
    const step = cookingState.steps[cookingState.currentStep];
    document.getElementById('cookingStepCurrent').textContent = cookingState.currentStep + 1;
    document.getElementById('cookingStepText').textContent = step.text;

    // 타이머 처리
    const timerArea = document.getElementById('cookingTimer');
    if (step.timer > 0) {
        timerArea.style.display = 'block';
        cookingState.timerTarget = step.timer;
        cookingState.timerSeconds = step.timer;
        cookingState.timerRunning = false;
        clearInterval(cookingState.timerInterval);
        updateTimerDisplay();
        document.getElementById('timerStartBtn').textContent = '타이머 시작';
    } else {
        timerArea.style.display = 'none';
    }

    // 버튼 상태
    document.getElementById('cookingPrevBtn').style.visibility = cookingState.currentStep === 0 ? 'hidden' : 'visible';
    const nextBtn = document.getElementById('cookingNextBtn');
    if (cookingState.currentStep === cookingState.steps.length - 1) {
        nextBtn.textContent = '완료!';
    } else {
        nextBtn.textContent = '다음 →';
    }
}

function nextCookingStep() {
    if (cookingState.currentStep < cookingState.steps.length - 1) {
        cookingState.currentStep++;
        clearInterval(cookingState.timerInterval);
        cookingState.timerRunning = false;
        showCookingStep();
    } else {
        exitCookingMode();
        alert('🎉 모든 조리가 완료되었습니다! 맛있게 드세요!');
    }
}

function prevCookingStep() {
    if (cookingState.currentStep > 0) {
        cookingState.currentStep--;
        clearInterval(cookingState.timerInterval);
        cookingState.timerRunning = false;
        showCookingStep();
    }
}

function toggleTimer() {
    if (cookingState.timerRunning) {
        clearInterval(cookingState.timerInterval);
        cookingState.timerRunning = false;
        document.getElementById('timerStartBtn').textContent = '타이머 재개';
    } else {
        cookingState.timerRunning = true;
        document.getElementById('timerStartBtn').textContent = '일시정지';
        cookingState.timerInterval = setInterval(() => {
            cookingState.timerSeconds--;
            updateTimerDisplay();
            if (cookingState.timerSeconds <= 0) {
                clearInterval(cookingState.timerInterval);
                cookingState.timerRunning = false;
                document.getElementById('timerStartBtn').textContent = '완료!';
                playDocent('타이머가 완료되었습니다. 다음 단계로 넘어가세요.');
            }
        }, 1000);
    }
}

function resetTimer() {
    clearInterval(cookingState.timerInterval);
    cookingState.timerRunning = false;
    cookingState.timerSeconds = cookingState.timerTarget;
    updateTimerDisplay();
    document.getElementById('timerStartBtn').textContent = '타이머 시작';
}

function updateTimerDisplay() {
    const min = Math.floor(cookingState.timerSeconds / 60);
    const sec = cookingState.timerSeconds % 60;
    document.getElementById('timerDisplay').textContent =
        `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

function speakCurrentStep() {
    const step = cookingState.steps[cookingState.currentStep];
    playDocent(step.text);
}

/* ===================================
   레시피 카드 인쇄
   =================================== */
function printRecipeCard() {
    window.print();
}

/* ===================================
   절기 음식 달력
   =================================== */
const seasonalData = [
    { name: '입춘', date: '2월 4일', season: 'spring', food: '🌿 냉이된장국', recipe: '냉이를 넣어 끓인 된장국', quote: '"봄이 오면 냉이부터 캐러 가야지."' },
    { name: '우수', date: '2월 19일', season: 'spring', food: '🥬 시래기밥', recipe: '겨우내 말린 시래기로 지은 밥', quote: '"겨울 시래기가 봄에 먹으면 제일 맛있어."' },
    { name: '경칩', date: '3월 6일', season: 'spring', food: '🫘 콩나물국밥', recipe: '해장에 좋은 콩나물국밥', quote: '"경칩에는 콩나물로 속을 풀어야 해."' },
    { name: '춘분', date: '3월 21일', season: 'spring', food: '🌸 쑥떡', recipe: '새봄 쑥으로 만든 쑥떡', quote: '"쑥 향이 나면 진짜 봄이 온 거야."' },
    { name: '청명', date: '4월 5일', season: 'spring', food: '🥗 달래무침', recipe: '봄 달래로 만든 무침', quote: '"청명에 달래 무치면 입맛이 살아나."' },
    { name: '곡우', date: '4월 20일', season: 'spring', food: '🍚 나물 비빔밥', recipe: '봄나물 가득 비빔밥', quote: '"곡우 지나면 나물이 억세져. 그 전에 해야 해."', link: 'recipe-detail.html?id=5' },
    { name: '입하', date: '5월 6일', season: 'summer', food: '🥒 오이냉국', recipe: '시원한 오이냉국', quote: '"더워지면 냉국이 보약이야."' },
    { name: '소만', date: '5월 21일', season: 'summer', food: '🍓 보리밥', recipe: '새 보리로 지은 보리밥', quote: '"보리밥에 된장 한 숟갈이면 충분해."' },
    { name: '망종', date: '6월 6일', season: 'summer', food: '🌾 쌈밥', recipe: '상추쌈에 쌈장', quote: '"밭에서 바로 따온 상추가 제일이야."' },
    { name: '하지', date: '6월 21일', season: 'summer', food: '🍜 콩국수', recipe: '고소한 콩국수', quote: '"하지 지나면 콩국수 생각이 절로 나."', link: 'recipe-detail.html?id=6' },
    { name: '소서', date: '7월 7일', season: 'summer', food: '🍉 수박화채', recipe: '시원한 수박화채', quote: '"더울 때는 차가운 게 약이야."' },
    { name: '대서', date: '7월 23일', season: 'summer', food: '🐔 삼계탕', recipe: '보양식 삼계탕', quote: '"복날에는 삼계탕으로 원기를 보충해야 해."' },
    { name: '입추', date: '8월 8일', season: 'autumn', food: '🌽 옥수수', recipe: '찐 옥수수', quote: '"가을이 시작되면 옥수수가 제일 달아."' },
    { name: '처서', date: '8월 23일', season: 'autumn', food: '🍇 포도', recipe: '제철 포도', quote: '"처서 지나면 모기 입이 비뚤어진다 했지."' },
    { name: '백로', date: '9월 8일', season: 'autumn', food: '🍄 버섯전골', recipe: '가을 버섯 전골', quote: '"가을 버섯은 고기보다 맛있어."' },
    { name: '추분', date: '9월 23일', season: 'autumn', food: '🎃 호박죽', recipe: '늙은 호박으로 만든 호박죽', quote: '"추분이 지나면 호박이 맛있어져."', link: 'recipe-detail.html?id=7' },
    { name: '한로', date: '10월 8일', season: 'autumn', food: '🍠 고구마', recipe: '군고구마', quote: '"찬바람 불면 고구마가 생각나지?"' },
    { name: '상강', date: '10월 23일', season: 'autumn', food: '🍎 사과', recipe: '가을 사과', quote: '"서리가 내려야 사과가 달아지는 거야."' },
    { name: '입동', date: '11월 7일', season: 'winter', food: '🥬 김장김치', recipe: '일 년 먹을 김장', quote: '"입동 전에 김장을 끝내야 해."' },
    { name: '소설', date: '11월 22일', season: 'winter', food: '🥘 김치찌개', recipe: '잘 익은 김치로 끓인 찌개', quote: '"첫눈 오는 날은 김치찌개가 제격이야."', link: 'recipe-detail.html?id=2' },
    { name: '대설', date: '12월 7일', season: 'winter', food: '🍲 된장찌개', recipe: '구수한 된장찌개', quote: '"눈 많이 오는 날은 뜨끈한 국물이 최고야."', link: 'recipe-detail.html?id=1' },
    { name: '동지', date: '12월 22일', season: 'winter', food: '🫘 팥죽', recipe: '달달한 팥죽', quote: '"동지팥죽 안 먹으면 한 살 더 먹는다 했어."' },
    { name: '소한', date: '1월 6일', season: 'winter', food: '🥣 떡국', recipe: '가래떡으로 끓인 떡국', quote: '"새해에는 떡국 한 그릇이면 한 살 먹는 거야."' },
    { name: '대한', date: '1월 20일', season: 'winter', food: '🍜 칼국수', recipe: '뜨끈한 칼국수', quote: '"대한이 소한 집에 놀러 간다 했지. 춥다 추워."' }
];

function initCalendar() {
    const calendarGrid = document.getElementById('calendarGrid');
    const todayBox = document.getElementById('todaySeasonBox');
    if (!calendarGrid) return;

    // 오늘의 절기 찾기
    const today = new Date();
    const currentSeason = getCurrentSeason(today);

    // 오늘의 절기 박스
    if (todayBox) {
        todayBox.innerHTML = `
            <div class="today-date">${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일</div>
            <h2>지금은 ${currentSeason.name} 무렵이에요</h2>
            <div class="today-recipe">${currentSeason.food} ${currentSeason.recipe}</div>
            <div class="mother-says">${currentSeason.quote}</div>
            ${currentSeason.link ? `<a href="${currentSeason.link}" class="btn btn-secondary" style="margin-top:1rem;">레시피 보기</a>` : ''}
        `;
    }

    // 달력 그리드 렌더링
    renderCalendarCards(seasonalData);

    // 절기 필터
    document.querySelectorAll('.season-filter-bar .filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.season-filter-bar .filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            filterCalendar(this.dataset.season);
        });
    });
}

function getCurrentSeason(date) {
    const month = date.getMonth() + 1;
    const day = date.getDate();

    // 간단한 절기 매칭: 날짜 기반
    const seasonDates = seasonalData.map(s => {
        const parts = s.date.replace('일', '').split('월 ');
        return { ...s, month: parseInt(parts[0]), day: parseInt(parts[1]) };
    });

    // 현재 날짜에 가장 가까운 지난 절기 찾기
    let closest = seasonDates[0];
    for (const s of seasonDates) {
        if (s.month < month || (s.month === month && s.day <= day)) {
            closest = s;
        }
    }
    return closest;
}

function renderCalendarCards(data) {
    const grid = document.getElementById('calendarGrid');
    if (!grid) return;

    const today = new Date();
    const currentSeason = getCurrentSeason(today);

    grid.innerHTML = data.map(item => {
        const isCurrent = item.name === currentSeason.name;
        const seasonClass = `season-${item.season}`;
        const seasonLabels = { spring: '봄', summer: '여름', autumn: '가을', winter: '겨울' };

        return `
            <div class="calendar-card ${isCurrent ? 'current' : ''}" data-season="${item.season}">
                <div class="calendar-card-header">
                    <span class="calendar-card-name">${item.name}</span>
                    <span class="calendar-card-date">${item.date}</span>
                </div>
                <div class="calendar-card-food">${item.food}</div>
                <div class="calendar-card-quote">${item.quote}</div>
                <span class="calendar-card-season-tag ${seasonClass}">${seasonLabels[item.season]}</span>
                ${item.link ? `<a href="${item.link}" style="display:block;margin-top:0.5rem;color:var(--secondary-color);font-size:0.85rem;">레시피 보기 →</a>` : ''}
            </div>
        `;
    }).join('');
}

function filterCalendar(season) {
    const cards = document.querySelectorAll('.calendar-card');
    cards.forEach(card => {
        if (season === 'all' || card.dataset.season === season) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

/* ===================================
   식재료 사전
   =================================== */
const ingredientsData = [
    {
        name: '된장', emoji: '🫘', category: 'jang',
        desc: '콩을 발효시켜 만든 한국의 대표 장류',
        detail: '된장은 메주를 소금물에 담가 발효시켜 만듭니다. 단백질과 비타민이 풍부하며, 항암 효과가 있다고 알려져 있습니다.',
        tip: '"된장은 3년 묵은 게 제일 맛있어. 집에서 담근 된장이 공장 거보다 훨씬 깊은 맛이 나."',
        howTo: '색이 진한 갈색이고, 구수한 향이 나는 것이 좋습니다. 너무 짜지 않고 감칠맛이 도는 것을 고르세요.',
        recipes: ['된장찌개', '된장국', '쌈장']
    },
    {
        name: '고추장', emoji: '🌶️', category: 'jang',
        desc: '매콤 달콤한 한국 고유의 발효 양념',
        detail: '찹쌀, 메줏가루, 고춧가루를 섞어 발효시킨 장입니다. 매운맛과 단맛이 조화를 이루며 비빔밥, 떡볶이 등에 쓰입니다.',
        tip: '"고추장은 햇빛을 많이 받아야 맛있어져. 장독대에서 1년 이상 숙성시킨 게 제일이야."',
        howTo: '너무 빨간 것보다 검붉은 색이 나는 것이 잘 숙성된 것입니다. 약간의 단맛이 느껴지는 것이 좋습니다.',
        recipes: ['비빔밥', '떡볶이', '고추장찌개']
    },
    {
        name: '간장', emoji: '🥢', category: 'jang',
        desc: '음식의 간을 맞추는 기본 장류',
        detail: '메주를 소금물에 담가 된장과 분리하여 만듭니다. 국간장(조선간장)과 진간장으로 나뉩니다.',
        tip: '"국 끓일 때는 조선간장, 조림할 때는 진간장. 이것만 알면 반은 성공이야."',
        howTo: '맑고 향이 좋은 것을 고르세요. 국간장은 짠맛이 강하고, 진간장은 단맛이 있습니다.',
        recipes: ['잡채', '불고기', '미역국']
    },
    {
        name: '참기름', emoji: '🫗', category: 'oil',
        desc: '고소한 향의 한식 필수 기름',
        detail: '참깨를 볶아 짜낸 기름으로, 나물 무침이나 비빔밥 등 한식의 마무리에 빠지지 않습니다.',
        tip: '"참기름은 조금만 넣어도 확 달라져. 마지막에 한 방울이 비법이야."',
        howTo: '색이 맑은 갈색이고 고소한 향이 진한 것이 좋습니다. 소량 생산 제품이 향이 더 좋습니다.',
        recipes: ['나물 비빔밥', '무침류', '볶음밥']
    },
    {
        name: '들기름', emoji: '🥜', category: 'oil',
        desc: '구수하고 건강한 전통 기름',
        detail: '들깨를 짜서 만든 기름으로 오메가-3가 풍부합니다. 나물 볶음이나 무침에 사용합니다.',
        tip: '"들기름은 빨리 상하니까 조금씩 사서 써야 해. 냉장고에 넣어두면 오래 가."',
        howTo: '갈색이 짙고 들깨 향이 풍부한 것을 고르세요. 유통기한이 짧으니 소량 구입하세요.',
        recipes: ['시금치나물', '도토리묵무침', '들깨수제비']
    },
    {
        name: '애호박', emoji: '🥬', category: 'veggie',
        desc: '부드러운 식감의 다용도 채소',
        detail: '된장찌개, 호박전, 나물 등 다양한 한식에 사용되는 기본 채소입니다.',
        tip: '"애호박은 너무 크지 않은 게 좋아. 작고 단단한 게 맛있어."',
        howTo: '껍질이 매끄럽고 진한 녹색인 것, 만졌을 때 단단한 것이 신선합니다.',
        recipes: ['된장찌개', '호박전', '호박나물']
    },
    {
        name: '배추', emoji: '🥬', category: 'veggie',
        desc: '김치의 기본, 한국인의 대표 채소',
        detail: '김장의 주재료이며, 국, 찜, 쌈 등 다양하게 활용됩니다.',
        tip: '"김장 배추는 속이 꽉 차고 노란 것이 제일이야. 서리 맞은 배추가 달아."',
        howTo: '잎이 탄탄하고 속이 노랗게 잘 찬 것을 고르세요. 들었을 때 묵직한 것이 좋습니다.',
        recipes: ['김장김치', '배추된장국', '보쌈']
    },
    {
        name: '무', emoji: '🥕', category: 'veggie',
        desc: '시원한 맛의 만능 뿌리채소',
        detail: '김치, 국물, 조림 등 한식의 기본 재료입니다. 소화를 돕는 효소가 풍부합니다.',
        tip: '"무는 위쪽은 달고 아래쪽은 매워. 용도에 따라 부위를 골라 써."',
        howTo: '무거우면서 껍질이 매끈하고 흠집이 없는 것을 고르세요.',
        recipes: ['동치미', '깍두기', '무조림']
    },
    {
        name: '두부', emoji: '🫧', category: 'etc',
        desc: '고단백 저칼로리 식물성 단백질',
        detail: '콩으로 만든 전통 식품으로, 찌개, 조림, 부침 등에 사용됩니다.',
        tip: '"두부는 신선한 게 최고야. 사 온 날 바로 먹는 게 제일 맛있어."',
        howTo: '흰색이 맑고 콩 향이 나는 것이 좋습니다. 유통기한을 확인하세요.',
        recipes: ['된장찌개', '순두부찌개', '두부조림']
    },
    {
        name: '멸치', emoji: '🐟', category: 'etc',
        desc: '국물의 기본, 천연 조미료',
        detail: '다시마와 함께 한식 육수의 기본 재료입니다. 칼슘이 풍부합니다.',
        tip: '"육수용 멸치는 크고 은빛 나는 거, 볶음용은 작은 거. 이것만 기억해."',
        howTo: '은빛이 도는 것이 신선한 것입니다. 머리와 내장은 제거하고 사용하면 쓴맛이 줄어듭니다.',
        recipes: ['된장찌개 육수', '멸치볶음', '국물요리']
    },
    {
        name: '다시마', emoji: '🌊', category: 'etc',
        desc: '깊은 국물의 비밀',
        detail: '해조류의 일종으로, 멸치와 함께 한식 육수의 기본입니다. 글루탐산이 풍부하여 감칠맛을 냅니다.',
        tip: '"다시마는 오래 끓이면 안 돼. 물이 끓기 직전에 빼야 맑은 국물이 나와."',
        howTo: '두껍고 검은 빛이 도는 것이 좋습니다. 표면에 하얀 가루(만니톨)가 있는 것이 감칠맛이 좋습니다.',
        recipes: ['육수', '다시마쌈', '조림']
    },
    {
        name: '깨', emoji: '🤍', category: 'etc',
        desc: '고소함의 마무리',
        detail: '참깨와 들깨 모두 한식에 자주 사용됩니다. 무침이나 국물의 마무리에 뿌려 향을 더합니다.',
        tip: '"깨는 볶아서 바로 써야 고소해. 미리 볶아놓으면 향이 날아가."',
        howTo: '통깨는 통통하고 윤기가 나는 것을 고르세요. 볶지 않은 것을 사서 직접 볶는 것이 좋습니다.',
        recipes: ['나물무침', '비빔밥', '잡채']
    }
];

function initIngredients() {
    const grid = document.getElementById('ingredientGrid');
    if (!grid) return;

    renderIngredients(ingredientsData);

    // 검색 기능
    const searchInput = document.getElementById('ingredientSearch');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase();
            const filtered = ingredientsData.filter(i =>
                i.name.includes(query) || i.desc.includes(query)
            );
            renderIngredients(filtered);
        });
    }

    // 카테고리 필터 (ingredients 페이지에서)
    document.querySelectorAll('.filter-btn[data-filter]').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn[data-filter]').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            filterIngredients(this.dataset.filter);
        });
    });
}

function renderIngredients(data) {
    const grid = document.getElementById('ingredientGrid');
    if (!grid) return;

    const categoryLabels = { jang: '장류', oil: '기름류', veggie: '채소류', etc: '기타' };

    grid.innerHTML = data.map((item, i) => `
        <div class="ingredient-card" data-category="${item.category}" onclick="openIngredientDetail(${i})">
            <div class="ingredient-card-emoji">${item.emoji}</div>
            <div class="ingredient-card-name">${item.name}</div>
            <div class="ingredient-card-category">${categoryLabels[item.category]}</div>
            <div class="ingredient-card-desc">${item.desc}</div>
        </div>
    `).join('');
}

function filterIngredients(filter) {
    const cards = document.querySelectorAll('.ingredient-card');
    cards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function openIngredientDetail(index) {
    const item = ingredientsData[index];
    if (!item) return;

    const modal = document.getElementById('ingredientModal');
    const content = document.getElementById('ingredientModalContent');
    if (!modal || !content) return;

    content.innerHTML = `
        <button class="ingredient-modal-close" onclick="closeIngredientModal()">&times;</button>
        <div style="text-align:center; font-size:4rem; margin-bottom:1rem;">${item.emoji}</div>
        <h2>${item.name}</h2>
        <p>${item.detail}</p>
        <h3>어머니의 팁</h3>
        <p style="font-style:italic; color:var(--text-muted);">${item.tip}</p>
        <h3>고르는 법</h3>
        <p>${item.howTo}</p>
        <h3>관련 레시피</h3>
        <p>${item.recipes.join(', ')}</p>
    `;

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeIngredientModal() {
    const modal = document.getElementById('ingredientModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

/* ===================================
   냉장고 파먹기
   =================================== */
const fridgeRecipes = [
    {
        name: '된장찌개',
        ingredients: ['애호박', '양파', '마늘', '청양고추', '두부', '표고버섯', '된장', '파'],
        desc: '구수하고 따뜻한 집밥의 대표',
        link: 'recipe-detail.html?id=1'
    },
    {
        name: '김치찌개',
        ingredients: ['김치', '돼지고기', '두부', '양파', '파', '마늘', '고추장'],
        desc: '잘 익은 김치로 끓인 칼칼한 찌개',
        link: 'recipe-detail.html?id=2'
    },
    {
        name: '잡채',
        ingredients: ['당면', '시금치', '당근', '양파', '표고버섯', '소고기', '참기름'],
        desc: '명절이 아니어도 맛있는 잡채',
        link: 'recipe-detail.html?id=3'
    },
    {
        name: '미역국',
        ingredients: ['미역', '소고기', '마늘', '참기름'],
        desc: '생일이 아니어도 먹고 싶은 미역국',
        link: 'recipe-detail.html?id=4'
    },
    {
        name: '나물 비빔밥',
        ingredients: ['시금치', '콩나물', '당근', '애호박', '계란', '고추장', '참기름'],
        desc: '알록달록 영양 가득 비빔밥',
        link: 'recipe-detail.html?id=5'
    },
    {
        name: '콩국수',
        ingredients: ['콩'],
        desc: '고소한 여름 별미 콩국수',
        link: 'recipe-detail.html?id=6'
    },
    {
        name: '호박죽',
        ingredients: ['호박'],
        desc: '달콤 부드러운 위로의 한 그릇',
        link: 'recipe-detail.html?id=7'
    },
    {
        name: '동치미',
        ingredients: ['무', '배추', '파', '마늘', '청양고추'],
        desc: '시원한 겨울 별미 동치미',
        link: 'recipe-detail.html?id=8'
    },
    {
        name: '계란말이',
        ingredients: ['계란', '양파', '당근', '파'],
        desc: '반찬으로 최고인 계란말이',
        link: 'recipes.html'
    },
    {
        name: '감자볶음',
        ingredients: ['감자', '양파', '파'],
        desc: '간단하지만 맛있는 감자볶음',
        link: 'recipes.html'
    },
    {
        name: '두부조림',
        ingredients: ['두부', '양파', '마늘', '파', '고추장'],
        desc: '매콤 달콤 두부조림',
        link: 'recipes.html'
    },
    {
        name: '시금치나물',
        ingredients: ['시금치', '마늘', '참기름'],
        desc: '기본 반찬 시금치나물',
        link: 'recipes.html'
    },
    {
        name: '콩나물국',
        ingredients: ['콩나물', '마늘', '파'],
        desc: '속이 풀리는 콩나물국',
        link: 'recipes.html'
    },
    {
        name: '고구마맛탕',
        ingredients: ['고구마'],
        desc: '달달한 간식 고구마맛탕',
        link: 'recipes.html'
    }
];

function findRecipes() {
    const checked = Array.from(document.querySelectorAll('.fridge-item input:checked')).map(c => c.value);
    const resultsDiv = document.getElementById('fridgeResults');

    if (checked.length === 0) {
        resultsDiv.innerHTML = `
            <div class="fridge-empty-state">
                <span style="font-size:4rem;">🤔</span>
                <h3>재료를 선택해주세요</h3>
                <p>최소 1가지 이상의 재료를 체크해주세요.</p>
            </div>
        `;
        return;
    }

    // 레시피별 매칭률 계산
    const results = fridgeRecipes.map(recipe => {
        const matched = recipe.ingredients.filter(ing => checked.includes(ing));
        const rate = Math.round((matched.length / recipe.ingredients.length) * 100);
        return { ...recipe, matched, rate };
    }).filter(r => r.rate > 0).sort((a, b) => b.rate - a.rate);

    if (results.length === 0) {
        resultsDiv.innerHTML = `
            <div class="fridge-empty-state">
                <span style="font-size:4rem;">😅</span>
                <h3>아쉽지만 매칭되는 레시피가 없어요</h3>
                <p>다른 재료를 추가로 선택해보세요!</p>
            </div>
        `;
        return;
    }

    resultsDiv.innerHTML = `
        <h3 style="font-family: var(--font-title); color: var(--primary-color); margin-bottom: 1rem;">
            ${results.length}개의 레시피를 찾았어요!
        </h3>
        ${results.map(r => {
            const rateClass = r.rate >= 70 ? 'match-high' : r.rate >= 40 ? 'match-medium' : 'match-low';
            const ingredientList = r.ingredients.map(ing =>
                `<span class="${r.matched.includes(ing) ? 'has' : ''}">${ing}</span>`
            ).join(', ');

            return `
                <div class="fridge-result-card">
                    <div class="fridge-result-header">
                        <span class="fridge-result-name">${r.name}</span>
                        <span class="fridge-match-rate ${rateClass}">${r.rate}% 일치</span>
                    </div>
                    <div class="fridge-result-desc">${r.desc}</div>
                    <div class="fridge-result-ingredients">필요한 재료: ${ingredientList}</div>
                    <a href="${r.link}" class="card-link" style="font-size:0.9rem;">레시피 보기 →</a>
                </div>
            `;
        }).join('')}
    `;
}

function clearFridge() {
    document.querySelectorAll('.fridge-item input').forEach(cb => cb.checked = false);
    document.getElementById('fridgeResults').innerHTML = `
        <div class="fridge-empty-state">
            <span style="font-size:4rem;">🍳</span>
            <h3>재료를 선택해주세요</h3>
            <p>냉장고에 있는 재료를 체크하면<br>만들 수 있는 레시피를 추천해 드려요!</p>
        </div>
    `;
}

/* ===================================
   음식 퀴즈
   =================================== */
const quizQuestions = {
    easy: [
        { q: '된장찌개의 주요 장(醬) 재료는 무엇일까요?', options: ['된장', '고추장', '간장', '쌈장'], answer: 0, explanation: '된장찌개는 이름 그대로 된장으로 만듭니다.' },
        { q: '생일에 먹는 전통 음식은?', options: ['떡국', '미역국', '잡채', '삼계탕'], answer: 1, explanation: '생일에 미역국을 먹는 것은 산모가 미역국을 먹던 전통에서 유래했습니다.' },
        { q: '동지에 먹는 전통 음식은?', options: ['호박죽', '팥죽', '콩국수', '떡국'], answer: 1, explanation: '동지팥죽은 나쁜 기운을 물리친다고 전해집니다.' },
        { q: '김장의 주재료는?', options: ['무', '배추', '오이', '상추'], answer: 1, explanation: '배추김치가 김장의 기본이며, 무로 깍두기를 담그기도 합니다.' },
        { q: '비빔밥에 꼭 들어가는 양념장은?', options: ['된장', '간장', '고추장', '참기름'], answer: 2, explanation: '비빔밥의 핵심 양념은 고추장입니다.' },
        { q: '잡채에 사용하는 면의 종류는?', options: ['소면', '당면', '칼국수면', '라면'], answer: 1, explanation: '잡채에는 고구마 전분으로 만든 당면을 사용합니다.' },
        { q: '한식 육수의 기본 재료 조합은?', options: ['멸치+다시마', '소고기+무', '닭+양파', '새우+파'], answer: 0, explanation: '멸치와 다시마는 한식 육수의 기본 조합입니다.' },
        { q: '나물 무침에 빠지지 않는 양념은?', options: ['케첩', '마요네즈', '참기름', '식초'], answer: 2, explanation: '참기름은 나물 무침의 필수 양념입니다.' },
        { q: '여름 보양식으로 유명한 음식은?', options: ['떡국', '삼계탕', '김치찌개', '호박죽'], answer: 1, explanation: '복날에 삼계탕을 먹는 것은 한국의 오랜 전통입니다.' },
        { q: '설날에 먹는 전통 음식은?', options: ['미역국', '떡국', '팥죽', '삼계탕'], answer: 1, explanation: '설날 떡국을 먹으면 한 살 더 먹는다고 합니다.' }
    ],
    medium: [
        { q: '된장과 간장을 만들기 위해 먼저 만들어야 하는 것은?', options: ['누룩', '메주', '고추씨', '젓갈'], answer: 1, explanation: '메주를 소금물에 담가 발효시키면 간장과 된장이 분리됩니다.' },
        { q: '"곡우" 절기에 먹으면 좋은 음식은?', options: ['팥죽', '삼계탕', '봄나물 비빔밥', '김치찌개'], answer: 2, explanation: '곡우(4월 20일경) 전후로 봄나물이 가장 맛있습니다.' },
        { q: '호박죽을 만들 때 주로 사용하는 호박은?', options: ['애호박', '늙은 호박', '단호박', '주키니'], answer: 1, explanation: '전통 호박죽은 가을에 수확한 늙은 호박으로 만듭니다.' },
        { q: '김치찌개가 가장 맛있으려면 김치가 어때야 할까요?', options: ['새로 담근 김치', '잘 익은 김치', '얼린 김치', '물김치'], answer: 1, explanation: '충분히 발효된(익은) 김치로 끓여야 깊은 맛이 납니다.' },
        { q: '다시마로 육수를 낼 때 주의할 점은?', options: ['오래 끓여야 한다', '물이 끓기 전에 빼야 한다', '식초를 넣어야 한다', '기름에 볶아야 한다'], answer: 1, explanation: '다시마를 오래 끓이면 끈적해지고 쓴맛이 나므로, 끓기 직전에 빼야 합니다.' },
        { q: '참기름을 넣는 가장 좋은 타이밍은?', options: ['처음에', '중간에', '마지막에', '아무 때나'], answer: 2, explanation: '참기름은 가열하면 향이 날아가므로 마지막에 넣는 것이 좋습니다.' },
        { q: '동치미의 주재료는?', options: ['배추', '오이', '무', '열무'], answer: 2, explanation: '동치미는 무를 통째로 또는 적당한 크기로 넣어 담그는 물김치입니다.' },
        { q: '잡채를 만들 때 채소를 볶는 방법은?', options: ['모두 함께 볶는다', '재료별로 따로 볶는다', '한꺼번에 삶는다', '날것으로 섞는다'], answer: 1, explanation: '각 재료의 익는 시간이 다르므로 따로 볶아서 합치는 것이 정석입니다.' },
        { q: '콩국수의 국물을 만드는 기본 재료는?', options: ['두부', '검은콩', '백태(메주콩)', '팥'], answer: 2, explanation: '전통 콩국수는 백태(메주콩)를 불려 갈아서 만듭니다.' },
        { q: '미역국에 넣으면 안 되는 것은?', options: ['마늘', '파', '참기름', '된장'], answer: 1, explanation: '전통적으로 미역국에는 파를 넣지 않습니다. 미역의 맛이 가려지기 때문입니다.' }
    ],
    hard: [
        { q: '전통 간장 종류 중 "조선간장"의 특징은?', options: ['달다', '짠맛이 강하고 맑다', '검고 걸쭉하다', '매운맛이 있다'], answer: 1, explanation: '조선간장(국간장)은 짠맛이 강하고 색이 맑아 국물 요리에 적합합니다.' },
        { q: '김장을 담그는 전통적인 최적 시기는?', options: ['입동 전후', '추석 전후', '동지 전후', '소한 전후'], answer: 0, explanation: '입동(11월 7일경) 전후가 김장의 최적 시기로, 기온이 적당히 내려갈 때입니다.' },
        { q: '된장의 주요 영양 성분과 건강 효과는?', options: ['비타민C, 감기 예방', '이소플라본, 항암 효과', '철분, 빈혈 예방', '칼슘, 뼈 강화'], answer: 1, explanation: '된장에는 이소플라본 등 항암 물질이 풍부하다고 알려져 있습니다.' },
        { q: '한식에서 "오방색"에 해당하지 않는 색은?', options: ['빨강', '노랑', '보라', '검정'], answer: 2, explanation: '오방색은 청(파랑), 적(빨강), 황(노랑), 백(흰색), 흑(검정)입니다.' },
        { q: '"장독대"가 양지바른 곳에 놓이는 이유는?', options: ['미관을 위해', '발효를 위한 적절한 온도', '벌레를 막기 위해', '비를 피하기 위해'], answer: 1, explanation: '햇빛을 받아야 적절한 온도가 유지되어 발효가 잘 됩니다.' },
        { q: '전통 방식으로 멸치 육수를 낼 때, 쓴맛을 줄이는 방법은?', options: ['소금을 넣는다', '설탕을 넣는다', '머리와 내장을 제거한다', '식초를 넣는다'], answer: 2, explanation: '멸치의 머리와 내장에 쓴맛이 집중되어 있어 제거하면 맑은 육수가 됩니다.' },
        { q: '나물을 무칠 때 "숨을 죽인다"는 표현의 의미는?', options: ['소금에 절이는 것', '끓는 물에 살짝 데치는 것', '기름에 볶는 것', '냉동시키는 것'], answer: 1, explanation: '채소를 끓는 물에 살짝 데쳐 숨이 죽으면 무치기 좋고 양념이 잘 배입니다.' },
        { q: '전통 한식에서 "삼합"이라 불리는 조합은?', options: ['김치+밥+된장찌개', '돼지고기+김치+막걸리', '홍어+돼지고기+묵은김치', '밥+국+반찬'], answer: 2, explanation: '홍어삼합은 삭힌 홍어, 삶은 돼지고기, 묵은 김치를 함께 먹는 것입니다.' },
        { q: '고추장의 발효에 필요한 주요 원료가 아닌 것은?', options: ['찹쌀', '메줏가루', '고춧가루', '다시마'], answer: 3, explanation: '고추장은 찹쌀(또는 멥쌀), 메줏가루, 고춧가루, 소금으로 만듭니다.' },
        { q: '"약식동원(藥食同源)"의 뜻은?', options: ['약을 음식처럼 먹어야 한다', '약과 음식은 근원이 같다', '음식이 약보다 비싸다', '약은 빈속에 먹어야 한다'], answer: 1, explanation: '약식동원은 약과 음식의 근원이 같다는 뜻으로, 올바른 식사가 곧 건강의 기본이라는 철학입니다.' }
    ]
};

let quizState = {
    difficulty: 'medium',
    questions: [],
    currentIndex: 0,
    score: 0,
    answered: false
};

function startQuiz(difficulty) {
    quizState.difficulty = difficulty;
    quizState.questions = shuffleArray([...quizQuestions[difficulty]]).slice(0, 10);
    quizState.currentIndex = 0;
    quizState.score = 0;
    quizState.answered = false;

    document.getElementById('quizStart').style.display = 'none';
    document.getElementById('quizPlay').style.display = 'block';
    document.getElementById('quizResult').style.display = 'none';
    document.getElementById('quizTotal').textContent = quizState.questions.length;

    showQuestion();
}

function showQuestion() {
    const q = quizState.questions[quizState.currentIndex];
    quizState.answered = false;

    document.getElementById('quizCurrent').textContent = quizState.currentIndex + 1;
    document.getElementById('quizScoreLive').textContent = quizState.score;
    document.getElementById('quizProgressBar').style.width = `${((quizState.currentIndex) / quizState.questions.length) * 100}%`;
    document.getElementById('quizQuestion').textContent = q.q;
    document.getElementById('quizFeedback').style.display = 'none';

    const optionsDiv = document.getElementById('quizOptions');
    optionsDiv.innerHTML = q.options.map((opt, i) => `
        <button class="quiz-option" onclick="selectAnswer(${i})">${opt}</button>
    `).join('');
}

function selectAnswer(index) {
    if (quizState.answered) return;
    quizState.answered = true;

    const q = quizState.questions[quizState.currentIndex];
    const options = document.querySelectorAll('.quiz-option');

    options.forEach((opt, i) => {
        opt.classList.add('disabled');
        if (i === q.answer) opt.classList.add('correct');
        if (i === index && i !== q.answer) opt.classList.add('wrong');
    });

    const isCorrect = index === q.answer;
    if (isCorrect) quizState.score++;

    document.getElementById('quizScoreLive').textContent = quizState.score;

    const feedbackDiv = document.getElementById('quizFeedback');
    const feedbackText = document.getElementById('quizFeedbackText');
    feedbackText.textContent = (isCorrect ? '정답입니다! 👏 ' : '아쉽네요. 😅 ') + q.explanation;
    feedbackDiv.style.display = 'block';

    // 마지막 문제면 버튼 텍스트 변경
    if (quizState.currentIndex === quizState.questions.length - 1) {
        feedbackDiv.querySelector('button').textContent = '결과 보기';
    }
}

function nextQuestion() {
    quizState.currentIndex++;

    if (quizState.currentIndex >= quizState.questions.length) {
        showQuizResult();
        return;
    }

    showQuestion();
}

function showQuizResult() {
    document.getElementById('quizPlay').style.display = 'none';
    document.getElementById('quizResult').style.display = 'block';

    const score = quizState.score;
    const total = quizState.questions.length;
    const percentage = Math.round((score / total) * 100);

    let title, icon, message;

    if (percentage >= 90) {
        icon = '👩‍🍳'; title = '어머니의 수제자!';
        message = '대단해요! 어머니께서 보시면 정말 뿌듯해하실 거예요. 한국 음식에 대한 깊은 이해를 가지고 계시네요!';
    } else if (percentage >= 70) {
        icon = '🧑‍🍳'; title = '유능한 요리사!';
        message = '훌륭합니다! 한국 음식에 대해 많이 알고 계시네요. 조금만 더 공부하면 어머니의 수제자!';
    } else if (percentage >= 50) {
        icon = '🍳'; title = '요리 입문자!';
        message = '나쁘지 않아요! 한국 음식에 관심이 많으시군요. 레시피를 둘러보면서 더 배워보세요!';
    } else {
        icon = '📖'; title = '배움의 시작!';
        message = '괜찮아요! 모든 요리사도 처음엔 초보였답니다. 어머니의 레시피를 읽어보시면 금방 실력이 늘 거예요!';
    }

    document.getElementById('quizResultIcon').textContent = icon;
    document.getElementById('quizResultTitle').textContent = title;
    document.getElementById('quizResultScore').textContent = `${score} / ${total}점 (${percentage}%)`;
    document.getElementById('quizResultMessage').textContent = message;
}

function restartQuiz() {
    document.getElementById('quizStart').style.display = 'block';
    document.getElementById('quizPlay').style.display = 'none';
    document.getElementById('quizResult').style.display = 'none';
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

/* ===================================
   추억 방명록
   =================================== */
function initGuestbook() {
    const entriesDiv = document.getElementById('guestbookEntries');
    if (!entriesDiv) return;

    loadGuestbookEntries();

    // 첫 번째 이모지 선택
    const firstEmoji = document.querySelector('.emoji-btn');
    if (firstEmoji) firstEmoji.classList.add('selected');
}

function selectEmoji(btn) {
    document.querySelectorAll('.emoji-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    document.getElementById('gbEmoji').value = btn.dataset.emoji;
}

function submitGuestbook() {
    const name = document.getElementById('gbName').value.trim();
    const food = document.getElementById('gbFood').value.trim();
    const memory = document.getElementById('gbMemory').value.trim();
    const emoji = document.getElementById('gbEmoji').value;

    if (!name || !food || !memory) {
        alert('모든 항목을 입력해주세요.');
        return;
    }

    const entries = storage.get('guestbook') || [];
    entries.unshift({
        name, food, memory, emoji,
        date: new Date().toISOString()
    });
    storage.set('guestbook', entries);

    // 폼 초기화
    document.getElementById('gbName').value = '';
    document.getElementById('gbFood').value = '';
    document.getElementById('gbMemory').value = '';

    loadGuestbookEntries();
    alert('소중한 추억을 남겨주셔서 감사합니다! 💕');
}

function loadGuestbookEntries() {
    const entriesDiv = document.getElementById('guestbookEntries');
    const countSpan = document.getElementById('gbCount');
    if (!entriesDiv) return;

    const entries = storage.get('guestbook') || [];

    // 기본 샘플 데이터
    const sampleEntries = [
        { name: '그리운 아들', food: '김치찌개', memory: '대학 시절 자취방에서 어머니가 보내주신 김치로 끓여 먹던 김치찌개. 서툰 솜씨였지만, 그 김치 덕분에 버틸 수 있었습니다.', emoji: '🥲', date: '2026-01-15T09:00:00Z' },
        { name: '막내딸', food: '잡채', memory: '추석이면 새벽부터 잡채를 만드시는 어머니. 옆에서 당면을 몰래 집어 먹다 혼나던 기억이 세상에서 가장 행복한 추석 기억입니다.', emoji: '😊', date: '2026-01-10T12:00:00Z' },
        { name: '서울 살이', food: '미역국', memory: '생일마다 전화로 "미역국은 먹었니?" 하시는 어머니 목소리가 그립습니다. 올해도 혼자 끓여 먹었지만, 그 맛은 절대 안 나요.', emoji: '❤️', date: '2026-01-05T15:00:00Z' }
    ];

    const allEntries = [...entries, ...sampleEntries];

    if (countSpan) countSpan.textContent = allEntries.length;

    entriesDiv.innerHTML = allEntries.map(entry => {
        const date = new Date(entry.date);
        const dateStr = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;

        return `
            <div class="guestbook-entry">
                <div class="guestbook-entry-header">
                    <span class="guestbook-entry-name">${entry.emoji} ${escapeHtml(entry.name)}</span>
                    <span class="guestbook-entry-date">${dateStr}</span>
                </div>
                <div class="guestbook-entry-food">${escapeHtml(entry.food)}</div>
                <div class="guestbook-entry-memory">${escapeHtml(entry.memory)}</div>
            </div>
        `;
    }).join('');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
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
