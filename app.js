// ============================================
// Sylhetin Application Logic
// ============================================
console.log("Sylhetin Prototype Loaded");

// ---------- টোস্ট নোটিফিকেশন ----------
function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(function () {
        toast.classList.remove('show');
    }, 2200);
}

// ---------- কমেন্ট রেন্ডার করা (localStorage থেকে) — টেক্সট ও ভয়েস দুইটাই সাপোর্ট করে ----------
function renderCommentsFor(postEl) {
    const postId = postEl.getAttribute('data-post-id');
    if (!postId) return;
    const list = postEl.querySelector('.comment-list');
    if (!list) return;
    list.innerHTML = '';
    const saved = JSON.parse(localStorage.getItem('sylhetin_comments_' + postId) || '[]');
    saved.forEach(function (c) {
        const li = document.createElement('li');
        li.className = 'comment-item';

        // পুরনো কমেন্ট (plain string, শুধু টেক্সট) আর নতুন কমেন্ট (object: text/voice) — দুটোই সাপোর্ট
        if (typeof c === 'string') {
            li.innerHTML = '<div class="user-avatar" style="width:30px;height:30px;font-size:12px;">👤</div>' +
                '<div class="bubble"><span class="c-name">আপনি</span>' + c + '</div>';
        } else if (c.type === 'voice') {
            li.innerHTML = '<div class="user-avatar" style="width:30px;height:30px;font-size:12px;">👤</div>' +
                '<div class="bubble voice-comment"><span class="c-name" style="display:block; margin-bottom:3px;">আপনি (ভয়েস কমেন্ট)</span>' +
                '<audio controls src="' + c.audioData + '"></audio></div>';
        } else {
            li.innerHTML = '<div class="user-avatar" style="width:30px;height:30px;font-size:12px;">👤</div>' +
                '<div class="bubble"><span class="c-name">আপনি</span>' + c.text + '</div>';
        }
        list.appendChild(li);
    });
}

// ---------- শেয়ার কাউন্ট রেন্ডার করা ----------
function renderShareCountFor(postEl) {
    const postId = postEl.getAttribute('data-post-id');
    if (!postId) return;
    const btn = postEl.querySelector('.share-btn');
    if (!btn) return;
    const count = parseInt(localStorage.getItem('sylhetin_shares_' + postId) || '0', 10);
    btn.textContent = count > 0
        ? '↗️ আরো মানরে দেখাউক্কা (' + count + ')'
        : '↗️ আরো মানরে দেখাউক্কা';
}

// ---------- অফিসিয়াল নিউজ পেজ ডেটা (news.html, news-page-detail.html, news-detail.html-এর জন্য) ----------
const sylhetinNewsPagesData = {
    'np1': {
        name: 'Surma Faror Khobor',
        logo: '📰',
        pageType: 'অনলাইন নিউজ পোর্টাল',
        verified: true,
        followers: '৪৫,২০০',
        about: 'সিলেট অঞ্চলের সবচেয়ে জনপ্রিয় অনলাইন নিউজ পোর্টাল। প্রতিদিনের আপডেট, স্থানীয় খবর ও প্রবাসী সংবাদ নিয়ে কাজ করে।',
        website: 'surmafarorkhobor.com',
        posts: [
            {
                id: 'a1',
                headline: 'সকালের আপডেট: সিলেটে বৃষ্টির সম্ভাবনা',
                shortDescription: 'আবহাওয়ার পূর্বাভাস অনুযায়ী আজ সিলেটে হালকা থেকে মাঝারি বৃষ্টির সম্ভাবনা।',
                fullContent: 'আবহাওয়ার পূর্বাভাস অনুযায়ী আজ সিলেটে হালকা থেকে মাঝারি বৃষ্টির সম্ভাবনা রয়েছে। স্থানীয় কৃষকদের ফসল রক্ষার জন্য প্রয়োজনীয় ব্যবস্থা নিতে পরামর্শ দেওয়া হয়েছে। আবহাওয়া অধিদপ্তর জানিয়েছে, বিকেলের দিকে বৃষ্টির পরিমাণ কিছুটা বাড়তে পারে, তবে রাতের মধ্যে আকাশ পরিষ্কার হয়ে যাওয়ার সম্ভাবনা আছে।',
                category: 'সিলেট',
                publishDate: 'আজ',
                reporterName: null
            },
            {
                id: 'a2',
                headline: 'বিয়ানীবাজারে নয়া রাস্তা উদ্বোধন',
                shortDescription: 'এলাকাবাসীর দীর্ঘদিনের দাবির প্রেক্ষিতে অবশেষে রাস্তার কাজ সম্পন্ন হলো।',
                fullContent: 'এলাকাবাসীর দীর্ঘদিনের দাবির প্রেক্ষিতে বিয়ানীবাজার উপজেলায় নতুন রাস্তার নির্মাণকাজ অবশেষে সম্পন্ন হয়েছে। স্থানীয় জনপ্রতিনিধিরা জানিয়েছেন, এই রাস্তা দিয়ে যোগাযোগ ব্যবস্থার উল্লেখযোগ্য উন্নতি হবে এবং ব্যবসায়ীদের পণ্য পরিবহনে সুবিধা হবে। এলাকাবাসী এই উদ্যোগে খুশি প্রকাশ করেছেন।',
                category: 'সিলেট',
                publishDate: '২ দিন আগে',
                reporterName: 'রফিক উদ্দিন'
            }
        ]
    },
    'np2': {
        name: 'Sylhet Today',
        logo: '📡',
        pageType: 'অনলাইন নিউজ পোর্টাল',
        verified: true,
        followers: '২৮,৯০০',
        about: 'সিলেট বিভাগের সাম্প্রতিক ঘটনা, রাজনীতি ও সংস্কৃতি নিয়ে নিয়মিত সংবাদ প্রকাশকারী প্ল্যাটফর্ম।',
        website: 'sylhettoday.com',
        posts: [
            {
                id: 'a1',
                headline: 'নতুন বইমেলা বিষয়ক আলোচনা',
                shortDescription: 'সাহিত্য মজলিসে আগামী সপ্তাহের বইমেলা নিয়ে বিশেষ আড্ডা হবে।',
                fullContent: 'সাহিত্য ও কবিতা মজলিসের সদস্যরা আগামী সপ্তাহে অনুষ্ঠিতব্য বইমেলা নিয়ে একটি বিশেষ আড্ডার আয়োজন করেছেন। স্থানীয় লেখক ও কবিরা তাদের নতুন বই নিয়ে আলোচনা করবেন। মেলায় সিলেটি ভাষা ও সংস্কৃতি বিষয়ক বইয়ের একটি আলাদা কর্নার থাকবে বলে আয়োজকরা জানিয়েছেন।',
                category: 'বিনোদন',
                publishDate: 'গতকাল',
                reporterName: 'নাজমুল হক'
            }
        ]
    }
};

