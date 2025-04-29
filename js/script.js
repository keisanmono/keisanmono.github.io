let currentPage = 1; // 当前页码
const totalPages = 5; // 总页数（假设有5页博客列表）

// 获取当前页码（在每个页面中都应指定）
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.has('page')) {
    currentPage = parseInt(urlParams.get('page'), 10) || 1; // 加上 fallback
}

function updatePagination() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const pageButtonsContainer = document.getElementById('pageButtons');

    if (!prevBtn || !nextBtn || !pageButtonsContainer) return; // 如果元素不存在则退出

    // 更新上一页/下一页按钮的可用状态
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;

    pageButtonsContainer.innerHTML = ''; // 清空当前页码按钮

    const maxVisiblePages = 5; // 最多显示多少个页码按钮（不含省略号）
    let startPage, endPage;

    if (totalPages <= maxVisiblePages) {
        // 总页数不多，全部显示
        startPage = 1;
        endPage = totalPages;
    } else {
        // 总页数较多，需要计算显示范围
        const maxPagesBeforeCurrent = Math.floor((maxVisiblePages - 1) / 2);
        const maxPagesAfterCurrent = Math.ceil((maxVisiblePages - 1) / 2);

        if (currentPage <= maxPagesBeforeCurrent + 1) {
            // 靠近第一页
            startPage = 1;
            endPage = maxVisiblePages;
        } else if (currentPage >= totalPages - maxPagesAfterCurrent) {
            // 靠近最后一页
            startPage = totalPages - maxVisiblePages + 1;
            endPage = totalPages;
        } else {
            // 在中间
            startPage = currentPage - maxPagesBeforeCurrent;
            endPage = currentPage + maxPagesAfterCurrent;
        }
    }

    // 添加第一页和前面的省略号
    if (startPage > 1) {
        const firstPageButton = document.createElement('button');
        firstPageButton.textContent = 1;
        firstPageButton.onclick = () => goToPage(1);
        pageButtonsContainer.appendChild(firstPageButton);
        if (startPage > 2) {
            const ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            ellipsis.className = 'pagination-ellipsis'; // 添加class以便样式化
            pageButtonsContainer.appendChild(ellipsis);
        }
    }

    // 添加中间的页码
    for (let i = startPage; i <= endPage; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.onclick = () => goToPage(i);
        if (currentPage === i) {
            pageButton.className = 'active'; // 当前页高亮
        }
        pageButtonsContainer.appendChild(pageButton);
    }

    // 添加后面的省略号和最后一页
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            const ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            ellipsis.className = 'pagination-ellipsis'; // 添加class以便样式化
            pageButtonsContainer.appendChild(ellipsis);
        }
        const lastPageButton = document.createElement('button');
        lastPageButton.textContent = totalPages;
        lastPageButton.onclick = () => goToPage(totalPages);
        pageButtonsContainer.appendChild(lastPageButton);
    }
}

// 上一页功能
function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        navigateToPage();
    }
}

// 下一页功能
function nextPage() {
    if (currentPage < totalPages) {
        currentPage++;
        navigateToPage();
    }
}

// 导航到相应页面
function navigateToPage() {
    // 确保 currentPage 是有效数字
    if (isNaN(currentPage) || currentPage < 1) currentPage = 1;
    if (currentPage > totalPages) currentPage = totalPages;
    window.location.href = `blog_page${currentPage}.html?page=${currentPage}`;
}

// 跳转到指定页码
function goToPage(pageNumber) {
    currentPage = pageNumber;
    navigateToPage();
}

// 切换侧边栏
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const toggleButton = document.getElementById('toggle-btn');

    if (!sidebar || !toggleButton) return; // 确保元素存在

    // 切换侧边栏的折叠状态
    sidebar.classList.toggle('collapsed');

    // 更新按钮的图标和样式
    const isCollapsed = sidebar.classList.contains('collapsed');
    const isMobile = window.innerWidth <= 800; // Check if we are in mobile view

    if (isCollapsed) {
        toggleButton.textContent = '☰'; // Show hamburger when sidebar is closed/collapsed
        toggleButton.classList.remove('toggle-btn-shifted'); // Remove the shifted class
        toggleButton.style.transform = 'rotate(0deg)'; // Reset rotation
        // Optional: Remove focus to prevent staying active after closing
        toggleButton.blur();
    } else {
        toggleButton.textContent = '✕'; // Show 'X' (close icon) when sidebar is open
        if (isMobile) {
            // Only shift the button on mobile view when opening
            toggleButton.classList.add('toggle-btn-shifted');
            toggleButton.style.transform = 'rotate(180deg)'; // Rotate 'X'
        } else {
            // On desktop, ensure it's not shifted and rotation is reset
            toggleButton.classList.remove('toggle-btn-shifted');
            toggleButton.style.transform = 'rotate(0deg)';
            // Keep '✕' icon on desktop when open? Or change back? Let's keep X for now.
        }
    }
}

