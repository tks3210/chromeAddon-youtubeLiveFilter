const ngMap = new Map();

const getText = el => {
    let text = '';
    for (const child of el.childNodes) {
        if (child.nodeType === Node.TEXT_NODE) {
            text += child.wholeText;
        }
    }
    return text;
};

const getHash = (message) => {
    if (!message) return 0;
    const mes_arr = new TextEncoder().encode(message)
    var score = mes_arr.reduce((a, b, i) => (a + b + (i * i)) % 10000)
    return score;
}

const checkComment = async node => {
    if (node.nodeName.toLowerCase() !== 'yt-live-chat-text-message-renderer') return;
    const author = getText(node.querySelector('#author-name'));
    const message = getText(node.querySelector('#message'));
    const author_digest = getHash(author);
    const message_digest = getHash(message);
    //console.log(author + ": " + message + ": " + message_digest);
    if (ngMap.get(author_digest) === message_digest) {
        console.log(message + " is filtered.")
        node.hidden = true;
    }
    ngMap.set(author_digest, message_digest)
};

const mutationObserver = new MutationObserver(records => {
    records.forEach(record => {
        record.addedNodes.forEach(node => checkComment(node));
    });
});

mutationObserver.observe(document.querySelector('yt-live-chat-item-list-renderer'), {
    childList: true,
    subtree: true,
});
