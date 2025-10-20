// 初始化画布
const canvas = document.getElementById('fireworksCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// 音效系统
class SoundSystem {
    constructor() {
        this.audioContext = null;
        this.isSoundEnabled = false;
        this.init();
    }
    
    init() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.isSoundEnabled = true;
            console.log('音效系统初始化成功');
        } catch (error) {
            console.log('Web Audio API 不支持，音效已禁用');
            this.isSoundEnabled = false;
        }
    }
    
    // 创建爆炸音效
    createExplosionSound(intensity = 1) {
        if (!this.isSoundEnabled || !this.audioContext) return;
        
        try {
            // 主爆炸声
            const mainOsc = this.audioContext.createOscillator();
            const mainGain = this.audioContext.createGain();
            
            mainOsc.type = 'sine';
            mainOsc.frequency.setValueAtTime(80 + intensity * 100, this.audioContext.currentTime);
            mainOsc.frequency.exponentialRampToValueAtTime(40, this.audioContext.currentTime + 0.8);
            
            mainGain.gain.setValueAtTime(0.4 * Math.min(intensity, 2), this.audioContext.currentTime);
            mainGain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 1);
            
            mainOsc.connect(mainGain);
            mainGain.connect(this.audioContext.destination);
            
            mainOsc.start();
            mainOsc.stop(this.audioContext.currentTime + 1);
            
            // 高频火花声
            const sparkOsc = this.audioContext.createOscillator();
            const sparkGain = this.audioContext.createGain();
            
            sparkOsc.type = 'square';
            sparkOsc.frequency.setValueAtTime(600 + intensity * 200, this.audioContext.currentTime);
            sparkOsc.frequency.exponentialRampToValueAtTime(200, this.audioContext.currentTime + 0.4);
            
            sparkGain.gain.setValueAtTime(0.2 * intensity, this.audioContext.currentTime);
            sparkGain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.4);
            
            sparkOsc.connect(sparkGain);
            sparkGain.connect(this.audioContext.destination);
            
            sparkOsc.start();
            sparkOsc.stop(this.audioContext.currentTime + 0.4);
            
        } catch (error) {
            console.log('音效播放失败');
        }
    }
    
    // 创建火花音效
    createSparkSound() {
        if (!this.isSoundEnabled || !this.audioContext) return;
        
        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.type = 'triangle';
            oscillator.frequency.setValueAtTime(1200, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(300, this.audioContext.currentTime + 0.2);
            
            gainNode.gain.setValueAtTime(0.15, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.2);
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.start();
            oscillator.stop(this.audioContext.currentTime + 0.2);
        } catch (error) {
            console.log('火花音效播放失败');
        }
    }
    
    toggleSound() {
        if (this.audioContext) {
            if (this.audioContext.state === 'suspended') {
                this.audioContext.resume();
                this.isSoundEnabled = true;
                console.log('音效已开启');
            } else {
                this.audioContext.suspend();
                this.isSoundEnabled = false;
                console.log('音效已关闭');
            }
        }
        return this.isSoundEnabled;
    }
}

// 创建星空背景
function createStars() {
    const starsContainer = document.getElementById('stars');
    const starCount = 200;
    
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        // 随机位置和大小
        const size = Math.random() * 3;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.animationDelay = `${Math.random() * 4}s`;
        
        starsContainer.appendChild(star);
    }
}

// 烟花粒子系统
class Particle {
    constructor(x, y, color, velocity, size = 2) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.velocity = velocity;
        this.size = size;
        this.alpha = 1;
        this.decay = Math.random() * 0.02 + 0.01;
        this.gravity = 0.1;
    }
    
    update() {
        this.velocity.x *= 0.99;
        this.velocity.y *= 0.99;
        this.velocity.y += this.gravity;
        
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= this.decay;
        this.size *= 0.99;
    }
    
    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

