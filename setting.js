/**
 * @module
 * @copyright ncaq
 * @license MIT
 *
 * This configuration is partly based on https://github.com/brookhong/Surfingkeys default settings.
 * Surfingkeys is MIT licensed.
 * Copyright (c) 2015 brookhong
 */

/*
   global
   api
   settings
 */

const { Clipboard, Front, Hints, RUNTIME, iunmap, map, mapkey, tabOpenLink, unmap } = api;

// 無効化。

// 干渉するのでSurfingkeysを無効化したいwebサイト。
settings.blocklistPattern = /(docs\.google\.com)|(tt-rss\.ncaq\.net)/;

// blacklistのキーはxkeysnailやKeyhacによって無効化されているけど誤爆しやすいので無効化します。
unmap("<Alt-s>");

// iと同じだし、C-iはページの情報を取得するのに使いたいので除外します。
unmap("<Ctrl-i>");

// GitHubの検索ショートカットフォーカスを使いたいので無効化。
unmap("/");

// 絵文字はIMEなどから入力します。
iunmap(":");

// settingsへの代入。

settings.historyMUOrder = false;
settings.tabsMRUOrder = false;
settings.omnibarMaxResults = 20;
settings.tabsThreshold = 0; // 常にomnibarを使う。

// scroll

/**
 * scrollByの動作がFirefox 65で予測不可能になったのでscrollToで再実装する。
 * スムーズスクロールする。
 * @param {number} size - スクロールするサイズ
 * @param {number} ward - 1か-1でスクロールする方向を制御
 */
function scrollBySmooth(size, ward) {
  window.scrollTo({
    top: window.scrollY + ward * size,
    left: 0,
    behavior: "smooth",
  });
}

/**
 * 絶対位置スクロール。
 * @param {number} position - スクロールする位置
 */
function scrollToSmooth(position) {
  window.scrollTo({
    top: position,
    left: 0,
    behavior: "smooth",
  });
}

mapkey("o", "#2Scroll down of half", () => {
  scrollBySmooth(window.innerHeight / 2, 1);
});
mapkey("u", "#2Scroll up of half", () => {
  scrollBySmooth(window.innerHeight / 2, -1);
});

mapkey(",", "#2Scroll to beginning", () => {
  scrollToSmooth(0);
});
mapkey(".", "#2Scroll to ending", () => {
  scrollToSmooth(document.body.scrollHeight);
});

mapkey("t", "#2Scroll up of line", () => {
  scrollBySmooth(window.innerHeight / 10, -1);
});
mapkey("n", "#2Scroll down of line", () => {
  scrollBySmooth(window.innerHeight / 10, 1);
});

mapkey("k", "#2Scroll up of line", () => {
  scrollBySmooth(window.innerHeight / 10, -1);
});
mapkey("j", "#2Scroll down of line", () => {
  scrollBySmooth(window.innerHeight / 10, 1);
});

mapkey("v", "#2Scroll down of page", () => {
  scrollBySmooth(window.innerHeight * 0.9, 1);
});
mapkey("z", "#2Scroll up of page", () => {
  scrollBySmooth(window.innerHeight * 0.9, -1);
});

// tab

// フォーカスしているタブを移動。
map("h", "E");
map("a", "E");
map("s", "R");
map("e", "R");

// 閉じたタブを復帰させる。
map("-", "X");
// タブを閉じる。
mapkey("w", "#3Close current tab", () => {
  RUNTIME("closeTab");
});
mapkey("q", "#3Close current tab", () => {
  RUNTIME("closeTab");
});

// タブ一覧を表示して移動。
map("x", "T");

// 最近閉じたタブや履歴を閲覧。
mapkey("<Alt-,>", "#8Open RecentlyClosed", () => {
  Front.openOmnibar({ type: "RecentlyClosed" });
});
mapkey("<Ctrl-Alt-,>", "#8Open History", () => {
  Front.openOmnibar({ type: "History" });
});

// Tree Style Tabs

const tstId = "treestyletab@piro.sakura.ne.jp";

// 親のタブに移る
mapkey("r", "#3Focus parent tab", async () => {
  const { id } = await browser.runtime.sendMessage(tstId, {
    type: "get-tree",
    tab: "current",
  });
  const tabs = await browser.runtime.sendMessage(tstId, {
    type: "get-tree",
    tabs: "*",
  });
  const parentTab = tabs.find((tab) => tab.children.find((child) => child.id === id));
  if (parentTab) {
    browser.runtime.sendMessage(tstId, {
      type: "focus",
      tab: parentTab.id,
    });
  }
});

// タブを1段階上昇させる
mapkey("d", "#3Outdent parent tab", () => {
  browser.runtime.sendMessage(tstId, {
    type: "outdent",
    tab: "current",
  });
});

