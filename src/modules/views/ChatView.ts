import { getString } from "../../utils/locale";
import { BaseView } from "./BaseView";

function selectedRegularItemId(): number | null {
  try {
    const items = Zotero.getActiveZoteroPane()?.getSelectedItems?.() || [];
    const item = items.find((candidate: Zotero.Item) =>
      candidate?.isRegularItem?.(),
    );
    return item ? item.id : null;
  } catch {
    return null;
  }
}

/** Full-height paper chat. Threads are the sidebar ChatPersist store. */
export class ChatView extends BaseView {
  private host: HTMLElement | null = null;
  private itemId: number | null = null;
  private mountedItemId: number | null = null;
  private mountGeneration = 0;

  constructor() {
    super("ai-butler-chat-view");
  }

  public openItem(itemId: number): void {
    if (this.itemId !== itemId) this.mountedItemId = null;
    this.itemId = itemId;
    void this.mountCurrent();
  }

  protected renderContent(): HTMLElement {
    const root = this.createElement("div", {
      id: "ai-butler-chat-view",
      styles: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        minWidth: "0",
        minHeight: "0",
        overflow: "hidden",
        backgroundColor: "#0e0e0e",
        color: "#f5f5f5",
      },
    });
    const bar = this.createElement("div", {
      styles: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        flex: "0 0 auto",
        padding: "10px 12px",
        color: "#f5f5f5",
        backgroundColor: "#141414",
        borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
      },
    });
    bar.appendChild(
      this.createElement("strong", {
        textContent: getString("main-window-tab-chat"),
        styles: { fontSize: "14px" },
      }),
    );
    const useSelection = this.createElement("button", {
      textContent: getString("chat-view-use-selection"),
      styles: {
        marginLeft: "auto",
        border: "1px solid rgba(255, 255, 255, 0.28)",
        borderRadius: "6px",
        background: "#111",
        color: "#f5f5f5",
        padding: "4px 8px",
        cursor: "pointer",
        font: "inherit",
        fontSize: "12px",
      },
    });
    useSelection.type = "button";
    useSelection.addEventListener("click", () => {
      const selected = selectedRegularItemId();
      if (selected != null) this.openItem(selected);
    });
    bar.appendChild(useSelection);
    this.host = this.createElement("div", {
      id: "ai-butler-chat-view-host",
      styles: {
        flex: "1 1 auto",
        minHeight: "0",
        minWidth: "0",
        display: "flex",
        flexDirection: "column",
        padding: "0",
        backgroundColor: "#0e0e0e",
        color: "#f5f5f5",
        boxSizing: "border-box",
      },
    });
    root.append(bar, this.host);
    return root;
  }

  protected onShow(): void {
    this.applyTheme();
    if (this.itemId == null) {
      const selected = selectedRegularItemId();
      if (selected != null) this.itemId = selected;
    }
    void this.mountCurrent();
  }

  private async mountCurrent(): Promise<void> {
    const generation = ++this.mountGeneration;
    const host = this.host;
    const itemId = this.itemId;
    if (!host) return;
    if (itemId == null) {
      this.renderEmpty(host);
      return;
    }
    if (
      this.mountedItemId === itemId &&
      host.querySelector("#ai-butler-inline-chat")
    ) {
      return;
    }
    const item = (await Zotero.Items.getAsync(itemId)) as Zotero.Item | false;
    if (generation !== this.mountGeneration || !this.host) return;
    if (!item) {
      this.renderEmpty(this.host);
      return;
    }
    this.mountedItemId = itemId;
    const { mountPersistedItemChat } = await import("../ItemPaneSection");
    if (generation !== this.mountGeneration || !this.host) return;
    mountPersistedItemChat(this.host, item);
  }

  private renderEmpty(host: HTMLElement): void {
    this.mountedItemId = null;
    host.replaceChildren();
    const empty = this.createElement("div", {
      textContent: getString("chat-view-empty"),
      styles: {
        margin: "auto",
        color: "#f5f5f5",
        fontSize: "13px",
        textAlign: "center",
      },
    });
    host.appendChild(empty);
  }
}