// 烟花系统
class Firework {
    constructor(x, y, color, particleCount, power) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.particleCount = particleCount;
        this.power = power;
        this.particles = [];
        this.createParticles();
    }
    
    createParticles() {
        const colors = this.generateColors();
        
        for (let i = 0; i < this.particleCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 3 * this.power + 2;
            const velocity = {
                x: Math.cos(angle) * speed,
                y: Math.sin(angle) * speed
            };
            
            const color = colors[Math.floor(Math.random() * colors.length)];
            const size = Math.random() * 3 + 1;
            
            this.particles.push(new Particle(
                this.x, this.y, color, velocity, size
            ));
        }
    }
    
    generateColors() {
        const colorMode = document.getElementById('colorSelect').value;
        
        switch(colorMode) {
            case 'red':
                return ['#ff2a6d', '#ff5e8d', '#ff8cad', '#ffafcd'];
            case 'blue':
                return ['#05d9e8', '#4ae8ff', '#8af6ff', '#b1fcff'];
            case 'green':
                return ['#00ff88', '#4dffa6', '#80ffc2', '#b3ffdd'];
            case 'purple':
                return ['#b967ff', '#c885ff', '#d6a3ff', '#e3c1ff'];
            case 'rainbow':
                return ['#ff2a6d', '#ff755a', '#ffb84d', '#e8ff5a', '#05d9e8', '#b967ff'];
            default:
                return [
                    '#ff2a6d', '#05d9e8', '#00ff88', '#ffb84d', 
                    '#b967ff', '#ff755a', '#4ae8ff', '#e8ff5a'
                ];
        }
    }
    
    update() {
        this.particles = this.particles.filter(particle => {
            particle.update();
            return particle.alpha > 0;
        });
    }
    
    draw() {
        this.particles.forEach(particle => particle.draw());
    }
    
    isComplete() {
        return this.particles.length === 0;
    }
}

// 全局变量
let fireworks = [];
let particlesCount = 0;
let fireworksCount = 0;
let clicksCount = 0;
let autoFireworksInterval = null;
let mouseX = 0;
let mouseY = 0;
let isMouseDown = false;
let lastClickTime = 0;
let soundSystem;

// 创建烟花
function createFirework(x, y, isSuper = false) {
    const particleCount = isSuper ? 
        parseInt(document.getElementById('particleCount').value) * 2 : 
        parseInt(document.getElementById('particleCount').value);
        
    const power = isSuper ? 
        parseInt(document.getElementById('explosionPower').value) * 1.5 : 
        parseInt(document.getElementById('explosionPower').value);
    
    const firework = new Firework(x, y, 'random', particleCount, power);
    fireworks.push(firework);
    
    // 播放音效
    if (soundSystem && soundSystem.isSoundEnabled) {
        soundSystem.createExplosionSound(power / 10);
        
        // 如果是超级烟花，添加额外音效
        if (isSuper) {
            setTimeout(() => {
                soundSystem.createSparkSound();
            }, 100);
            setTimeout(() => {
                soundSystem.createSparkSound();
            }, 200);
        }
    }
    
    fireworksCount++;
    particlesCount += particleCount;
    updateStats();
}

// 更新统计信息
function updateStats() {
    document.getElementById('fireworksCount').textContent = fireworksCount;
    document.getElementById('particlesCount').textContent = particlesCount;
    document.getElementById('clicksCount').textContent = clicksCount;
}

// 动画循环
function animate() {
    // 清除画布（带透明效果实现拖尾）
    const trailEnabled = document.getElementById('trailEffect').value === 'true';
    if (trailEnabled) {
        ctx.fillStyle = 'rgba(1, 1, 43, 0.1)';
    } else {
        ctx.fillStyle = 'rgba(1, 1, 43, 1)';
    }
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 更新和绘制所有烟花
    fireworks = fireworks.filter(firework => {
        firework.update();
        firework.draw();
        return !firework.isComplete();
    });
    
    requestAnimationFrame(animate);
}

