import mermaid from 'mermaid';
import { icons } from '@iconify-json/logos';
mermaid.registerIconPacks([
  {
    name: icons.prefix, // To use the prefix defined in the icon pack
    icons,
  },
]);

// Mermaid用の図をレンダリングする関数
export function renderMermaidDiagrams() {
    // 初回描画
    const mermaidElements = document.querySelectorAll('code.language-mermaid');
    if (mermaidElements.length > 0) {
        mermaidElements.forEach((element) => {
            const mermaidCode = element.textContent || '';

            // Mermaid用のコンテナを作成
            const mermaidContainer = document.createElement('div');
            mermaidContainer.classList.add('mermaid');
            mermaidContainer.dataset.mermaidCode = mermaidCode;
            mermaidContainer.innerHTML = mermaidCode;

            // 元のcode.language-mermaid要素をdiv.mermaidに置き換える
            element.replaceWith(mermaidContainer);

            // Mermaidを再初期化して図を描画
            mermaid.init(undefined, mermaidContainer);
        });
    } else {
        // 2回目以降の描画
        const processedMermaidElements = document.querySelectorAll('div.mermaid');
        processedMermaidElements.forEach((element) => {
            const mermaidCode = element.dataset.mermaidCode || '';
            if (!mermaidCode) {
                console.error('Mermaid code not found for element:', element);
                return; // コードがない場合はスキップ
            }

            // 新しい div.mermaid コンテナを作成
            const newMermaidContainer = document.createElement('div');
            newMermaidContainer.classList.add('mermaid');
            newMermaidContainer.dataset.mermaidCode = mermaidCode;
            newMermaidContainer.innerHTML = mermaidCode;

            // 元のdiv.mermaid要素の内容を新しいコンテナで置き換える
            element.replaceWith(newMermaidContainer);

            // Mermaidを再初期化して図を再描画
            mermaid.init(undefined, newMermaidContainer);
        });
    }
}

// Mermaidテーマを設定する関数
export function setMermaidTheme(isDarkMode: boolean) {
    const theme = isDarkMode ? 'dark' : 'default'; // ダークモードなら'dark'、ライトモードなら'default'

    // Mermaidのテーマを変更して再描画
    mermaid.initialize({ startOnLoad: false, theme });
    renderMermaidDiagrams(); // Mermaidの図を再描画
}