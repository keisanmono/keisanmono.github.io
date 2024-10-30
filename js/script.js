let currentPage = 1; // 当前页码
const totalPages = 10; // 总页数（根据您的内容数量进行调整）

// 获取当前页码（在每个页面中都应指定）
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.has('page')) {
    currentPage = parseInt(urlParams.get('page'), 10);
}

function updatePagination() {
    // 更新分页按钮的显示状态
    document.getElementById('prevBtn').style.display = currentPage === 1 ? 'none' : 'inline-block';
    document.getElementById('nextBtn').style.display = currentPage === totalPages ? 'none' : 'inline-block';

    // 更新页码按钮的显示
    const pageButtonsContainer = document.getElementById('pageButtons');
    pageButtonsContainer.innerHTML = ''; // 清空当前页码按钮

    // 计算显示的页码范围
    const startPage = Math.max(1, currentPage - 5); // 起始页码
    const endPage = Math.min(totalPages, currentPage + 5); // 结束页码

    // 添加前面的页码
    for (let i = startPage; i <= endPage; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.onclick = () => goToPage(i);
        pageButton.className = currentPage === i ? 'active' : ''; // 当前页高亮
        pageButtonsContainer.appendChild(pageButton);
    }

    // 如果起始页码大于1，显示省略号
    if (startPage > 1) {
        const ellipsis = document.createElement('span');
        ellipsis.textContent = '...'; // 省略号
        pageButtonsContainer.insertBefore(ellipsis, pageButtonsContainer.firstChild);
        // 添加第一页按钮
        const firstPageButton = document.createElement('button');
        firstPageButton.textContent = 1;
        firstPageButton.onclick = () => goToPage(1);
        pageButtonsContainer.insertBefore(firstPageButton, ellipsis);
    }

    // 如果结束页码小于总页数，显示省略号
    if (endPage < totalPages) {
        const ellipsis = document.createElement('span');
        ellipsis.textContent = '...'; // 省略号
        pageButtonsContainer.appendChild(ellipsis);
        // 添加最后一页按钮
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
    window.location.href = `blog_page${currentPage}.html?page=${currentPage}`; // 根据页面命名方式调整
}

// 跳转到指定页码
function goToPage(pageNumber) {
    currentPage = pageNumber;
    navigateToPage();
}

// 初始化时更新按钮状态
document.addEventListener('DOMContentLoaded', function () {
    updatePagination();
});

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const toggleButton = document.getElementById('toggle-btn');

    // 切换侧边栏的折叠状态
    sidebar.classList.toggle('collapsed');

    // 更新按钮的文本和样式
    if (sidebar.classList.contains('collapsed')) {
        toggleButton.textContent = '▶'; // 使用右箭头表示折叠
        toggleButton.classList.add('collapsed'); // 添加折叠类
    } else {
        toggleButton.textContent = '☰'; // 使用左箭头表示展开
        toggleButton.classList.remove('collapsed'); // 移除折叠类
    }
}
let copied = false; // 标记是否已复制

function copyCode(event) {
    event.preventDefault(); // 防止页面跳动
    const codeElement = document.querySelector('.post-code code');
    const button = document.querySelector('.copy-button');

    // 使用 Clipboard API 进行复制
    navigator.clipboard.writeText(codeElement.innerText).then(() => {
        if (!copied) {
            // 如果未复制，显示已复制提示
            button.innerHTML = '✔️ 已复制！'; // 修改按钮文本
            copied = true; // 设置已复制标记

            // 设定 2 秒后恢复原状
            setTimeout(() => {
                button.innerHTML = '复制代码'; // 恢复按钮文本
                copied = false; // 重置已复制标记
            }, 2000);
        }
    }).catch((err) => {
        console.error('复制失败：', err);
    });
}


function clearSearch() {
    const searchInput = document.getElementById('search');
    searchInput.value = ''; // 清空搜索框
    searchPosts(); // 调用搜索功能以更新显示
}

// 等待文档加载完成后再添加事件监听
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('toggle-btn').addEventListener('click', toggleSidebar);
    changeBackground(); // 确保初始背景在文档加载后运行
    setInterval(changeBackground, 5000); // 每5秒切换一次背景
});

// 背景图片路径数组
const images = [
    'images/background1.jpg',
    'images/background2.jpg',
    'images/background3.jpg',
    'images/background4.jpg'
];

// 随机打乱数组的函数
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// 随机打乱图片顺序
shuffle(images);

let currentIndex = 0; // 当前显示的图片索引
const backgroundElement = document.querySelector('.background');

// 定义切换背景函数
function changeBackground() {
    // 设置当前背景为不透明
    backgroundElement.style.opacity = 1; 

    // 设置下一张背景图片
    backgroundElement.style.backgroundImage = `url(${images[currentIndex]})`;
  
    // 淡出和淡入效果
    backgroundElement.style.transition = 'opacity 1s ease'; // 设置过渡效果

    // 使用 setTimeout 创建淡出效果
    setTimeout(() => {
        backgroundElement.style.opacity = 0; // 先淡出
    }, 1000); // 在1秒后开始淡出

    // 计算下一张背景的索引
    currentIndex = (currentIndex + 1) % images.length; 

    // 在淡出后设置新背景，并恢复不透明
    setTimeout(() => {
        backgroundElement.style.backgroundImage = `url(${images[currentIndex]})`; // 切换背景
        backgroundElement.style.opacity = 1; // 然后淡入
    }, 2000); // 2秒后切换新背景（1秒淡出 + 1秒停顿）
}

// 初始显示第一张图片
backgroundElement.style.backgroundImage = `url(${images[currentIndex]})`;