/** নিউজ পোস্ট আইডি (যেমন "np1-a1" বা "np1-extra-172...") দিয়ে খুঁজে পেজ ও পোস্ট বের করা */
function findNewsPost(fullPostId) {
    const allPages = getAllNewsPagesData();
    for (const pageId in allPages) {
        const page = allPages[pageId];
        const combined = getNewsPagePosts(pageId, page);
        const found = combined.find(function (p) { return p.fullId === fullPostId; });
        if (found) return { pageId: pageId, page: page, post: found };
    }
    return null;
}

/** ইউজারের তৈরি করা মজলিস localStorage থেকে বের করা */
function getUserMajlisData() {
    return JSON.parse(localStorage.getItem('sylhetin_user_majlis') || '{}');
}

/** স্ট্যাটিক ডেমো মজলিস + ইউজারের তৈরি করা মজলিস — দুটো মিলিয়ে একটা অবজেক্ট বানানো */
function getAllMajlisData() {
    return Object.assign({}, sylhetinMajlisData, getUserMajlisData());
}

/** ইউজারের তৈরি করা নিউজ পেজ localStorage থেকে বের করা */
function getUserNewsPagesData() {
    return JSON.parse(localStorage.getItem('sylhetin_user_news_pages') || '{}');
}

/** স্ট্যাটিক ডেমো নিউজ পেজ + ইউজারের তৈরি করা পেজ — দুটো মিলিয়ে একটা অবজেক্ট বানানো */
function getAllNewsPagesData() {
    return Object.assign({}, sylhetinNewsPagesData, getUserNewsPagesData());
}

// ---------- ডেমো ইউজার প্রোফাইল ডেটা (profile.html-এর জন্য, ভবিষ্যতে আসল ইউজার আসার আগে) ----------
const sylhetinUsersData = {
    'u1': {
        name: 'আব্দুর রাজ্জাক', avatarText: 'র', isMe: true,
        bio: 'লেখক ও ভ্রমণপিপাসু। সিলেট আমার ভালোলাগার জায়গা।',
        country: 'বাংলাদেশ', district: 'সিলেট', upazila: 'ফেঞ্চুগঞ্জ', union: 'মাইজগাঁও', location: 'ঢাকা', profession: 'লেখক',
        posts: '১৫', followers: '১২০', majlisCount: '৩', chatId: 'c1'
    },
    'u2': {
        name: 'আরিফ চৌধুরী', avatarText: 'আ',
        bio: 'সিলেটের প্রকৃতি আর ছবি তোলা ভালোবাসি।',
        country: 'বাংলাদেশ', district: 'সিলেট', upazila: 'সিলেট সদর', union: '—', location: 'সিলেট', profession: 'ফটোগ্রাফার',
        posts: '৯', followers: '৮৪', majlisCount: '২', chatId: 'c2'
    },
    'u3': {
        name: 'সাফিয়া বেগম', avatarText: 'ছ',
        bio: 'বই পড়তে আর কবিতা লিখতে ভালো লাগে।',
        country: 'বাংলাদেশ', district: 'সিলেট', upazila: 'বিয়ানীবাজার', union: '—', location: 'বিয়ানীবাজার', profession: 'শিক্ষিকা',
        posts: '৬', followers: '৫৩', majlisCount: '২', chatId: 'c3'
    },
    'u4': {
        name: 'রফিক আহমদ', avatarText: 'র',
        bio: 'ফেঞ্চুগঞ্জ ইউনিয়নের একজন সক্রিয় সদস্য।',
        country: 'বাংলাদেশ', district: 'সিলেট', upazila: 'ফেঞ্চুগঞ্জ', union: 'মাইজগাঁও', location: 'ফেঞ্চুগঞ্জ', profession: 'ব্যবসায়ী',
        posts: '১১', followers: '৭২', majlisCount: '১', chatId: null
    },
    'u5': {
        name: 'ছালমা বেগম', avatarText: 'ছ',
        bio: 'বাড়ির উঠানের ছোট ছোট মুহূর্ত শেয়ার করতে ভালো লাগে।',
        country: 'বাংলাদেশ', district: 'সিলেট', upazila: 'ফেঞ্চুগঞ্জ', union: 'মাইজগাঁও', location: 'ফেঞ্চুগঞ্জ', profession: 'গৃহিণী',
        posts: '৪', followers: '৩১', majlisCount: '১', chatId: null
    },
    'u6': {
        name: 'হাসান আলী', avatarText: 'হ',
        bio: 'সৌদি আরবে প্রবাসী, প্রযুক্তি নিয়ে আগ্রহী।',
        country: 'সৌদি আরব (প্রবাসী)', district: 'সিলেট', upazila: '—', union: '—', location: 'রিয়াদ', profession: 'ইঞ্জিনিয়ার',
        posts: '৭', followers: '৯৮', majlisCount: '২', chatId: null
    },
    'u7': {
        name: 'নাজমা আক্তার', avatarText: 'ন',
        bio: 'সিলেটি সংস্কৃতি আর গান নিয়ে লেখালেখি করি।',
        country: 'বাংলাদেশ', district: 'সিলেট', upazila: 'সিলেট সদর', union: '—', location: 'সিলেট', profession: 'সাংবাদিক',
        posts: '১৩', followers: '১১০', majlisCount: '২', chatId: null
    },
    'u8': {
        name: 'মিজানুর রহমান', avatarText: 'ম',
        bio: 'বিয়ানীবাজার উপজেলার স্থানীয় সংগঠক।',
        country: 'বাংলাদেশ', district: 'সিলেট', upazila: 'বিয়ানীবাজার', union: '—', location: 'বিয়ানীবাজার', profession: 'শিক্ষক',
        posts: '৮', followers: '৬৫', majlisCount: '৩', chatId: null
    }
};