// Hints。

const hintsCharactersRight = "htnsbmwvzcr";
const hintsCharactersLeft = "ueoakjq;";
const hintsCharactersAll = hintsCharactersRight + hintsCharactersLeft;

Hints.charactersUpper = false;
Hints.style("font-size: 14px !important;");
settings.hintAlign = "left";

// キーボードでリンクを移動。
mapkey("b", "#1Open a link", () => {
  Hints.setCharacters(hintsCharactersAll);
  Hints.create("", Hints.dispatchMouseClick);
});

mapkey("c", "#1Open a link in non-active new tab or click", () => {
  Hints.setCharacters(hintsCharactersAll);
  Hints.create("", Hints.dispatchMouseClick, { tabbed: true, active: false });
});

mapkey("m", "#1Open a link by right key", () => {
  Hints.setCharacters(hintsCharactersRight);
  Hints.create("", Hints.dispatchMouseClick);
  Hints.setCharacters(hintsCharactersAll);
});

mapkey("g", "#1Open a link in non-active new tab or click by right key", () => {
  Hints.setCharacters(hintsCharactersRight);
  Hints.create("", Hints.dispatchMouseClick, { tabbed: true, active: false });
  Hints.setCharacters(hintsCharactersAll);
});

mapkey(";", "#1Open a link by left key", () => {
  Hints.setCharacters(hintsCharactersLeft);
  Hints.create("", Hints.dispatchMouseClick);
  Hints.setCharacters(hintsCharactersAll);
});

mapkey("p", "#1Open a link in non-active new tab or click by left key", () => {
  Hints.setCharacters(hintsCharactersLeft);
  Hints.create("", Hints.dispatchMouseClick, { tabbed: true, active: false });
  Hints.setCharacters(hintsCharactersAll);
});

/**
 * `getCssSelectorsOfEditable`とは違い、`checkbox`などキーボードで編集しないものには反応しません。
 * この関数は、編集可能なテキストの要素を選択するためのCSSセレクタを返します。
 */
function getCssSelectorsOfEditableText() {
  const inputTypes = [
    "button",
    "checkbox",
    "color",
    "date",
    "datetime-local",
    "file",
    "image",
    "radio",
    "range",
    "reset",
    "submit",
  ];
  const excludedInputSelectors = inputTypes.map((type) => `input[type=${type}]`).join(", ");
  const editableSelectors = [
    `input:not(${excludedInputSelectors})`,
    "textarea",
    "*[contenteditable=true]",
    "*[role=textbox]",
    "select",
    "div.ace_cursor",
  ];
  return editableSelectors.join(", ");
}

mapkey("i", "#1Go to edit text box", () => {
  Hints.create(getCssSelectorsOfEditableText(), Hints.dispatchMouseClick);
});

// 戻る進む。

// 戻る。
map("H", "S");
map("A", "S");
// 進む。
map("S", "D");
map("E", "D");

// open with external service

mapkey("'", "#3Google", () => {
  const selection = window.getSelection().toString();
  if (selection !== "") {
    tabOpenLink(`https://www.google.com/search?client=firefox-b-d&q=${encodeURIComponent(selection)}`);
  }
});

mapkey("<Ctrl-'>", "#3DeepL", () => {
  const selection = window.getSelection().toString();
  if (selection !== "") {
    tabOpenLink(
      `https://www.deepl.com/translator#en/ja/${encodeURIComponent(selection).replaceAll("%2F", "\\%2F")}` // DeepLはスラッシュを特別扱いするためエスケープする。
    );
  }
});

mapkey("<Alt-'>", "#3Google 翻訳", () => {
  const selection = window.getSelection().toString();
  if (selection === "") {
    // 文字列選択してない場合はページ自体を翻訳にかける
    tabOpenLink(`https://translate.google.com/translate?hl=&sl=auto&tl=ja&u=${window.location.href}&sandbox=1`);
  } else {
    // 選択している場合はそれを翻訳する
    tabOpenLink(`https://translate.google.com/?sl=auto&tl=ja&text=${encodeURIComponent(selection)}`);
  }
});

mapkey("<Ctrl-Alt-'>", "#3英辞郎 on the WEB Pro Lite", () => {
  const selection = window.getSelection().toString();
  if (selection !== "") {
    tabOpenLink(`https://eowf.alc.co.jp/search?q=${encodeURIComponent(selection)}`);
  }
});

