// ============================================
// SylNet Application Logic
// ============================================
console.log("SylNet Prototype Loaded");

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

// ---------- কমেন্ট রেন্ডার করা (localStorage থেকে) ----------
function renderCommentsFor(postEl) {
    const postId = postEl.getAttribute('data-post-id');
    if (!postId) return;
    const list = postEl.querySelector('.comment-list');
    if (!list) return;
    list.innerHTML = '';
    const saved = JSON.parse(localStorage.getItem('sylnet_comments_' + postId) || '[]');
    saved.forEach(function (c) {
        const li = document.createElement('li');
        li.className = 'comment-item';
        li.innerHTML = '<div class="user-avatar" style="width:30px;height:30px;font-size:12px;">👤</div>' +
            '<div class="bubble"><span class="c-name">আপনি</span>' + c + '</div>';
        list.appendChild(li);
    });
}

// ---------- শেয়ার কাউন্ট রেন্ডার করা ----------
function renderShareCountFor(postEl) {
    const postId = postEl.getAttribute('data-post-id');
    if (!postId) return;
    const btn = postEl.querySelector('.share-btn');
    if (!btn) return;
    const count = parseInt(localStorage.getItem('sylnet_shares_' + postId) || '0', 10);
    btn.textContent = count > 0
        ? '↗️ আরো মানরে দেখাউক্কা (' + count + ')'
        : '↗️ আরো মানরে দেখাউক্কা';
}

// ---------- খবরের বিস্তারিত তথ্য (news-detail.html-এর জন্য) ----------
const sylnetNewsData = {
    'news-1': {
        title: 'সকালের আপডেট: সিলেটে বৃষ্টির সম্ভাবনা',
        source: 'Surma Faror Khobor',
        time: 'আজ',
        body: 'আবহাওয়ার পূর্বাভাস অনুযায়ী আজ সিলেটে হালকা থেকে মাঝারি বৃষ্টির সম্ভাবনা রয়েছে। স্থানীয় কৃষকদের ফসল রক্ষার জন্য প্রয়োজনীয় ব্যবস্থা নিতে পরামর্শ দেওয়া হয়েছে। আবহাওয়া অধিদপ্তর জানিয়েছে, বিকেলের দিকে বৃষ্টির পরিমাণ কিছুটা বাড়তে পারে, তবে রাতের মধ্যে আকাশ পরিষ্কার হয়ে যাওয়ার সম্ভাবনা আছে।'
    },
    'news-2': {
        title: 'নতুন বইমেলা বিষয়ক আলোচনা',
        source: 'Surma Faror Khobor',
        time: 'গতকাল',
        body: 'সাহিত্য ও কবিতা মজলিসের সদস্যরা আগামী সপ্তাহে অনুষ্ঠিতব্য বইমেলা নিয়ে একটি বিশেষ আড্ডার আয়োজন করেছেন। স্থানীয় লেখক ও কবিরা তাদের নতুন বই নিয়ে আলোচনা করবেন। মেলায় সিলেটি ভাষা ও সংস্কৃতি বিষয়ক বইয়ের একটি আলাদা কর্নার থাকবে বলে আয়োজকরা জানিয়েছেন।'
    },
    'news-3': {
        title: 'বিয়ানীবাজারে নয়া রাস্তা উদ্বোধন',
        source: 'Surma Faror Khobor',
        time: '২ দিন আগে',
        body: 'এলাকাবাসীর দীর্ঘদিনের দাবির প্রেক্ষিতে বিয়ানীবাজার উপজেলায় নতুন রাস্তার নির্মাণকাজ অবশেষে সম্পন্ন হয়েছে। স্থানীয় জনপ্রতিনিধিরা জানিয়েছেন, এই রাস্তা দিয়ে যোগাযোগ ব্যবস্থার উল্লেখযোগ্য উন্নতি হবে এবং ব্যবসায়ীদের পণ্য পরিবহনে সুবিধা হবে। এলাকাবাসী এই উদ্যোগে খুশি প্রকাশ করেছেন।'
    }
};