/** নামের সাথে মিলিয়ে ইউজার আইডি বের করা (মজলিস পোস্টের author নাম থেকে প্রোফাইল লিংক করার জন্য) */
function findUserIdByName(name) {
    for (const uid in sylhetinUsersData) {
        if (sylhetinUsersData[uid].name === name) return uid;
    }
    return null;
}

/** একাধিক ছবির জন্য গ্যালারি HTML বানানো (১টা হলে ফুল-উইথ, একাধিক হলে গ্রিড) */
function buildImagesGridHtml(images) {
    if (!images || images.length === 0) return '';
    if (images.length === 1) {
        return `<img src="${images[0]}" style="width:100%; display:block; margin-bottom:2px;">`;
    }
    const shown = images.slice(0, 4);
    let html = '<div class="post-images-grid" style="--count:' + shown.length + '">';
    shown.forEach(function (img, i) {
        const isLastWithMore = (i === 3 && images.length > 4);
        html += `<div class="post-images-grid-item" style="background-image:url('${img}')">`;
        if (isLastWithMore) {
            html += `<span class="post-images-grid-more">+${images.length - 4}</span>`;
        }
        html += `</div>`;
    });
    html += '</div>';
    return html;
}

// ---------- একটা পোস্ট কার্ডের HTML বানানোর জেনেরিক ফাংশন ----------
// reusable for বন্ধুর পোস্ট, মজলিসের পোস্ট, নিউজ পেজের পোস্ট, সেভ করা পোস্ট — সব জায়গায়
function buildFeedCardHtml(opts) {
    const avatarHtml = opts.avatarImage
        ? `<div class="user-avatar" style="background-image:url('${opts.avatarImage}'); background-size:cover; background-position:center;"></div>`
        : `<div class="user-avatar" ${opts.roundedSquare ? 'style="border-radius:12px;"' : ''}>${opts.avatarText || '👤'}</div>`;

    const bodyInner = opts.headline
        ? `<p style="font-weight:700; font-size:14.5px; margin:0 0 6px;">${opts.headline}</p><p style="margin:0;">${opts.bodyText}</p>`
        : `<p>${opts.bodyText}</p>`;
    const bodyHtml = opts.linkHref
        ? `<a href="${opts.linkHref}" style="display:block; color:inherit; text-decoration:none;">${bodyInner}</a>`
        : bodyInner;

    const mediaHtml = opts.imageHtml || buildImagesGridHtml(opts.images) || '';
    const userIdAttr = opts.userId ? ` data-user-id="${opts.userId}"` : '';

    return `
        <div class="card post" data-post-id="${opts.postId}">
            <div class="post-head"${userIdAttr} ${opts.headHref ? `onclick="window.location.href='${opts.headHref}'" style="cursor:pointer;"` : ''}>
                ${avatarHtml}
                <div class="meta">
                    <div class="user-name">${opts.name} ${opts.badge || ''}</div>
                    <div class="post-time">${opts.metaLine}</div>
                </div>
            </div>
            ${bodyHtml}
            ${mediaHtml}
            <div class="post-actions">
                <div class="reaction-wrap">
                    <button type="button" class="reaction-btn" data-emoji="👍" data-label="ফছন অইছে">
                        <span class="r-emoji">👍</span><span class="r-label">ফছন অইছে</span>
                    </button>
                    <div class="reaction-picker">
                        <span class="r-item" data-emoji="👍" data-label="ফছন অইছে" title="ফছন অইছে">👍</span>
                        <span class="r-item" data-emoji="❤️" data-label="ভালা লাগছে" title="ভালা লাগছে">❤️</span>
                        <span class="r-item" data-emoji="😂" data-label="হা হা" title="হা হা">😂</span>
                        <span class="r-item" data-emoji="😮" data-label="ছমতখার" title="ছমতখার">😮</span>
                        <span class="r-item" data-emoji="😢" data-label="খশটো ফাইলাম" title="খশটো ফাইলাম">😢</span>
                        <span class="r-item" data-emoji="😡" data-label="রাগ খরলাম" title="রাগ খরলাম">😡</span>
                    </div>
                </div>
                <span class="comment-toggle">💬 কুনতা খও</span>
                <span class="share-btn">↗️ আরো মানরে দেখাউক্কা</span>
                <span class="save-btn" title="সেভ করো">🔖</span>
            </div>
            <div class="comment-section">
                <ul class="comment-list"></ul>
                <div class="comment-input-row">
                    <div class="user-avatar" style="width:30px;height:30px;font-size:12px;">👤</div>
                    <input type="text" class="comment-input" placeholder="আফনার মত কিতা?">
                    <span class="mic-btn" title="ভয়েস কমেন্ট">🎤</span>
                    <button type="button" class="comment-send-btn">➤</button>
                </div>
            </div>
        </div>
    `;
}

