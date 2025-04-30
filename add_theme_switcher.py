import os
import re

# --- 配置 ---
website_root = 'C://Users//mlfls//keisanmono.github.io'  # 当前目录，如果脚本不在项目根目录，请修改为项目根目录的路径
html_snippet_to_add = """
        <!-- Theme Switcher Added Here -->
        <div class="theme-switcher">
            <h4>切换主题:</h4>
            <div class="theme-buttons-container">
                <button data-theme="pastel" class="theme-button">🌸 粉彩梦境</button>
                <button data-theme="dark" class="theme-button">🌙 午夜樱落</button>
                <!-- Add more buttons here if you create more themes -->
            </div>
        </div>
        <!-- End of Theme Switcher -->"""
insertion_marker = '</nav>' # 在这个标记后面插入
sidebar_start_marker = '<div id="sidebar">' # 确保在 sidebar div 内部
sidebar_end_marker = '</div>' # 侧边栏 div 的结束标记
theme_switcher_check = 'class="theme-switcher"' # 用于检查是否已添加

# --- 脚本逻辑 ---
count_modified = 0
count_skipped_no_sidebar = 0
count_skipped_no_marker = 0
count_skipped_already_added = 0
count_errors = 0

print("开始处理 HTML 文件...")

for subdir, dirs, files in os.walk(website_root):
    for filename in files:
        if filename.lower().endswith('.html'):
            filepath = os.path.join(subdir, filename)
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()

                # 1. 检查是否已经添加过
                if theme_switcher_check in content:
                    print(f"跳过 (已添加): {filepath}")
                    count_skipped_already_added += 1
                    continue

                # 2. 查找侧边栏 div 的范围
                sidebar_start_index = content.find(sidebar_start_marker)
                if sidebar_start_index == -1:
                    print(f"跳过 (无侧边栏): {filepath}")
                    count_skipped_no_sidebar += 1
                    continue

                # 在侧边栏开始后查找侧边栏的结束位置
                # Be careful with nested divs, find the correct closing div for #sidebar
                # This is a simplified approach, might fail with complex nesting
                temp_content_after_sidebar_start = content[sidebar_start_index + len(sidebar_start_marker):]
                nesting_level = 0
                sidebar_end_relative_index = -1
                for i, char in enumerate(temp_content_after_sidebar_start):
                    if temp_content_after_sidebar_start[i:i+len('<div')] == '<div':
                         nesting_level += 1
                    elif temp_content_after_sidebar_start[i:i+len(sidebar_end_marker)] == sidebar_end_marker:
                        if nesting_level == 0:
                            sidebar_end_relative_index = i
                            break
                        else:
                            nesting_level -= 1

                if sidebar_end_relative_index == -1:
                     print(f"跳过 (无法确定侧边栏结束位置): {filepath}")
                     count_skipped_no_marker += 1
                     continue

                sidebar_content = temp_content_after_sidebar_start[:sidebar_end_relative_index]
                sidebar_end_index = sidebar_start_index + len(sidebar_start_marker) + sidebar_end_relative_index

                # 3. 在侧边栏内容中查找插入标记
                marker_index_in_sidebar = sidebar_content.find(insertion_marker)
                if marker_index_in_sidebar == -1:
                    print(f"跳过 (侧边栏内无 </nav>): {filepath}")
                    count_skipped_no_marker += 1
                    continue

                # 计算在整个文件中的插入点
                insertion_point = sidebar_start_index + len(sidebar_start_marker) + marker_index_in_sidebar + len(insertion_marker)

                # 4. 构建新内容
                new_content = content[:insertion_point] + "\n" + html_snippet_to_add + content[insertion_point:]

                # 5. 写回文件
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"修改: {filepath}")
                count_modified += 1

            except Exception as e:
                print(f"错误处理文件 {filepath}: {e}")
                count_errors += 1

print("\n处理完成!")
print(f"成功修改: {count_modified} 文件")
print(f"跳过 (已添加): {count_skipped_already_added} 文件")
print(f"跳过 (无侧边栏): {count_skipped_no_sidebar} 文件")
print(f"跳过 (标记未找到): {count_skipped_no_marker} 文件")
print(f"处理错误: {count_errors} 文件")