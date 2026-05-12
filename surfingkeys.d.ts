// Surfingkeysが提供するグローバル変数の型定義。
// 実装は https://github.com/brookhong/Surfingkeys

type HintAction = (element: Element) => void;

declare const api: {
  Clipboard: {
    read(callback: (response: { data: string }) => void): void;
    write(text: string): void;
  };
  Front: {
    openOmnibar(options: { type: string }): void;
  };
  Hints: {
    charactersUpper: boolean;
    setCharacters(chars: string): void;
    create(
      cssSelector: string,
      onHintKey: HintAction,
      attrs?: { tabbed?: boolean; active?: boolean },
    ): void;
    dispatchMouseClick: HintAction;
    style(css: string, mode?: string): void;
  };
  RUNTIME: (
    action: string,
    options?: unknown,
    callback?: (response: { tabs?: { id?: number }[] }) => void,
  ) => void;
  iunmap(keystroke: string): void;
  map(newKeystroke: string, oldKeystroke: string): void;
  mapkey(keys: string, annotation: string, jscode: () => void | Promise<unknown>): void;
  tabOpenLink(url: string): void;
  unmap(keystroke: string): void;
};

declare const settings: {
  blocklistPattern: RegExp;
  historyMUOrder: boolean;
  tabsMRUOrder: boolean;
  omnibarMaxResults: number;
  tabsThreshold: number;
  hintAlign: string;
};

// WebExtensionsのbrowserグローバル。
// 完全な型は @types/firefox-webext-browser が提供するが、
// このプロジェクトでは利用箇所が限定的なので最小限の型のみ宣言する。
declare const browser: {
  runtime: {
    sendMessage(extensionId: string, message: T): Promise<U>;
  };
};

// Tree Style TabのAPI。
// 厳密にはSurfingkeysの一部ではありませんが、
// この設定ファイルで利用するために書いておきます。
interface TstTab {
  id: number;
  children: TstTab[];
}
