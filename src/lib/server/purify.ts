import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

/**
 * サーバー側で使うDOMPurifyインスタンスを作る。
 *
 * DOM実装はjsdomを使う（DOMPurifyが公式にサポートしているサーバー環境）。
 * happy-domは使わないこと: DOMPurify 3.4以降はタグ名を Node.prototype の nodeName getter
 * で読むが、happy-domではこれが常に空文字を返す。その結果、最初の要素が「不明なタグ」として
 * 除去され（記事冒頭の見出しタグが消える）、走査もそこで止まって残りのHTMLが
 * サニタイズされずに通ってしまう。
 *
 * jsdomは26系に固定している。27以降は依存（html-encoding-sniffer → @exodus/bytes）が
 * ES Moduleを require() するため、require(esm) に対応していないNetlify Functionsの
 * 実行環境では起動時に ERR_REQUIRE_ESM でサイト全体が落ちる（2026-10-31に発生）。
 * 更新するときは `node --no-experimental-require-module -e "require('jsdom')"` で確認すること。
 */
export function createPurifier() {
	const { window } = new JSDOM('');
	// jsdomのDOMWindowとDOMPurifyのWindowLike型は細部が一致しないため変換する
	return DOMPurify(window as unknown as Parameters<typeof DOMPurify>[0]);
}