/** পোস্ট সেভ করা আছে কিনা তার অবস্থা localStorage থেকে ফিরিয়ে এনে বাটনে বসানো */
function restoreSaveStates(container) {
    const scope = container || document;
    scope.querySelectorAll('.post[data-post-id] .save-btn').forEach(function (btn) {
        const postEl = btn.closest('.post');
        const postId = postEl.getAttribute('data-post-id');
        const saved = localStorage.getItem('sylhetin_saved_' + postId) === 'true';
        btn.classList.toggle('saved', saved);
        btn.textContent = saved ? '✅ সেভ করা হইছে' : '🔖 সেভ করো';
    });
}

/** নির্দিষ্ট মজলিসে ইউজার যেসব নতুন পোস্ট যোগ করেছে (localStorage) — প্রতিটার নিজস্ব স্থায়ী id থাকে */
function getExtraMajlisPosts(majlisId) {
    return JSON.parse(localStorage.getItem('sylhetin_extra_posts_majlis_' + majlisId) || '[]');
}

/** কোনো মজলিসের সব পোস্ট — প্রতিটার সাথে fullId (data-post-id-এ ব্যবহারের জন্য) যুক্ত করে দেওয়া হয়
 *  বেস পোস্টের id সবসময় "post-<ইনডেক্স>" (স্থায়ী, নতুন পোস্ট যোগ হলেও বদলায় না)
 *  এক্সট্রা (ইউজারের যোগ করা) পোস্টের id তৈরির সময়ই বসানো থাকে (extra-<timestamp>) */
function getMajlisPosts(majlisId, baseMajlis) {
    const extra = getExtraMajlisPosts(majlisId);
    const base = (baseMajlis.posts || []).map(function (p, i) {
        return Object.assign({}, p, { id: 'post-' + i });
    });
    return extra.concat(base).map(function (p) {
        return Object.assign({}, p, { fullId: majlisId + '-' + p.id });
    });
}

/** নির্দিষ্ট নিউজ পেজে ইউজার যেসব নতুন পোস্ট যোগ করেছে (localStorage) — প্রতিটার নিজস্ব স্থায়ী id থাকে */
function getExtraNewsPosts(pageId) {
    return JSON.parse(localStorage.getItem('sylhetin_extra_posts_newspage_' + pageId) || '[]');
}

/** কোনো নিউজ পেজের সব পোস্ট — প্রতিটার সাথে fullId যুক্ত করে দেওয়া হয় */
function getNewsPagePosts(pageId, basePage) {
    const extra = getExtraNewsPosts(pageId);
    const base = basePage.posts || [];
    return extra.concat(base).map(function (p) {
        return Object.assign({}, p, { fullId: pageId + '-' + p.id });
    });
}

// ---------- মজলিস গ্রুপের তথ্য (majlis-detail.html ও search.html-এর জন্য) ----------
const sylhetinMajlisData = {
    'm1': {
        name: 'ফেঞ্চুগঞ্জ ইউনিয়ন মজলিস',
        icon: '🏠',
        members: '১২,৪০০',
        joined: true,
        description: 'ফেঞ্চুগঞ্জ ইউনিয়নের সবার জন্য নিজস্ব মজলিস — এলাকার খবর, আড্ডা আর একে অপরের খোঁজখবর রাখার জায়গা।',
        posts: [
            { author: 'রফিক আহমদ', time: '৩ ঘন্টা আগে', avatarLetter: 'র', text: 'আইজকা ইউনিয়ন পরিষদর সামনে নয়া রাস্তার কাম শুরু অইছে।' },
            { author: 'ছালমা বেগম', time: 'গতকাল', avatarLetter: 'ছ', text: 'মাইজগাঁও বাজারো আইজকা খুব ভিড় আছিল।' }
        ]
    },
    'm2': {
        name: 'সাহিত্য ও কবিতা',
        icon: '📚',
        members: '৩,৮০০',
        joined: false,
        description: 'সিলেটি ও বাংলা সাহিত্য, কবিতা এবং লেখালেখি নিয়ে আলোচনার মজলিস।',
        posts: [
            { author: 'আরিফ চৌধুরী', time: '৫ ঘন্টা আগে', avatarLetter: 'আ', text: 'নতুন একটি সিলেটী কবিতার বই পড়লাম, দারুণ লাগলো।' }
        ]
    },
    'm3': {
        name: 'প্রযুক্তি ও কোডিং',
        icon: '💻',
        members: '২,১৫০',
        joined: false,
        description: 'প্রোগ্রামিং, সফটওয়্যার এবং প্রযুক্তি নিয়ে আলোচনার জন্য মজলিস।',
        posts: [
            { author: 'হাসান আলী', time: '১ দিন আগে', avatarLetter: 'হ', text: 'Flutter দিয়ে অ্যাপ বানানো শিখতেছি, বেশ মজার!' }
        ]
    },
    'm4': {
        name: 'সিলেটী সংস্কৃতি',
        icon: '🎭',
        members: '৬,৯০০',
        joined: false,
        description: 'সিলেটি গান, নাটক, ঐতিহ্য আর সংস্কৃতি নিয়ে আলোচনার মজলিস।',
        posts: [
            { author: 'নাজমা আক্তার', time: '২ ঘন্টা আগে', avatarLetter: 'ন', text: 'পুরান দিনর সিলেটী গানর একটা অনুষ্ঠান দেখলাম, মন ভরি গেছে।' }
        ]
    },
    'm5': {
        name: 'প্রবাসী মজলিস — সৌদি আরব',
        icon: '✈️',
        members: '২১,৩০০',
        joined: false,
        description: 'সৌদি আরব প্রবাসী সিলেটিদের জন্য নিজস্ব মজলিস — দেশের খবর আর প্রবাসের অভিজ্ঞতা শেয়ারের জায়গা।',
        posts: [
            { author: 'মিজানুর রহমান', time: '৬ ঘন্টা আগে', avatarLetter: 'ম', text: 'বিদেশ বইয়া থাকিয়াও নিজর এলাকার খবর দেখলে মনে অয় বাড়িত ফিরি আইছি।' }
        ]
    }
};