// 复制代码功能优化
function copyCode(event) {
    const button = event.target; // 获取触发事件的按钮
    const codeElement = button.closest('.post-code')?.querySelector('code'); // 找到最近的代码元素

    if (!codeElement || !navigator.clipboard) {
        console.error("无法找到代码元素或浏览器不支持 Clipboard API");
        button.textContent = '复制失败';
        setTimeout(() => { button.textContent = '复制代码'; }, 2000);
        return;
    }

    const originalText = button.textContent;
    const originalClass = button.className;

    navigator.clipboard.writeText(codeElement.innerText).then(() => {
        button.textContent = '✔️ 已复制!';
        button.classList.add('copied'); // 添加成功样式

        // 设定 2 秒后恢复原状
        setTimeout(() => {
            button.textContent = originalText;
            button.classList.remove('copied'); // 移除成功样式
        }, 2000);
    }).catch((err) => {
        console.error('复制失败：', err);
        button.textContent = '复制出错';
        setTimeout(() => { button.textContent = originalText; }, 2000);
    });
}


// 清空搜索框
function clearSearch() {
    const searchInput = document.getElementById('search');
    if (searchInput) {
        searchInput.value = '';
        // 如果有搜索功能，在这里调用 searchPosts();
    }
}

// 搜索功能 (简单示例，仅隐藏/显示文章项)
function searchPosts() {
    const searchTerm = document.getElementById('search')?.value.toLowerCase();
    const posts = document.querySelectorAll('#posts-container .post-item, #latest-posts .post-preview'); // 同时搜索博客页和首页

    if (!posts.length) return;

    posts.forEach(post => {
        const titleElement = post.querySelector('h2 a, h3 a'); // 查找标题链接
        const title = titleElement ? titleElement.textContent.toLowerCase() : '';
        const contentElement = post.querySelector('p'); // 查找内容段落
        const content = contentElement ? contentElement.textContent.toLowerCase() : '';

        if (title.includes(searchTerm) || content.includes(searchTerm)) {
            post.style.display = 'flex'; // 或 'block' 根据布局
        } else {
            post.style.display = 'none';
        }
    });
}

// 背景图片轮播
const backgroundElement = document.querySelector('.background');
let bgImages = []; // 将在下面生成
let currentBgIndex = 0;

// 定义切换背景函数
function changeBackground() {
    if (!backgroundElement || bgImages.length === 0) return;

    // 计算下一张背景的索引
    currentBgIndex = (currentBgIndex + 1) % bgImages.length;

    // 1. 创建一个新的 div 用于加载新背景图，并设置淡入效果
    const nextBackground = document.createElement('div');
    nextBackground.classList.add('background-next'); // 可以添加样式
    nextBackground.style.position = 'fixed';
    nextBackground.style.top = '0';
    nextBackground.style.left = '0';
    nextBackground.style.width = '100%';
    nextBackground.style.height = '100%';
    nextBackground.style.zIndex = '-1'; // 确保在当前背景之下
    nextBackground.style.backgroundSize = 'cover';
    nextBackground.style.backgroundPosition = 'center';
    nextBackground.style.backgroundImage = `url(${bgImages[currentBgIndex]})`;
    nextBackground.style.opacity = '0'; // 初始透明
    nextBackground.style.transition = 'opacity 1s ease-in-out';
    nextBackground.style.filter = 'blur(2px) brightness(0.9)'; // 应用和主背景一样的滤镜

    document.body.insertBefore(nextBackground, backgroundElement);

    // 2. 等待新图片加载（或设置一个延迟），然后开始淡入新背景，同时淡出旧背景
    setTimeout(() => {
        nextBackground.style.opacity = '0.7'; // 新背景淡入
        backgroundElement.style.opacity = '0'; // 旧背景淡出
    }, 100); // 短暂延迟确保元素已插入DOM

    // 3. 过渡完成后，将新背景设为主背景，并移除旧背景元素
    setTimeout(() => {
        backgroundElement.style.backgroundImage = `url(${bgImages[currentBgIndex]})`;
        backgroundElement.style.opacity = '0.7'; // 恢复主背景不透明度
        if (nextBackground.parentNode) {
            nextBackground.parentNode.removeChild(nextBackground); // 移除临时背景
        }
    }, 1100); // 等待淡入淡出完成 (100ms + 1000ms)
}

