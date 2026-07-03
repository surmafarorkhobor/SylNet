// ============================================
// SylNet Application Logic
// ============================================
console.log("SylNet Prototype Loaded");

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

    // মজলিসে যোগ দেওয়া / ছাড়ার বাটন টগল
    document.querySelectorAll('.join-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
            const joined = btn.classList.toggle('joined');
            btn.textContent = joined ? '✅ যোগ দিছি' : 'যোগ দাও';
        });
    });

});
