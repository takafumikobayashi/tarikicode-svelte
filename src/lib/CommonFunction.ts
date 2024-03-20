import { AppConfig } from './AppConfig';

//Content-Link
export function homeLink() {
    window.location.href = '/'; // リンク先に遷移
}

export function aboutLink() {
    window.location.href = '/about'; // リンク先に遷移
}

export function thanksCardLink() {
    window.location.href = '/blog/thanks-card'; // リンク先に遷移
}

export function kintoneLink() {
    window.location.href = '/blog/kintone-plugin'; // リンク先に遷移
}

export function svelteLink() {
    window.location.href = '/blog/svelte'; // リンク先に遷移
}

export function snsPromotionLink() {
    window.location.href = '/blog/sns-promotion'; // リンク先に遷移
}

export function aiLink() {
    window.location.href = '/blog/ai'; // リンク先に遷移
}

export function projectManagementLink() {
    window.location.href = '/blog/project-management'; // リンク先に遷移
}

// SNS-Ling
export function mailLink() {
    window.location.href = AppConfig.contacts.email; // リンク先に遷移
}

export function twitterLink() {
    window.location.href = AppConfig.contacts.twitter; // リンク先に遷移
}

export function githubLink() {
    window.location.href = AppConfig.contacts.github; // リンク先に遷移
}

export function linkedinLink() {
    window.location.href = AppConfig.contacts.linkedin; // リンク先に遷移
}

export function facebookLink() {
    window.location.href = AppConfig.contacts.facebook; // リンク先に遷移
}

export function InstagramLink() {
    window.location.href = AppConfig.contacts.instagram; // リンク先に遷移
}