// 控制面板隐藏/显示功能
function setupPanelToggle() {
    const controlPanel = document.getElementById('controlPanel');
    const controlToggle = document.getElementById('controlToggle');
    const toggleIcon = document.getElementById('toggleIcon');
    const keyboardHint = document.getElementById('keyboardHint');
    
    let isPanelVisible = true;
    
    // 切换面板显示状态
    function togglePanel() {
        isPanelVisible = !isPanelVisible;
        
        if (isPanelVisible) {
            controlPanel.classList.remove('hidden');
            toggleIcon.className = 'fas fa-sliders-h';
            controlToggle.title = '隐藏控制面板 (H)';
        } else {
            controlPanel.classList.add('hidden');
            toggleIcon.className = 'fas fa-eye';
            controlToggle.title = '显示控制面板 (H)';
        }
    }
    
    // 按钮点击事件
    controlToggle.addEventListener('click', togglePanel);
    
    // 键盘快捷键
    document.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === 'h') {
            e.preventDefault();
            togglePanel();
            
            // 显示快捷键提示
            keyboardHint.style.display = 'block';
            setTimeout(() => {
                keyboardHint.style.display = 'none';
            }, 2000);
        }
    });
    
    // 点击画布外部隐藏面板
    canvas.addEventListener('click', (e) => {
        if (!isPanelVisible) return;
        
        const panelRect = controlPanel.getBoundingClientRect();
        const toggleRect = controlToggle.getBoundingClientRect();
        
        // 如果点击位置不在面板或切换按钮上，且面板可见，则隐藏面板
        if (!isClickInRect(e, panelRect) && !isClickInRect(e, toggleRect)) {
            controlPanel.classList.add('hidden');
            toggleIcon.className = 'fas fa-eye';
            controlToggle.title = '显示控制面板 (H)';
            isPanelVisible = false;
        }
    });
    
    // 辅助函数：检查点击是否在矩形区域内
    function isClickInRect(event, rect) {
        return event.clientX >= rect.left && 
               event.clientX <= rect.right && 
               event.clientY >= rect.top && 
               event.clientY <= rect.bottom;
    }
    
    // 实时更新滑块数值显示
    const particleCountSlider = document.getElementById('particleCount');
    const particleCountValue = document.getElementById('particleCountValue');
    const explosionPowerSlider = document.getElementById('explosionPower');
    const explosionPowerValue = document.getElementById('explosionPowerValue');
    
    particleCountSlider.addEventListener('input', () => {
        particleCountValue.textContent = particleCountSlider.value;
    });
    
    explosionPowerSlider.addEventListener('input', () => {
        explosionPowerValue.textContent = explosionPowerSlider.value;
    });
}

// 使用说明隐藏/显示功能
function setupInstructionsToggle() {
    const instructions = document.getElementById('instructions');
    const instructionsToggle = document.getElementById('instructionsToggle');
    const instructionsIcon = document.getElementById('instructionsIcon');
    const keyboardHint = document.getElementById('keyboardHint');
    
    let isInstructionsVisible = true;
    
    // 切换说明显示状态
    function toggleInstructions() {
        isInstructionsVisible = !isInstructionsVisible;
        
        if (isInstructionsVisible) {
            instructions.classList.remove('hidden');
            instructionsIcon.className = 'fas fa-question';
            instructionsToggle.title = '隐藏使用说明 (I)';
        } else {
            instructions.classList.add('hidden');
            instructionsIcon.className = 'fas fa-eye';
            instructionsToggle.title = '显示使用说明 (I)';
        }
    }
    
    // 按钮点击事件
    instructionsToggle.addEventListener('click', toggleInstructions);
    
    // 键盘快捷键
    document.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === 'i') {
            e.preventDefault();
            toggleInstructions();
            
            // 显示快捷键提示
            keyboardHint.style.display = 'block';
            setTimeout(() => {
                keyboardHint.style.display = 'none';
            }, 2000);
        }
    });
}

// 标题隐藏/显示功能
function setupTitleToggle() {
    const header = document.getElementById('header');
    const titleToggle = document.getElementById('titleToggle');
    const titleIcon = document.getElementById('titleIcon');
    const keyboardHint = document.getElementById('keyboardHint');
    
    let isTitleVisible = true;
    
    // 切换标题显示状态
    function toggleTitle() {
        isTitleVisible = !isTitleVisible;
        
        if (isTitleVisible) {
            header.classList.remove('hidden');
            titleIcon.className = 'fas fa-heading';
            titleToggle.title = '隐藏标题 (T)';
        } else {
            header.classList.add('hidden');
            titleIcon.className = 'fas fa-eye';
            titleToggle.title = '显示标题 (T)';
        }
    }
    
    // 按钮点击事件
    titleToggle.addEventListener('click', toggleTitle);
    
    // 键盘快捷键
    document.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === 't') {
            e.preventDefault();
            toggleTitle();
            
            // 显示快捷键提示
            keyboardHint.style.display = 'block';
            setTimeout(() => {
                keyboardHint.style.display = 'none';
            }, 2000);
        }
    });
}

// 音效系统初始化
function setupSoundSystem() {
    try {
        soundSystem = new SoundSystem();
        
        // 自动播放策略：在用户交互后启用音效
        document.addEventListener('click', function enableSound() {
            if (soundSystem.audioContext && soundSystem.audioContext.state === 'suspended') {
                soundSystem.audioContext.resume();
            }
            document.removeEventListener('click', enableSound);
        }, { once: true });
        
    } catch (error) {
        console.log('音效系统初始化失败');
        soundSystem = { 
            createExplosionSound: () => {}, 
            createSparkSound: () => {},
            toggleSound: () => false,
            isSoundEnabled: false
        };
    }
}

