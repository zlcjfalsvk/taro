/* ========================================
   타로 카드 가이드 - 앱 로직
   ======================================== */

(function() {
  'use strict';

  // DOM Elements
  const cardGrid = document.getElementById('cardGrid');
  const modalOverlay = document.getElementById('modalOverlay');
  const modalClose = document.getElementById('modalClose');
  const modalImg = document.getElementById('modalImg');
  const modalTitle = document.getElementById('modalTitle');
  const modalNumber = document.getElementById('modalNumber');
  const modalMobileTitle = document.getElementById('modalMobileTitle');
  const modalMobileNumber = document.getElementById('modalMobileNumber');
  const modalKeywords = document.getElementById('modalKeywords');
  const detailContent = document.getElementById('detailContent');
  const navTabs = document.querySelectorAll('.nav-tab');
  const subNav = document.querySelector('.sub-nav');
  const subTabs = document.querySelectorAll('.sub-tab');
  const detailTabsContainer = document.querySelector('.detail-tabs');

  // State
  let currentTab = 'major';
  let currentSuit = 'wands';
  let currentCard = null;
  let currentDetailTab = 'description';

  // ========================================
  // Card Rendering
  // ========================================

  function getFilteredCards() {
    if (currentTab === 'major') {
      return tarotCards.filter(c => c.type === 'major');
    }
    return tarotCards.filter(c => c.type === 'minor' && c.suit === currentSuit);
  }

  function renderCards() {
    const cards = getFilteredCards();
    cardGrid.innerHTML = '';

    cards.forEach(card => {
      const item = document.createElement('div');
      item.className = 'card-item';
      item.tabIndex = 0;
      item.setAttribute('role', 'gridcell');
      item.setAttribute('aria-label', `${card.nameKo} (${card.name})`);
      item.dataset.cardId = card.id;

      item.innerHTML = `
        <img src="${card.image}" alt="${card.nameKo}" loading="lazy">
        <div class="card-label">${card.nameKo}</div>
        <div class="card-label-en">${card.name}</div>
      `;

      // Click handler
      item.addEventListener('click', () => openModal(card));
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openModal(card);
        }
      });

      cardGrid.appendChild(item);
    });

    // Fade in animation
    cardGrid.classList.add('fade-in');
    setTimeout(() => cardGrid.classList.remove('fade-in'), 300);
  }

  // ========================================
  // Tab Navigation
  // ========================================

  navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      navTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      currentTab = tab.dataset.tab;

      if (currentTab === 'minor') {
        subNav.classList.add('visible');
      } else {
        subNav.classList.remove('visible');
      }

      renderCards();
    });
  });

  subTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      subTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      currentSuit = tab.dataset.suit;
      renderCards();
    });
  });

  // ========================================
  // Modal
  // ========================================

  function getCardDisplayNumber(card) {
    if (card.type === 'major') {
      return `메이저 아르카나 ${card.number}번`;
    }
    const suitNames = {
      wands: '완드',
      cups: '컵',
      swords: '소드',
      pentacles: '펜타클'
    };
    return `마이너 아르카나 - ${suitNames[card.suit] || card.suit}`;
  }

  function openModal(card) {
    currentCard = card;
    currentDetailTab = 'description';

    // Set image
    modalImg.src = card.image;
    modalImg.alt = card.nameKo;

    // Set titles
    const titleText = `${card.nameKo} (${card.name})`;
    const numberText = getCardDisplayNumber(card);
    modalTitle.textContent = titleText;
    modalNumber.textContent = numberText;
    modalMobileTitle.textContent = titleText;
    modalMobileNumber.textContent = numberText;

    // Set keywords
    modalKeywords.innerHTML = card.keywords
      .map(kw => `<span class="keyword-tag">${kw}</span>`)
      .join('');

    // Set detail tabs active state
    detailTabsContainer.querySelectorAll('.detail-tab').forEach(t => {
      t.classList.remove('active');
      if (t.dataset.detail === 'description') t.classList.add('active');
    });

    // Render description tab
    renderDetailPanel('description');

    // Show modal
    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';

    // Focus trap
    modalClose.focus();
  }

  function closeModal() {
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
    currentCard = null;

    // Return focus to the card that opened the modal
    const activeCard = document.querySelector('.card-item:focus, .card-item:hover');
    if (activeCard) activeCard.focus();
  }

  modalClose.addEventListener('click', closeModal);

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });

  // Keyboard: ESC to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('open')) {
      closeModal();
    }
  });

  // ========================================
  // Detail Tabs
  // ========================================

  detailTabsContainer.addEventListener('click', (e) => {
    const tab = e.target.closest('.detail-tab');
    if (!tab) return;

    detailTabsContainer.querySelectorAll('.detail-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    currentDetailTab = tab.dataset.detail;
    renderDetailPanel(currentDetailTab);
  });

  function renderDetailPanel(tabName) {
    if (!currentCard) return;

    let html = '';

    if (tabName === 'description') {
      html = renderDescriptionPanel(currentCard);
    } else if (tabName === 'yesOrNo') {
      html = renderYesOrNoPanel(currentCard);
    } else {
      html = renderSituationPanel(currentCard, tabName);
    }

    detailContent.innerHTML = html;
    detailContent.scrollTop = 0;
  }

  function renderDescriptionPanel(card) {
    return `
      <div class="detail-panel active">
        <div class="card-description">${card.description}</div>
        <div class="meaning-section upright">
          <h4>▲ 정방향</h4>
          <p>${card.upright}</p>
        </div>
        <div class="meaning-section reversed">
          <h4>▼ 역방향</h4>
          <p>${card.reversed}</p>
        </div>
      </div>
    `;
  }

  function renderSituationPanel(card, situation) {
    const situationData = card.situations[situation];
    if (!situationData) return '<div class="detail-panel active"><p>데이터가 없습니다.</p></div>';

    const titles = {
      love: '❤️ 사랑 & 관계',
      career: '💼 직업 & 커리어',
      finance: '💰 금전 & 재정',
      health: '🏥 건강',
      creativity: '🎨 창작 & 예술'
    };

    return `
      <div class="detail-panel active">
        <h3>${titles[situation] || situation}</h3>
        <div class="meaning-section upright">
          <h4>▲ 정방향</h4>
          <p>${situationData.upright}</p>
        </div>
        <div class="meaning-section reversed">
          <h4>▼ 역방향</h4>
          <p>${situationData.reversed}</p>
        </div>
      </div>
    `;
  }

  function renderYesOrNoPanel(card) {
    const yesOrNo = card.situations.yesOrNo || '정보 없음';

    return `
      <div class="detail-panel active">
        <div class="yes-or-no">
          <div class="explanation">${yesOrNo}</div>
        </div>
      </div>
    `;
  }

  // ========================================
  // Initialize
  // ========================================

  renderCards();

})();
