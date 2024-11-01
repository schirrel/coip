const createLegacyCopyElement = (text: string): HTMLTextAreaElement => {
    const copiableArea = document.createElement("textarea");

    copiableArea.style.left = "-99999";
    copiableArea.style.position = "fixed";
    copiableArea.style.opacity = "0";
    copiableArea.style.top = "0";
    copiableArea.style.border = "0";
    copiableArea.style.padding = "0";
    copiableArea.style.margin = "0";
    copiableArea.setAttribute("readonly", "");
    copiableArea.value = text;

    return copiableArea;
};

const legacyCopyToClipboard = (text: string): Promise<void> => {
    const copiableArea = createLegacyCopyElement(text);

    document.body.appendChild(copiableArea);
    copiableArea.focus();
    copiableArea.select();

    return new Promise((resolve, reject) => {
        try {
            if (document.execCommand("copy")) {
                return resolve();
            }
            reject();
        } catch (err) {
            reject(err);
        } finally {
            window.getSelection().removeAllRanges();
            document.body.removeChild(copiableArea);
        }
    });
};

const modernCopyToClipboard = (text: string): Promise<void> => {
    return navigator.clipboard.writeText(text);
};

const getSupported = () => {
    const queryCommandSupported = Boolean(document.queryCommandSupported);
    const navigatorSupported = Boolean(navigator.clipboard);
    const legacyCopySupported =
        queryCommandSupported &&
        Boolean(document.queryCommandSupported("copy"));

    return {
        legacy: legacyCopySupported,
        modern: navigatorSupported,
    };
};

export const copyToClipboard = (text: string): Promise<void> => {
    const supportedCopy = getSupported();

    if (supportedCopy.modern) {
        return modernCopyToClipboard(text);
    }

    if (supportedCopy.legacy) {
        return legacyCopyToClipboard(text);
    }

    throw new Error("Copy to clipboard not supported");
};