// 事件监听器
function setupEventListeners() {
    // 修复点击事件 - 直接在canvas上监听
    canvas.addEventListener('click', (e) => {
        const currentTime = new Date().getTime();
        const timeDiff = currentTime - lastClickTime;
        
        // 如果是双击（300ms内连续点击）
        if (timeDiff < 300) {
            // 双击 - 超级烟花
            for (let i = 0; i < 3; i++) {
                setTimeout(() => {
                    createFirework(
                        e.clientX + (Math.random() - 0.5) * 100,
                        e.clientY + (Math.random() - 0.5) * 100,
                        true
                    );
                }, i * 200);
            }
        } else {
            // 单击 - 普通烟花
            clicksCount++;
            createFirework(e.clientX, e.clientY);
        }
        
        lastClickTime = currentTime;
    });

    // 鼠标移动和拖动
    canvas.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        if (isMouseDown) {
            createFirework(e.clientX, e.clientY);
        }
    });

    canvas.addEventListener('mousedown', () => {
        isMouseDown = true;
    });

    canvas.addEventListener('mouseup', () => {
        isMouseDown = false;
    });

    // 键盘事件
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            e.preventDefault();
            createFirework(
                Math.random() * canvas.width,
                Math.random() * canvas.height
            );
        }
    });

    // 窗口大小调整
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    // 控制按钮事件
    document.getElementById('autoFireworks').addEventListener('click', () => {
        if (autoFireworksInterval) {
            clearInterval(autoFireworksInterval);
            autoFireworksInterval = null;
            document.getElementById('autoFireworks').innerHTML = '<i class="fas fa-magic"></i> 自动烟花秀';
        } else {
            autoFireworksInterval = setInterval(() => {
                createFirework(
                    Math.random() * canvas.width,
                    Math.random() * canvas.height
                );
            }, 500);
            document.getElementById('autoFireworks').innerHTML = '<i class="fas fa-stop"></i> 停止自动';
        }
    });

    document.getElementById('clearAll').addEventListener('click', () => {
        fireworks = [];
    });

    document.getElementById('toggleSound').addEventListener('click', function() {
        const icon = this.querySelector('i');
        if (soundSystem) {
            const isEnabled = soundSystem.toggleSound();
            if (isEnabled) {
                icon.className = 'fas fa-volume-up';
                // 测试播放一个音效
                setTimeout(() => {
                    if (soundSystem.isSoundEnabled) {
                        soundSystem.createSparkSound();
                    }
                }, 100);
            } else {
                icon.className = 'fas fa-volume-mute';
            }
        } else {
            // 如果没有音效系统，显示提示
            icon.className = 'fas fa-volume-mute';
        }
    });
}

// 初始化
function init() {
    createStars();
    setupEventListeners();
    setupPanelToggle();
    setupInstructionsToggle();
    setupTitleToggle();
    setupSoundSystem();
    animate();
    
    // 开场动画 - 自动放几个烟花
    setTimeout(() => {
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                createFirework(
                    canvas.width / 2 + (Math.random() - 0.5) * 200,
                    canvas.height / 2 + (Math.random() - 0.5) * 200
                );
            }, i * 800);
        }
    }, 1000);
    
    // 显示键盘快捷键提示
    setTimeout(() => {
        const keyboardHint = document.getElementById('keyboardHint');
        keyboardHint.style.display = 'block';
        setTimeout(() => {
            keyboardHint.style.display = 'none';
        }, 3000);
    }, 2000);
}


// 音乐播放系统
class MusicPlayer {
    constructor() {
        try {
            this.audio = document.getElementById('backgroundMusic');
            if (!this.audio) {
                throw new Error('找不到音频元素');
            }
            this.isPlaying = false;
            this.volume = 0.5; // 默认音量50%
            this.init();
        } catch (error) {
            console.warn('音乐播放器初始化失败:', error.message);
            this.audio = null;
            this.isPlaying = false;
        }
    }
    
    init() {
        if (!this.audio) return;
        
        // 设置初始音量
        this.audio.volume = this.volume;
        
        // 监听音频加载事件
        this.audio.addEventListener('loadeddata', () => {
            console.log('背景音乐加载完成');
        });
        
        // 监听音频错误
        this.audio.addEventListener('error', (e) => {
            console.error('音乐加载失败:', e);
            this.showError('音乐文件加载失败，请检查文件路径');
        });
    }
    
