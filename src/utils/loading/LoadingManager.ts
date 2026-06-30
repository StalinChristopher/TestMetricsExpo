import type { LoadingConfig } from "./types";

type LoadingCallback = (config: LoadingConfig | null) => void;

class LoadingManagerClass {
  private loadingCallback: LoadingCallback | null = null;

  setLoadingCallback(callback: LoadingCallback) {
    this.loadingCallback = callback;
  }

  show(config: LoadingConfig = {}) {
    if (this.loadingCallback) {
      this.loadingCallback(config);
    }
  }

  hide() {
    if (this.loadingCallback) {
      this.loadingCallback(null);
    }
  }
}

export const LoadingManager = new LoadingManagerClass();