// ---------- প্রোফাইল/মজলিস/নিউজ পেজের কভার-লোগো ছবি লোড করা (জেনেরিক, যেকোনো এনটিটির জন্য) ----------
function applyEntityPhotos(container) {
    const scope = container || document;
    scope.querySelectorAll('.profile-hero[data-entity-key]').forEach(function (hero) {
        const key = hero.getAttribute('data-entity-key');
        const cover = localStorage.getItem('sylhetin_photo_cover_' + key);
        if (cover) {
            hero.style.backgroundImage = 'url(' + cover + ')';
        }
        const avatarBig = hero.querySelector('.profile-avatar-big');
        const avatar = localStorage.getItem('sylhetin_photo_avatar_' + key);
        if (avatarBig && avatar) {
            avatarBig.style.backgroundImage = 'url(' + avatar + ')';
            avatarBig.classList.add('has-photo');
            Array.from(avatarBig.childNodes).forEach(function (node) {
                if (node.nodeType === Node.TEXT_NODE) node.textContent = '';
            });
        }
    });
}

// ---------- মজলিস জয়েন অবস্থা localStorage থেকে ফিরিয়ে আনা ----------
function restoreJoinStates(container) {
    const scope = container || document;
    scope.querySelectorAll('.majlis-item[data-majlis-id]').forEach(function (item) {
        const majId = item.getAttribute('data-majlis-id');
        const btn = item.querySelector('.join-btn');
        if (!btn) return;
        const saved = localStorage.getItem('sylhetin_joined_' + majId);
        if (saved === 'true') {
            btn.classList.add('joined');
            btn.textContent = '✅ যোগ দিছি';
        } else if (saved === 'false') {
            btn.classList.remove('joined');
            btn.textContent = 'যোগ করো';
        }
        // saved না থাকলে ডিফল্ট (হার্ডকোড করা) অবস্থাই থাকবে
    });
}

// ---------- ভয়েস কমেন্ট রেকর্ডিং ----------
let sylhetinActiveRecorder = null;
let sylhetinActiveChunks = [];
let sylhetinActiveMicBtn = null;
let sylhetinRecordStartTime = null;
let sylhetinRecordTimeout = null;

function stopVoiceRecording() {
    if (sylhetinActiveRecorder && sylhetinActiveRecorder.state !== 'inactive') {
        sylhetinActiveRecorder.stop();
    }
    clearTimeout(sylhetinRecordTimeout);
}

async function handleMicButtonClick(micBtn) {
    // ইতিমধ্যে রেকর্ড হচ্ছে আর এই বাটনেই আবার ক্লিক করলে — থামানো
    if (sylhetinActiveMicBtn === micBtn) {
        stopVoiceRecording();
        return;
    }
    // অন্য কোনো কমেন্ট বক্সে রেকর্ড চলছে
    if (sylhetinActiveRecorder) {
        showToast('আগের ভয়েস রেকর্ডিং আগে শেষ করেন');
        return;
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        showToast('আফনার ব্রাউজার ভয়েস রেকর্ড সাপোর্ট করে না');
        return;
    }

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        sylhetinActiveRecorder = recorder;
        sylhetinActiveChunks = [];
        sylhetinActiveMicBtn = micBtn;
        sylhetinRecordStartTime = Date.now();

        micBtn.classList.add('recording');
        micBtn.textContent = '⏹️';

        recorder.ondataavailable = function (e) {
            if (e.data.size > 0) sylhetinActiveChunks.push(e.data);
        };

        recorder.onstop = function () {
            const durationSec = Math.round((Date.now() - sylhetinRecordStartTime) / 1000);
            const blob = new Blob(sylhetinActiveChunks, { type: 'audio/webm' });
            stream.getTracks().forEach(function (track) { track.stop(); });

            const reader = new FileReader();
            reader.onload = function () {
                const audioData = reader.result;
                const postEl = micBtn.closest('.post');
                if (postEl) {
                    const postId = postEl.getAttribute('data-post-id');
                    const key = 'sylhetin_comments_' + postId;
                    const saved = JSON.parse(localStorage.getItem(key) || '[]');
                    saved.push({ type: 'voice', audioData: audioData, duration: durationSec + 's' });
                    localStorage.setItem(key, JSON.stringify(saved));
                    renderCommentsFor(postEl);
                }
                micBtn.classList.remove('recording');
                micBtn.textContent = '🎤';
                sylhetinActiveRecorder = null;
                sylhetinActiveMicBtn = null;
            };
            reader.readAsDataURL(blob);
        };

        recorder.start();

        // সর্বোচ্চ ৩০ সেকেন্ড — SRS অনুযায়ী
        sylhetinRecordTimeout = setTimeout(function () {
            stopVoiceRecording();
        }, 30000);

    } catch (err) {
        showToast('মাইক্রোফোন এক্সেস দেওয়া হয়নি');
    }
}

// ---------- জরিপ (Poll) রেজাল্ট রেন্ডার করা ----------
function renderPollResults(pollBox) {
    const pollId = pollBox.getAttribute('data-poll-id');
    const optionEls = pollBox.querySelectorAll('.poll-option');
    const saved = JSON.parse(localStorage.getItem('sylhetin_poll_' + pollId) || 'null');

    let votes = saved ? saved.votes : new Array(optionEls.length).fill(0);
    const votedIndex = saved ? saved.votedIndex : null;
    const total = votes.reduce(function (a, b) { return a + b; }, 0);

    optionEls.forEach(function (opt, i) {
        const bar = opt.querySelector('.poll-bar');
        const pctEl = opt.querySelector('.poll-pct');
        const pct = total > 0 ? Math.round((votes[i] / total) * 100) : 0;
        if (votedIndex !== null) {
            bar.style.width = pct + '%';
            pctEl.textContent = pct + '%';
            opt.classList.toggle('voted', i === votedIndex);
        } else {
            bar.style.width = '0%';
            pctEl.textContent = '';
        }
    });

    const totalEl = pollBox.querySelector('.poll-total');
    if (totalEl) {
        totalEl.textContent = votedIndex !== null ? total + ' জনে ভোট দিছইন' : 'ভোট দিতে একটা অপশনে ক্লিক করো';
    }
}