    togglePlay() {
        if (!this.audio) {
            console.warn('音频元素不存在');
            return false;
        }
        
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
        return this.isPlaying;
    }
    
    play() {
        if (!this.audio) return;
        
        // 注意：现代浏览器要求用户交互后才能自动播放
        const playPromise = this.audio.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                this.isPlaying = true;
                this.updateIcon();
                console.log('音乐开始播放');
            }).catch(error => {
                console.log('自动播放被阻止，需要用户交互:', error);
                this.showError('请点击播放按钮开始音乐');
            });
        }
    }
    
    pause() {
        if (!this.audio) return;
        this.audio.pause();
        this.isPlaying = false;
        this.updateIcon();
    }
    
    setVolume(volume) {
        if (!this.audio) return;
        this.volume = volume / 100;
        this.audio.volume = this.volume;
    }
    
    updateIcon() {
        const icon = document.getElementById('musicIcon');
        if (icon) {
            if (this.isPlaying) {
                icon.className = 'fas fa-pause';
            } else {
                icon.className = 'fas fa-play';
            }
        }
    }
    
    showError(message) {
        // 简单的错误提示
        const hint = document.getElementById('keyboardHint');
        if (hint) {
            hint.textContent = message;
            hint.style.display = 'block';
            setTimeout(() => {
                hint.style.display = 'none';
            }, 3000);
        }
    }
}

// 在全局变量部分添加音乐播放器
let musicPlayer;

// 添加音乐播放器初始化函数
function setupMusicPlayer() {
    try {
        musicPlayer = new MusicPlayer();
        console.log('音乐播放器初始化成功');
    } catch (error) {
        console.error('音乐播放器初始化失败:', error);
        // 创建一个安全的空对象，避免影响其他功能
        musicPlayer = {
            togglePlay: () => { console.log('音乐功能不可用'); return false; },
            setVolume: () => {},
            isPlaying: false
        };
    }
}

// 添加音乐控制事件监听
function setupMusicControls() {
    const toggleMusicBtn = document.getElementById('toggleMusic');
    const volumeSlider = document.getElementById('musicVolume');
    
    if (!toggleMusicBtn || !volumeSlider) {
        console.warn('音乐控制元素未找到，跳过音乐控制初始化');
        return;
    }
    
    // 播放/暂停按钮
    toggleMusicBtn.addEventListener('click', () => {
        musicPlayer.togglePlay();
    });
    
    // 音量调节
    volumeSlider.addEventListener('input', (e) => {
        musicPlayer.setVolume(e.target.value);
    });
    
    // 键盘快捷键 M - 切换音乐播放
    document.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === 'm') {
            e.preventDefault();
            musicPlayer.togglePlay();
            
            // 显示提示
            const hint = document.getElementById('keyboardHint');
            if (hint) {
                hint.textContent = `音乐 ${musicPlayer.isPlaying ? '播放中' : '已暂停'}`;
                hint.style.display = 'block';
                setTimeout(() => {
                    hint.style.display = 'none';
                }, 2000);
            }
        }
    });
}

// 修改初始化函数，添加音乐播放器初始化
function init() {
    // 先初始化基本功能
    createStars();
    setupEventListeners();
    setupPanelToggle();
    setupInstructionsToggle();
    setupTitleToggle();
    setupSoundSystem();
    
    // 然后初始化音乐播放器（即使失败也不影响烟花）
    try {
        setupMusicPlayer();
        setupMusicControls();
    } catch (error) {
        console.warn('音乐播放器初始化失败，但不影响烟花效果:', error);
    }
    
    // 最后启动动画
    animate();
    
    // 开场动画 - 自动放几个烟花
    setTimeout(() => {
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                createFirework(
                    canvas.width / 2 + (Math.random() - 0.5) * 200,
                    canvas.height / 2 + (Math.random() - 0.5) * 200
                );
            }, i * 800);
        }
    }, 1000);
    
    // 显示键盘快捷键提示
    setTimeout(() => {
        const keyboardHint = document.getElementById('keyboardHint');
        if (keyboardHint) {
            keyboardHint.style.display = 'block';
            setTimeout(() => {
                keyboardHint.style.display = 'none';
            }, 3000);
        }
    }, 2000);
}








// 启动应用
init();





