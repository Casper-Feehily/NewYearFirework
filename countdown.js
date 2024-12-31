function updateCountdown() {
    const now = new Date();
    const newYear = new Date('2025-01-01T00:00:00+08:00');
    const diff = newYear - now;

    // 计算剩余的天数、小时、分钟和秒数
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    // 格式化显示
    const countdownDisplay = `${days}天 ${hours}时 ${minutes}分 ${seconds}秒`;
    
    // 更新DOM
    const countdownElement = document.getElementById('countdown-numbers');
    if (countdownElement) {
        countdownElement.innerHTML = countdownDisplay;
    }

    // 如果到达新年，触发烟花
    if (diff <= 0) {
        countdownElement.innerHTML = "新年快乐！";
        // 自动触发烟花效果
        setInterval(() => {
            const event = new MouseEvent('click', {
                'view': window,
                'bubbles': true,
                'cancelable': true,
                'clientX': Math.random() * window.innerWidth,
                'clientY': Math.random() * window.innerHeight
            });
            document.dispatchEvent(event);
        }, 800); // 每800毫秒触发一次烟花
    }
}

// 每秒更新一次倒计时
setInterval(updateCountdown, 1000);

// 立即执行一次，避免延迟
updateCountdown();
