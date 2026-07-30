/**
 * Travel Log Website - Interactive Application Logic
 * Architecture: Data-Driven Dynamic Rendering from data/stories.json
 * Supports Bilingual Language Switching (ZH/EN), Category Filtering, & Lightbox Modal
 */

document.addEventListener('DOMContentLoaded', () => {
  let currentLang = 'zh';
  let currentFilter = 'all';
  let stories = [];
  let currentActiveStory = null;

  const waterfallContainer = document.getElementById('travel-waterfall');
  const modal = document.getElementById('lightbox-modal');
  const modalImg = document.getElementById('modal-img');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');
  const modalBadge = document.getElementById('modal-badge');
  const modalLocation = document.getElementById('modal-location');
  const modalDate = document.getElementById('modal-date');
  const modalClose = document.getElementById('modal-close');

  // Fallback initial dataset (used if fetch fails or running via file://)
  const fallbackStories = [
    {
      "id": "tianjin-beichen-2026",
      "category": "mainland",
      "badge": "内地 · Mainland",
      "date": "2026.07",
      "img": "assets/stories/tianjin-beichen-2026.jpg",
      "title": { "zh": "北辰 · 柳荫雨后的夏日街角", "en": "Beichen · Summer Corner Beneath Willows After Rain" },
      "desc": { "zh": "七月的北辰，骤雨初歇。垂柳如帘，在逆光中投下斑驳光影，湿漉漉的柏油路面映着天光云影。一辆金色轿车驶过泛光的路面，电动车静静停靠在树旁，空气中弥漫着雨后泥土与树叶的清冽气息，夏日的燥热被一场雨轻轻洗去。", "en": "A summer downpour has just subsided in Beichen. Weeping willow branches curtain the scene, dappled backlight filtering through as wet asphalt mirrors the sky above. A golden sedan glides across the glistening road while an e-bike rests beside the tree, the air crisp with the scent of rain-soaked earth and foliage, summer's heat gently washed away." },
      "location": { "zh": "📍 天津 · 北辰区", "en": "📍 Beichen District, Tianjin" }
    },
    {
      "id": "tibet-sogxian-valley-2025",
      "category": "tibet",
      "badge": "藏地 · Tibet",
      "date": "2025.07",
      "img": "assets/stories/tibet-nagqu-suo-1.jpg",
      "title": { "zh": "索县 · 藏东翠谷与冰川河畔", "en": "Sog County · Emerald Valley & Glacial River in Eastern Tibet" },
      "desc": { "zh": "七月的索县，藏东峡谷满目苍翠。云杉覆满陡峭山坡，青稞田在谷中铺成层层绿毯，赭色的冰川融水河奔腾而过。河滩碎石上几只黑鸟驻足停歇，坡上藏式小屋静静伫立在白云蓝天之下，时光仿佛在此刻凝固。", "en": "July in Sog County, where eastern Tibet's gorges burst with vivid green. Spruce forests cloak the steep slopes while highland barley fields terrace the valley in emerald layers, the ochre glacial melt river rushing past. Black birds pause on the gravel shore as a Tibetan homestead rests beneath towering cumulus clouds, time standing still in this highland sanctuary." },
      "location": { "zh": "🏔️ 西藏 · 那曲索县", "en": "🏔️ Sog County, Nagqu, Tibet" }
    },
    {
      "id": "tibet-sogxian-eagle-2025",
      "category": "tibet",
      "badge": "藏地 · Tibet",
      "date": "2025.07",
      "img": "assets/stories/tibet-nagqu-suo-2.jpg",
      "title": { "zh": "索县 · 苍穹之上的高原神鹰", "en": "Sog County · Raptor Soaring the High Plateau Sky" },
      "desc": { "zh": "索县的天蓝得像一面倒置的深海，几缕流云在天际悠然舒展。一只雄鹰展开双翼在高空盘旋，深色剪影映在蓝宝石般的苍穹上，仿佛是这片高原天空真正的主人。海拔四千多米的藏北大地，仰望苍穹间，心也随它一同翱翔。", "en": "The sky over Sog County is an inverted ocean of sapphire, streaked with drifting wisps of cloud. An eagle circles high above with wings fully spread, its dark silhouette etched against the azure as if it were sovereign of these plateau heavens. At over 4,000 meters on the northern Tibetan plateau, gazing upward sends the heart soaring alongside it." },
      "location": { "zh": "🦅 西藏 · 那曲索县", "en": "🦅 Sog County, Nagqu, Tibet" }
    }
  ];

  // 1. Fetch JSON Data & Render Waterfall
  async function loadStoriesData() {
    try {
      const response = await fetch('data/stories.json');
      if (!response.ok) throw new Error('Failed to load JSON');
      stories = await response.json();
    } catch (err) {
      console.warn('Loading fallback stories data:', err);
      stories = fallbackStories;
    }
    renderWaterfall();
  }

  // Render Waterfall Stream Cards from Data
  function renderWaterfall() {
    if (!waterfallContainer) return;
    waterfallContainer.innerHTML = '';

    stories.forEach(story => {
      const isVisible = currentFilter === 'all' || story.category === currentFilter;
      const article = document.createElement('article');
      article.className = 'waterfall-item';
      article.setAttribute('data-category', story.category);
      article.style.display = isVisible ? 'block' : 'none';

      const titleText = story.title[currentLang] || story.title['zh'];
      const hintText = currentLang === 'zh' ? '点击展开图文 ➔' : 'View Story ➔';

      article.innerHTML = `
        <div class="waterfall-card">
          <img src="${story.img}" alt="${titleText}" class="waterfall-img" loading="lazy">
          <div class="waterfall-overlay">
            <div class="waterfall-badge-row">
              <span class="badge-pill">${story.badge}</span>
              <span class="waterfall-date">${story.date}</span>
            </div>
            <div class="waterfall-info">
              <h3>${titleText}</h3>
              <span class="waterfall-hint">${hintText}</span>
            </div>
          </div>
        </div>
      `;

      article.querySelector('.waterfall-card').addEventListener('click', () => {
        openModal(story);
      });

      waterfallContainer.appendChild(article);
    });
  }

  // Open Lightbox Modal for a Story
  function openModal(story) {
    if (!modal || !modalImg) return;
    currentActiveStory = story;

    modalImg.src = story.img;
    modalImg.alt = story.title[currentLang] || story.title['zh'];
    modalTitle.innerHTML = story.title[currentLang] || story.title['zh'];
    modalDesc.innerHTML = story.desc[currentLang] || story.desc['zh'];
    modalBadge.innerHTML = story.badge;
    modalLocation.innerHTML = story.location[currentLang] || story.location['zh'];
    modalDate.innerHTML = story.date;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
      currentActiveStory = null;
    }
  }

  // 2. Language Toggle Logic
  const langToggleBtn = document.getElementById('lang-toggle-btn');
  const langZhSpan = document.getElementById('lang-zh');
  const langEnSpan = document.getElementById('lang-en');

  if (langToggleBtn) {
    langToggleBtn.addEventListener('click', () => {
      currentLang = currentLang === 'zh' ? 'en' : 'zh';
      document.documentElement.lang = currentLang === 'zh' ? 'zh-CN' : 'en';

      if (currentLang === 'zh') {
        langZhSpan.classList.add('active');
        langEnSpan.classList.remove('active');
      } else {
        langEnSpan.classList.add('active');
        langZhSpan.classList.remove('active');
      }

      // Update static translatable elements
      document.querySelectorAll('[data-zh][data-en]').forEach(el => {
        const text = el.getAttribute(`data-${currentLang}`);
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = text;
        } else {
          el.innerHTML = text;
        }
      });

      // Re-render dynamic waterfall stream & active modal if open
      renderWaterfall();
      if (currentActiveStory && modal && modal.classList.contains('active')) {
        openModal(currentActiveStory);
      }
    });
  }

  // 3. Category Tab Filtering
  const categoryTabs = document.querySelectorAll('.category-tab');
  categoryTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      categoryTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      currentFilter = tab.getAttribute('data-filter');

      const items = document.querySelectorAll('.waterfall-item');
      items.forEach(item => {
        const category = item.getAttribute('data-category');
        if (currentFilter === 'all' || category === currentFilter) {
          item.style.display = 'block';
          item.style.animation = 'fadeIn 0.4s ease';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // Modal Event Listeners
  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) closeModal();
  });

  // 4. Mobile Navigation Menu Toggle
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      const isExpanded = navLinks.style.display === 'flex';
      navLinks.style.display = isExpanded ? 'none' : 'flex';
      if (!isExpanded) {
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '64px';
        navLinks.style.left = '0';
        navLinks.style.width = '100%';
        navLinks.style.backgroundColor = 'var(--color-canvas)';
        navLinks.style.padding = '16px';
        navLinks.style.borderBottom = '1px solid var(--color-hairline)';
      }
    });
  }

  // Initial Load
  loadStoriesData();
});

// Keyframe animation for category filter
const style = document.createElement('style');
style.innerHTML = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
`;
document.head.appendChild(style);