// ---------- মজলিস গ্রুপের তথ্য (majlis-detail.html ও search.html-এর জন্য) ----------
const sylnetMajlisData = {
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

    // পেজ লোডের সময় প্রোফাইল/কভার ছবি থাকলে সেট করা
    const coverEl = document.getElementById('coverPhoto');
    const avatarEl = document.getElementById('avatarPhoto');
    const savedCover = localStorage.getItem('sylnet_cover');
    const savedAvatar = localStorage.getItem('sylnet_avatar');
    if (coverEl && savedCover) {
        coverEl.style.backgroundImage = 'url(' + savedCover + ')';
    }
    if (avatarEl && savedAvatar) {
        avatarEl.style.backgroundImage = 'url(' + savedAvatar + ')';
        avatarEl.classList.add('has-photo');
        avatarEl.childNodes.forEach(function (node) {
            if (node.nodeType === Node.TEXT_NODE) node.textContent = '';
        });
    }

    // কভার ফটো আপলোড
    const coverBtn = document.getElementById('coverEditBtn');
    const coverInput = document.getElementById('coverInput');
    if (coverBtn && coverInput) {
        coverBtn.addEventListener('click', function () { coverInput.click(); });
        coverInput.addEventListener('change', function () {
            const file = coverInput.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = function (e) {
                localStorage.setItem('sylnet_cover', e.target.result);
                coverEl.style.backgroundImage = 'url(' + e.target.result + ')';
                showToast('কভার ফটো পাল্টানো অইছে!');
            };
            reader.readAsDataURL(file);
        });
    }

    // প্রোফাইল ফটো আপলোড
    const avatarBtn = document.getElementById('avatarEditBtn');
    const avatarInput = document.getElementById('avatarInput');
    if (avatarBtn && avatarInput) {
        avatarBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            avatarInput.click();
        });
        avatarInput.addEventListener('change', function () {
            const file = avatarInput.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = function (e) {
                localStorage.setItem('sylnet_avatar', e.target.result);
                avatarEl.style.backgroundImage = 'url(' + e.target.result + ')';
                avatarEl.childNodes.forEach(function (node) {
                    if (node.nodeType === Node.TEXT_NODE) node.textContent = '';
                });
                showToast('প্রোফাইল ফটো পাল্টানো অইছে!');
            };
            reader.readAsDataURL(file);
        });
    }

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
            const key = 'sylnet_comments_' + postId;
            const saved = JSON.parse(localStorage.getItem(key) || '[]');
            saved.push(text);
            localStorage.setItem(key, JSON.stringify(saved));
            renderCommentsFor(postEl);
            input.value = '';
            return;
        }

        // ৫) শেয়ার বাটনে ক্লিক করলে কাউন্ট বাড়ানো
        if (shareBtn) {
            const postEl = shareBtn.closest('.post');
            const postId = postEl.getAttribute('data-post-id');
            const key = 'sylnet_shares_' + postId;
            const count = parseInt(localStorage.getItem(key) || '0', 10) + 1;
            localStorage.setItem(key, count);
            renderShareCountFor(postEl);
            showToast('পোস্টটি শেয়ার অইছে!');
            return;
        }

        // ৬) পোস্টের লেখকের নাম/ছবিতে ক্লিক করলে প্রোফাইলে যাওয়া
        const postHead = e.target.closest('.post-head');
        if (postHead) {
            window.location.href = 'profile.html';
            return;
        }

        // ৭) "এনরে ছিনওনি?" সেকশনে কারো নাম/ছবিতে ক্লিক করলে প্রোফাইলে যাওয়া
        // (তবে "যোগ করো" বাটনে ক্লিক করলে শুধু বাটনটাই টগল হবে, প্রোফাইলে যাবে না)
        const personCard = e.target.closest('.person-card');
        if (personCard && !e.target.closest('.join-btn')) {
            window.location.href = 'profile.html';
            return;
        }

        // ৮) "যোগ করো" বাটন টগল (মজলিস তালিকা, মজলিস-ডিটেইল, বা পিপল সেকশন — সব জায়গায়)
        const joinBtn = e.target.closest('.join-btn');
        if (joinBtn) {
            const joined = joinBtn.classList.toggle('joined');
            joinBtn.textContent = joined ? '✅ যোগ দিছি' : 'যোগ করো';
            return;
        }

        // ৯) মজলিস তালিকায় কোনো গ্রুপে ক্লিক করলে সেই গ্রুপের নিজস্ব ফিডে যাওয়া
        const majlisItem = e.target.closest('.majlis-item');
        if (majlisItem && majlisItem.hasAttribute('data-majlis-id')) {
            window.location.href = 'majlis-detail.html?id=' + majlisItem.getAttribute('data-majlis-id');
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

});

// অন্য স্ক্রিপ্ট থেকে ব্যবহারের জন্য (যেমন নতুন পোস্ট যোগ হওয়ার সময়, বা news-detail.html)
window.SylNet = {
    renderCommentsFor: renderCommentsFor,
    renderShareCountFor: renderShareCountFor,
    showToast: showToast,
    newsData: sylnetNewsData,
    majlisData: sylnetMajlisData
};