mapkey("<Ctrl-:>", "#3はてなブックマーク", () => {
  const { location } = window;
  switch (location.protocol) {
    case "http:": {
      tabOpenLink(`https://b.hatena.ne.jp/entry/${location.href.replace("http://", "")}`);
      break;
    }
    case "https:": {
      tabOpenLink(`https://b.hatena.ne.jp/entry/s/${location.href.replace("https://", "")}`);
      break;
    }
    default: {
      throw new Error("はてなブックマークに対応していないページ");
    }
  }
});

// open the Twitter

/**
 * 指定されたURLのマッチパターンにヒットするタブが既に開かれていればそのタブをアクティブにする。
 * 開かれていなければ新規に開く。
 * 開く際には正確なURLが指定されていればそれを使用して、
 * そうでなければマッチパターンをそのままURLと解釈して使用。
 */
function tabActivateOrCreate(urlPattern, urlOpen = undefined) {
  RUNTIME("getTabs", { queryInfo: { url: urlPattern, currentWindow: true } }, ({ tabs }) => {
    if (!Array.isArray(tabs)) {
      throw new Error(`tabs is not Array: ${JSON.stringify(tabs)}`);
    }
    const tabId = tabs?.[0]?.id;
    // タブが存在すれば、そのタブをアクティブにします。
    if (tabId != null) {
      RUNTIME("focusTab", { tabId });
    } else {
      // タブが存在しなければ、新しくタブを開きます。
      tabOpenLink(urlOpen ?? urlPattern);
    }
  });
}

mapkey("<Ctrl-;>", "#3XPro", () => {
  tabActivateOrCreate("https://pro.twitter.com/*");
});

mapkey("<Alt-;>", "#3通知 / X", () => {
  tabActivateOrCreate("https://x.com/notifications");
});

mapkey("<Ctrl-Alt-;>", "#3エゴサーチ / Yahoo!リアルタイム検索", () => {
  tabActivateOrCreate(
    "https://search.yahoo.co.jp/realtime/search?p=-id%3Ancaq+(%40ncaq+ncaq+%E3%82%A8%E3%83%8C%E3%83%A6%E3%83%AB+%E3%81%88%E3%81%AC%E3%82%86%E3%82%8B+URL%3Atwitter.com%2Fncaq+URL%3Ancaq.net)"
  );
});

// copy

/**
 * GitHubのPull Requestから開いたCommitのページのタイトルが、
 * コミットメッセージを一切含まないのを修正。
 */
function githubCommitInPullRequestTitle() {
  // GitHubによって勝手に長さによって省略されている。
  // しかし全体を取ると複数行全部取ることになる。
  // 最初の1行だけを取りたいが少しばかり複雑なロジックになりそうなので本格的に使いたくなるまで保留。
  const commitMessagePart = document.getElementsByClassName("commit-title")?.[0]?.innerText;
  if (
    // タイトルが取れてなければおそらく対象のページではない。
    typeof commitMessagePart !== "string" ||
    // PRのページっぽいか?
    !document.location.pathname.split("/").includes("pull") ||
    // コミット単独のページだと既にタイトルに含まれているので追記しない。
    // タイトルに含まれているか判定はGitHubが`code`をバッククオートでマークアップしたタイトルにするのであまり信用できない。
    document.title.includes(commitMessagePart)
  ) {
    return undefined;
  }
  return `${commitMessagePart} · ${document.title}`;
}

/**
 * CodeCommitのタイトルはPRの内容を一切反映しない信じられない仕様。
 */
function codeCommitPullRequestTitle() {
  const prTitle = document.querySelector('[class^="awsui_title"] h1')?.innerText;
  if (typeof prTitle !== "string") {
    return undefined;
  }
  return `${prTitle} - ${document.title}`;
}

/**
 * [Backlog｜チームで使うプロジェクト管理・タスク管理ツール](https://backlog.com/ja/)
 * で妥当なtitleを整形して取得する。
 *
 * Backlogのtitleはそのまま`document.title`を利用すると、
 * タイトルの無意味なサフィックス部分がかなり長い問題がある。
 * またBacklogのMarkdownパーサーにはバグがあり、
 * タイトルをそのままMarkdownのリンク文字列にすると、
 * `[[]]`のパースに失敗して最初の括弧を削ってしまう。
 *
 * よってそれっぽいタイトルを整形する。
 * ヌーラボには、
 * `[Backlog-97500] お問い合わせ返信：一部文字が削られることについて`
 * としてメールで問い合わせを発信している。
 * しかし2022-06-16に問題を認識しているという返答がありましたが未だに修正されないので、
 * バッドノウハウとしてこちらで対処する。
 *
 * URLなどを見てBacklogかどうかは判定しない。
 * Backlogみたいなクラス名を持つページならば、
 * ダックタイピング的にBacklogとして扱う。
 * 深刻な問題に対応したり自動的に動くスクリプトではないので、
 * これぐらい雑に扱っても大丈夫なはず。
 */