document.addEventListener('DOMContentLoaded', function () {

    // নিচের নেভিগেশনে বর্তমান পেজ হাইলাইট করা
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.bottom-nav a').forEach(function (link) {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        }
    });

    // মজলিস চিপ (ফিল্টার) টগল করা
    document.querySelectorAll('.chip-rail').forEach(function (rail) {
        const chips = rail.querySelectorAll('.chip');
        chips.forEach(function (chip) {
            chip.addEventListener('click', function () {
                chips.forEach(function (c) { c.classList.remove('active'); });
                chip.classList.add('active');
            });
        });
    });

    // (মজলিসে যোগ দেওয়া/ছাড়ার বাটন এখন নিচে ইভেন্ট ডেলিগেশন দিয়ে হ্যান্ডেল হয়, যাতে
    // ডাইনামিকভাবে যোগ হওয়া মজলিস-ডিটেইল পেজেও কাজ করে)

    // পেজ লোড হওয়ার সময় প্রতিটা পোস্টের কমেন্ট আর শেয়ার কাউন্ট দেখানো
    document.querySelectorAll('.post[data-post-id]').forEach(function (postEl) {
        renderCommentsFor(postEl);
        renderShareCountFor(postEl);
    });

    // পেজ লোড হওয়ার সময় মজলিসের জয়েন অবস্থা ফিরিয়ে আনা
    restoreJoinStates();
    restoreSaveStates();

    // পেজ লোড হওয়ার সময় প্রতিটা জরিপের ফলাফল দেখানো
    document.querySelectorAll('.poll-box[data-poll-id]').forEach(function (pollBox) {
        renderPollResults(pollBox);
    });

    // পেজ লোড হওয়ার সময় ফ্রেন্ড রিকোয়েস্ট/ফলো বাটনের সেভ করা অবস্থা ফিরিয়ে আনা
    document.querySelectorAll('.friend-btn[data-user-id]').forEach(function (btn) {
        const uid = btn.getAttribute('data-user-id');
        if (localStorage.getItem('sylhetin_friend_' + uid) === 'true') {
            btn.classList.add('sent');
            btn.textContent = '✅ রিকোয়েস্ট পাঠানো হইছে';
        }
    });
    document.querySelectorAll('.follow-btn[data-user-id]').forEach(function (btn) {
        const uid = btn.getAttribute('data-user-id');
        if (localStorage.getItem('sylhetin_following_' + uid) === 'true') {
            btn.classList.add('following');
            btn.textContent = '✅ ফলো করা হইছে';
        }
    });

    // পেজ লোডের সময় প্রোফাইল/মজলিস/নিউজ পেজের কভার-লোগো ছবি থাকলে সেট করা
    applyEntityPhotos();

    // ---------- রিয়েকশন পিকার, কমেন্ট, শেয়ার — সব ইভেন্ট ডেলিগেশন দিয়ে ----------
    // যাতে নতুন যোগ হওয়া পোস্টেও (localStorage থেকে) সব ফিচার কাজ করে

    function closeAllPickers(exceptWrap) {
        document.querySelectorAll('.reaction-picker.show').forEach(function (p) {
            if (!exceptWrap || !exceptWrap.contains(p)) {
                p.classList.remove('show');
            }
        });
    }

    document.addEventListener('click', function (e) {

        const reactBtn = e.target.closest('.reaction-btn');
        const reactItem = e.target.closest('.r-item');
        const commentToggle = e.target.closest('.comment-toggle');
        const commentSendBtn = e.target.closest('.comment-send-btn');
        const shareBtn = e.target.closest('.share-btn');
        const saveBtn = e.target.closest('.save-btn');

        // ১) রিয়েকশন বাটনে ক্লিক করলে পিকার খোলা/বন্ধ করা
        if (reactBtn) {
            const wrap = reactBtn.closest('.reaction-wrap');
            const picker = wrap.querySelector('.reaction-picker');
            const isOpen = picker.classList.contains('show');
            closeAllPickers(wrap);
            picker.classList.toggle('show', !isOpen);
            return;
        }

        // ২) পিকার থেকে রিয়েকশন বেছে নিলে
        if (reactItem) {
            const wrap = reactItem.closest('.reaction-wrap');
            const targetBtn = wrap.querySelector('.reaction-btn');
            const emoji = reactItem.getAttribute('data-emoji');
            const label = reactItem.getAttribute('data-label');
            targetBtn.querySelector('.r-emoji').textContent = emoji;
            targetBtn.querySelector('.r-label').textContent = label;
            targetBtn.setAttribute('data-emoji', emoji);
            targetBtn.classList.add('reacted');
            closeAllPickers();
            return;
        }

        // ৩) কমেন্ট বাটনে ক্লিক করলে কমেন্ট বক্স খোলা/বন্ধ করা
        if (commentToggle) {
            const postEl = commentToggle.closest('.post');
            const section = postEl.querySelector('.comment-section');
            section.classList.toggle('show');
            if (section.classList.contains('show')) {
                const input = section.querySelector('.comment-input');
                if (input) input.focus();
            }
            return;
        }

        // ৪) কমেন্ট পাঠানো
        if (commentSendBtn) {
            const postEl = commentSendBtn.closest('.post');
            const input = postEl.querySelector('.comment-input');
            const text = input.value.trim();
            if (text === '') return;
            const postId = postEl.getAttribute('data-post-id');
            const key = 'sylhetin_comments_' + postId;
            const saved = JSON.parse(localStorage.getItem(key) || '[]');
            saved.push({ type: 'text', text: text });
            localStorage.setItem(key, JSON.stringify(saved));
            renderCommentsFor(postEl);
            input.value = '';
            return;
        }

        // ৪ক) ভয়েস কমেন্ট রেকর্ড বাটন
        const micBtn = e.target.closest('.mic-btn');
        if (micBtn) {
            handleMicButtonClick(micBtn);
            return;
        }

        // ৫) শেয়ার বাটনে ক্লিক করলে কাউন্ট বাড়ানো
        if (shareBtn) {
            const postEl = shareBtn.closest('.post');
            const postId = postEl.getAttribute('data-post-id');
            const key = 'sylhetin_shares_' + postId;
            const count = parseInt(localStorage.getItem(key) || '0', 10) + 1;
            localStorage.setItem(key, count);
            renderShareCountFor(postEl);
            showToast('পোস্টটি শেয়ার অইছে!');
            return;
        }

        // ৫ক) সেভ বাটনে ক্লিক করলে সেভ/আনসেভ টগল
        if (saveBtn) {
            const postEl = saveBtn.closest('.post');
            const postId = postEl.getAttribute('data-post-id');
            const key = 'sylhetin_saved_' + postId;
            const isSaved = localStorage.getItem(key) === 'true';
            localStorage.setItem(key, isSaved ? 'false' : 'true');
            saveBtn.classList.toggle('saved', !isSaved);
            saveBtn.textContent = !isSaved ? '✅ সেভ করা হইছে' : '🔖 সেভ করো';
            showToast(!isSaved ? 'পোস্টটি সেভ করা হইছে!' : 'সেভ থাকি বাদ দেওয়া অইছে');
            return;
        }

        // ৬) পোস্টের লেখকের নাম/ছবিতে ক্লিক করলে সেই ব্যক্তির প্রোফাইলে যাওয়া
        // (নিউজ পেজের post-head-এ নিজস্ব onclick থাকে, data-user-id থাকে না, তাই এখানে হাত দেওয়া হয় না)
        const postHead = e.target.closest('.post-head[data-user-id]');
        if (postHead) {
            window.location.href = 'profile.html?id=' + postHead.getAttribute('data-user-id');
            return;
        }

        // ৭) "এনরে ছিনওনি?" সেকশনে কারো নাম/ছবিতে ক্লিক করলে সেই ব্যক্তির প্রোফাইলে যাওয়া
        // (তবে "যোগ করো" বাটনে ক্লিক করলে শুধু বাটনটাই টগল হবে, প্রোফাইলে যাবে না)
        const personCard = e.target.closest('.person-card[data-user-id]');
        if (personCard && !e.target.closest('.join-btn')) {
            window.location.href = 'profile.html?id=' + personCard.getAttribute('data-user-id');
            return;
        }

        // ৮) "যোগ করো" বাটন টগল (মজলিস তালিকা, মজলিস-ডিটেইল, বা পিপল সেকশন — সব জায়গায়)
        const joinBtn = e.target.closest('.join-btn');
        if (joinBtn) {
            const joined = joinBtn.classList.toggle('joined');
            joinBtn.textContent = joined ? '✅ যোগ দিছি' : 'যোগ করো';

            // মজলিসের জয়েন অবস্থা localStorage-এ সেভ করা, যাতে রিফ্রেশ দিলেও থাকে
            const majlisItem = joinBtn.closest('.majlis-item[data-majlis-id]');
            if (majlisItem) {
                const majId = majlisItem.getAttribute('data-majlis-id');
                localStorage.setItem('sylhetin_joined_' + majId, joined ? 'true' : 'false');
            }
            return;
        }

        // ৮ক) "ফ্রেন্ড রিকোয়েস্ট" বাটন টগল
        const friendBtn = e.target.closest('.friend-btn');
        if (friendBtn) {
            const uid = friendBtn.getAttribute('data-user-id');
            const key = 'sylhetin_friend_' + uid;
            const sent = friendBtn.classList.toggle('sent');
            friendBtn.textContent = sent ? '✅ রিকোয়েস্ট পাঠানো হইছে' : '➕ ফ্রেন্ড রিকোয়েস্ট';
            localStorage.setItem(key, sent ? 'true' : 'false');
            if (sent) showToast('ফ্রেন্ড রিকোয়েস্ট পাঠানো হইছে!');
            return;
        }

        // ৮খ) "ফলো" বাটন টগল (মজলিস তালিকা, নিউজ পেজ তালিকা, বা প্রোফাইল — সব জায়গায়)
        const followBtn = e.target.closest('.follow-btn');
        if (followBtn) {
            const uid = followBtn.getAttribute('data-user-id');
            const key = 'sylhetin_following_' + uid;
            const following = followBtn.classList.toggle('following');
            followBtn.textContent = following ? '✅ ফলো করা হইছে' : '👁️ ফলো';
            localStorage.setItem(key, following ? 'true' : 'false');
            return;
        }

        // ৯) মজলিস তালিকায় কোনো গ্রুপে ক্লিক করলে সেই গ্রুপের নিজস্ব ফিডে যাওয়া
        const majlisItem = e.target.closest('.majlis-item');
        if (majlisItem && majlisItem.hasAttribute('data-majlis-id')) {
            window.location.href = 'majlis-detail.html?id=' + majlisItem.getAttribute('data-majlis-id');
            return;
        }

        // ৯ক) নিউজ পেজ তালিকায় কোনো পেজে ক্লিক করলে সেই পেজের নিজস্ব ফিডে যাওয়া
        const newsPageItem = e.target.closest('.news-page-item');
        if (newsPageItem && newsPageItem.hasAttribute('data-news-page-id')) {
            window.location.href = 'news-page-detail.html?id=' + newsPageItem.getAttribute('data-news-page-id');
            return;
        }

        // ৯খ) কভার/প্রোফাইল-লোগো ফটো এডিট বাটন (প্রোফাইল, মজলিস, নিউজ পেজ — সব জায়গায় একই লজিক)
        const coverEditBtn = e.target.closest('.cover-edit-btn');
        if (coverEditBtn) {
            const hero = coverEditBtn.closest('.profile-hero');
            const input = hero ? hero.querySelector('.cover-file-input') : null;
            if (input) input.click();
            return;
        }
        const avatarEditBtn = e.target.closest('.avatar-edit-btn');
        if (avatarEditBtn) {
            const hero = avatarEditBtn.closest('.profile-hero');
            const input = hero ? hero.querySelector('.avatar-file-input') : null;
            if (input) input.click();
            return;
        }

        // ১০) জরিপে (Poll) ভোট দেওয়া
        const pollOption = e.target.closest('.poll-option');
        if (pollOption) {
            const pollBox = pollOption.closest('.poll-box');
            const pollId = pollBox.getAttribute('data-poll-id');
            const key = 'sylhetin_poll_' + pollId;
            const optionEls = Array.from(pollBox.querySelectorAll('.poll-option'));
            const index = optionEls.indexOf(pollOption);
            let saved = JSON.parse(localStorage.getItem(key) || 'null');

            if (!saved) {
                saved = { votes: new Array(optionEls.length).fill(0), votedIndex: null };
            }
            if (saved.votedIndex !== null) {
                showToast('আফনে আগেই এই জরিপো ভোট দিছইন!');
                return;
            }
            saved.votes[index] = (saved.votes[index] || 0) + 1;
            saved.votedIndex = index;
            localStorage.setItem(key, JSON.stringify(saved));
            renderPollResults(pollBox);
            return;
        }

        // ১০) বাইরে ক্লিক করলে সব রিয়েকশন পিকার বন্ধ হয়ে যাবে
        closeAllPickers();
    });

    // কমেন্ট বক্সে Enter চাপলে পাঠানো
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && e.target.classList.contains('comment-input')) {
            const sendBtn = e.target.closest('.comment-section').querySelector('.comment-send-btn');
            if (sendBtn) sendBtn.click();
        }
    });

    // কভার/প্রোফাইল-লোগো ফাইল সিলেক্ট করার পর সেভ ও দেখানো (প্রোফাইল, মজলিস, নিউজ পেজ — সব জায়গায়)
    document.addEventListener('change', function (e) {
        const coverInput = e.target.closest('.cover-file-input');
        if (coverInput) {
            const file = coverInput.files[0];
            if (!file) return;
            const hero = coverInput.closest('.profile-hero');
            const key = hero ? hero.getAttribute('data-entity-key') : null;
            if (!key) return;
            const reader = new FileReader();
            reader.onload = function (e2) {
                localStorage.setItem('sylhetin_photo_cover_' + key, e2.target.result);
                hero.style.backgroundImage = 'url(' + e2.target.result + ')';
                showToast('কভার ফটো পাল্টানো অইছে!');
            };
            reader.readAsDataURL(file);
            return;
        }

        const avatarInput = e.target.closest('.avatar-file-input');
        if (avatarInput) {
            const file = avatarInput.files[0];
            if (!file) return;
            const hero = avatarInput.closest('.profile-hero');
            const key = hero ? hero.getAttribute('data-entity-key') : null;
            const avatarBig = hero ? hero.querySelector('.profile-avatar-big') : null;
            if (!key || !avatarBig) return;
            const reader = new FileReader();
            reader.onload = function (e2) {
                localStorage.setItem('sylhetin_photo_avatar_' + key, e2.target.result);
                avatarBig.style.backgroundImage = 'url(' + e2.target.result + ')';
                Array.from(avatarBig.childNodes).forEach(function (node) {
                    if (node.nodeType === Node.TEXT_NODE) node.textContent = '';
                });
                showToast('প্রোফাইল/লোগো ফটো পাল্টানো অইছে!');
            };
            reader.readAsDataURL(file);
        }
    });

});