// --- 粒子效果JS ---
function createParticles() {
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles';
    document.body.appendChild(particlesContainer);
    const numParticles = 50; // 粒子数量

    for (let i = 0; i < numParticles; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        const size = Math.random() * 5 + 2; // 粒子大小 2px - 7px
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${Math.random() * 100}%`; // 随机水平位置
        particle.style.bottom = `${Math.random() * -20 - 10}%`; // 从屏幕下方稍外侧开始
        particle.style.animationDuration = `${Math.random() * 10 + 15}s`; // 动画时长 15s - 25s
        particle.style.animationDelay = `${Math.random() * 10}s`; // 随机延迟开始
        particle.style.setProperty('--drift', `${(Math.random() - 0.5) * 100}px`); // 设置随机水平漂移

        // 添加不同形状或颜色（可选）
         if (Math.random() > 0.7) {
             particle.style.background = 'rgba(255, 192, 203, 0.7)'; // 添加一些粉色粒子
             particle.style.borderRadius = '30% 70% 70% 30% / 30% 30% 70% 70%'; // 类似花瓣
         } else if (Math.random() > 0.8) {
              particle.style.background = 'rgba(135, 206, 250, 0.7)'; // 添加一些蓝色粒子
         }

        particlesContainer.appendChild(particle);
    }
}


// DOMContentLoaded 事件监听器
document.addEventListener('DOMContentLoaded', function () {
    // --- ADDED/MODIFIED CODE --- //
    const toggleBtn = document.getElementById('toggle-btn');
    const sidebar = document.getElementById('sidebar'); // Get sidebar reference

    // Check initial screen width for sidebar state
    const isMobile = window.innerWidth <= 800; // Match the CSS breakpoint

    if (toggleBtn && sidebar) { // Ensure both exist
        // Set initial state based on screen size and whether sidebar starts collapsed
        if (isMobile) {
            // Ensure it starts collapsed and button is NOT shifted
            if (!sidebar.classList.contains('collapsed')) {
                sidebar.classList.add('collapsed'); // Force collapse if not already
            }
            toggleBtn.classList.remove('toggle-btn-shifted'); // Ensure no shift initially
            toggleBtn.textContent = '☰'; // Hamburger for closed state
            toggleBtn.style.transform = 'rotate(0deg)'; // Reset rotation
        } else {
            // Desktop initial state
            sidebar.classList.remove('toggle-btn-shifted'); // Should never be shifted on desktop
            toggleBtn.textContent = sidebar.classList.contains('collapsed') ? '☰' : '✕'; // Icon depends on initial state
            toggleBtn.style.transform = 'rotate(0deg)';
        }
        // Add listener AFTER setting initial state
        toggleBtn.addEventListener('click', toggleSidebar);
    }
    // --- END of ADDED/MODIFIED CODE --- //

     // --- 图片生成和背景初始化 ---
    // 计算背景图尺寸 (16:9 示例)
    const max_pixel_bg = 1024 * 1024;
    const w_bg = 16, h_bg = 9;
    const width_bg = Math.round(Math.sqrt(max_pixel_bg * w_bg / h_bg) / 8) * 8;
    const height_bg = Math.round(Math.sqrt(max_pixel_bg * h_bg / w_bg) / 8) * 8; // 1024x576

    // 生成背景图片 URL 列表
    bgImages = [
        `https://image.pollinations.ai/prompt/anime%20scenery,%20dreamy%20pastel%20sky,%20floating%20islands,%20cherry%20blossoms%20falling,%20highly%20detailed%20illustration,%20cinematic%20lighting?width=${width_bg}&height=${height_bg}&seed=${Math.random() * 1000000}&model=flux&nologo=true`,
        `https://image.pollinations.ai/prompt/anime%20style,%20magical%20forest%20at%20night,%20glowing%20mushrooms,%20fireflies,%20mystical%20atmosphere,%20vibrant%20colors,%20fantasy%20art?width=${width_bg}&height=${height_bg}&seed=${Math.random() * 1000000}&model=flux&nologo=true`,
        `https://image.pollinations.ai/prompt/anime%20cityscape%20at%20sunset,%20vaporwave%20aesthetic,%20neon%20lights,%20reflective%20streets,%20beautiful%20detailed%20sky,%208k?width=${width_bg}&height=${height_bg}&seed=${Math.random() * 1000000}&model=flux&nologo=true`,
        `https://image.pollinations.ai/prompt/anime%20girl%20standing%20on%20a%20cliff,%20overlooking%20a%20vast%20ocean,%20windy%20day,%20dynamic%20clouds,%20emotional%20scene,%20studio%20ghibli%20style?width=${width_bg}&height=${height_bg}&seed=${Math.random() * 1000000}&model=flux&nologo=true`
    ];

    // 初始显示第一张背景
    if (backgroundElement && bgImages.length > 0) {
         backgroundElement.style.backgroundImage = `url(${bgImages[0]})`;
         backgroundElement.style.opacity = 0.7; // 初始透明度
         setInterval(changeBackground, 7000); // 每7秒切换一次背景
    }
    // --- 背景初始化结束 ---

    updatePagination(); // 初始化分页按钮状态

    // 搜索框输入事件
    const searchInput = document.getElementById('search');
    if (searchInput) {
        searchInput.addEventListener('input', searchPosts);
    }

    // 添加代码块复制按钮的事件监听 (使用事件委托)
    const contentArea = document.querySelector('.content');
    if (contentArea) {
        contentArea.addEventListener('click', function(event) {
            if (event.target.classList.contains('copy-button')) {
                copyCode(event);
            }
        });
    }

    // 创建粒子效果
    createParticles();

    // 如果使用了 highlight.js, 初始化它
    if (typeof hljs !== 'undefined') {
        hljs.highlightAll();
    } else {
        // 如果没有全局引入hljs，尝试在代码块内部初始化
        document.querySelectorAll('pre code').forEach((block) => {
             if (typeof hljs !== 'undefined') { // 再次检查，可能异步加载
                hljs.highlightElement(block);
             }
        });
    }

});