function backlogTitle() {
  // 課題のキー。プロジェクトタイトルがプレフィックスに付くので純粋な数値ではない。
  const issueNumber = document.getElementsByClassName("ticket__key-number")?.[0]?.innerText;
  // 課題に設定されたタイトル。
  const issueTitle = document.getElementsByClassName("title-group__title-text")?.[0]?.innerText;
  // うまいこと取得できなかったら諦める。
  if (typeof issueNumber !== "string" || typeof issueTitle !== "string") {
    return undefined;
  }
  // Backlogでは連続して角括弧を始まりを記述できない。
  // Slackではスペースの入った括弧を正しく処理できない。
  // よって角括弧によるリンクは諦めます。
  // リンクが角括弧のリンクに何か特別な効果があるわけでもないので妥協します。
  return `${issueNumber} ${issueTitle}`;
}

/**
 * 適切なタイトルを状況に応じて取得する。
 * 特殊な状況でなければ`document.title`を利用する。
 */
function dwimTitle() {
  return githubCommitInPullRequestTitle() || codeCommitPullRequestTitle() || backlogTitle() || document.title;
}

mapkey("f", "#7Copy title and link to markdown without hash", () => {
  const url = new URL(window.location.href);
  url.hash = "";
  Clipboard.write(`[${dwimTitle()}](${url.href})`);
});

mapkey("F", "#7Copy title and link to markdown", () => {
  Clipboard.write(`[${dwimTitle()}](${window.location.href})`);
});

mapkey("l", "#7Copy title and link to human readable without hash", () => {
  const url = new URL(window.location.href);
  url.hash = "";
  Clipboard.write(`[${dwimTitle().trim()}]: ${url.href}`);
});

mapkey("L", "#7Copy title and link to human readable", () => {
  Clipboard.write(`[${dwimTitle().trim()}]: ${window.location.href}`);
});

/**
 * Twitterの埋め込みスクリプトをボタンを押さずに取得します。
 */
async function getTwitterEmbed(url) {
  // TwitterのURLやツイートのURLじゃない場合は`undefined`を返します。
  if (
    !(
      (url.hostname === "twitter.com" || url.hostname === "mobile.twitter.com" || url.hostname === "x.com") &&
      /^\/\w+\/status\/\d+/.exec(url.pathname)
    )
  ) {
    return undefined;
  }
  const publish = new URL("https://publish.twitter.com/oembed");
  publish.searchParams.set("url", url.href);
  // `script`タグは最後にまとめて入れるので取り除きます。
  publish.searchParams.set("omit_script", "t");
  // ブラウザの言語設定を反映します。
  publish.searchParams.set("lang", navigator.language || "en");
  const response = await fetch(publish.href);
  if (!response.ok) {
    throw new Error(`${publish.href}: response is not ok ${JSON.stringify(response.statusText)}`);
  }
  return (await response.json()).html;
}

// ツイートを埋め込むボタンを押していちいちコピーして`script`タグを取り除くのが面倒なので、
// キーを入力するだけでコピーできるようにする。
mapkey("ye", "#7Copy Twitter embed", () => {
  async function f() {
    Clipboard.write(await getTwitterEmbed(new URL(window.location.href)));
  }
  f();
});

// zoom

mapkey("<Ctrl-=>", "#3zoom reset", () => {
  RUNTIME("setZoom", {
    zoomFactor: 0,
  });
});

// 特定のアプリケーションで、Enterを改行に留めます。
// 本当はC-mで改行でEnterで送信したいのですが、
// OSレベルのアプリケーションでC-mとEnterを同一にしていると難しいです。
// かなり強引な方法をとっていることは分かっているので、
// 穏当な方法に修正したいです。

/**
 * Enterが押された場合のイベント実行を停止します。
 * Ctrl+Enterの場合は停止しません。
 * 単純にimapで移し替えを行うことは出来なかったので強引な手法を使っています。
 */
function disableSubmitWhereTextareaWhenEnter(event) {
  if (
    event instanceof KeyboardEvent &&
    event.target.tagName === "TEXTAREA" &&
    event.code === "Enter" &&
    !event.ctrlKey
  ) {
    event.stopPropagation();
  }
}

// コンテンツスクリプトを自由に実行する必要があるため、
// imapのドメイン指定などでは表現しきれません。
if (window.location.hostname === "chat.openai.com" || window.location.hostname === "chatgpt.com") {
  // textareaをquerySelectorAllする方法は読み込みタイミングの問題か使えませんでした。
  document.addEventListener("keydown", disableSubmitWhereTextareaWhenEnter, { capture: true });
}