// ---------- চ্যাট ডেমো ডেটা (chat.html ও chat-room.html-এর জন্য) ----------
const sylhetinChatData = {
    'c1': {
        name: 'আব্দুর রাজ্জাক',
        status: 'সক্রিয় আছেন',
        messages: [
            { from: 'them', type: 'text', text: 'ভাই, খবর কি?' },
            { from: 'me', type: 'text', text: 'ভালা আছি, আফনে খিলা আছইন?' },
            { from: 'them', type: 'text', text: 'আজকের আবহাওয়াটা বেশ সুন্দর, তাই না?' }
        ]
    },
    'c2': {
        name: 'আরিফ চৌধুরী',
        status: '৩০ মিনিট আগে সক্রিয় ছিলেন',
        messages: [
            { from: 'them', type: 'voice', duration: '0:12' },
            { from: 'me', type: 'text', text: 'শুনছি নে, ধন্যবাদ পাঠানোর লাগি!' }
        ]
    },
    'c3': {
        name: 'সাফিয়া বেগম',
        status: 'গতকাল সক্রিয় ছিলেন',
        messages: [
            { from: 'me', type: 'text', text: 'আগামীকাল মজলিসের অনুষ্ঠানে আসতাছইন নি?' },
            { from: 'them', type: 'text', text: 'ঠিক আছে, দেখা হবে ইনশাআল্লাহ!' }
        ]
    }
};


window.Sylhetin = {
    renderCommentsFor: renderCommentsFor,
    renderShareCountFor: renderShareCountFor,
    showToast: showToast,
    newsPagesData: sylhetinNewsPagesData,
    findNewsPost: findNewsPost,
    majlisData: sylhetinMajlisData,
    chatData: sylhetinChatData,
    restoreJoinStates: restoreJoinStates,
    renderPollResults: renderPollResults,
    getAllMajlisData: getAllMajlisData,
    getAllNewsPagesData: getAllNewsPagesData,
    applyEntityPhotos: applyEntityPhotos,
    usersData: sylhetinUsersData,
    findUserIdByName: findUserIdByName,
    getMajlisPosts: getMajlisPosts,
    getNewsPagePosts: getNewsPagePosts,
    buildFeedCardHtml: buildFeedCardHtml,
    buildImagesGridHtml: buildImagesGridHtml,
    restoreSaveStates: restoreSaveStates
};
