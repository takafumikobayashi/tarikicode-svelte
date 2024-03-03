import { AppConfig } from './AppConfig';


export function homeLink() {
    window.location.href = '/'; // リンク先に遷移
}

export function aboutLink() {
    window.location.href = '/about'; // リンク先に遷移
}

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