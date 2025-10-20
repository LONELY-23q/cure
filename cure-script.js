// 泡泡减压功能
const bubbleArea = document.getElementById('bubbleArea');
const bubbleCountDisplay = document.getElementById('bubbleCount');
let bubbleCount = 0;

function createBubble() {
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    
    // 随机大小和位置
    const size = Math.random() * 40 + 20;
    const x = Math.random() * (bubbleArea.offsetWidth - size);
    const y = Math.random() * (bubbleArea.offsetHeight - size);
    
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    bubble.style.left = `${x}px`;
    bubble.style.top = `${y}px`;
    
    // 随机颜色
    const hue = Math.random() * 60 + 180; // 蓝色到青色范围
    bubble.style.background = `hsla(${hue}, 70%, 80%, 0.7)`;
    
    bubble.addEventListener('click', function() {
        bubble.classList.add('popped');
        bubbleCount++;
        bubbleCountDisplay.textContent = bubbleCount;
        
        // 播放泡泡音效（模拟）
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 200 + Math.random() * 300;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
        
        setTimeout(() => {
            bubble.remove();
        }, 300);
    });
    
    bubbleArea.appendChild(bubble);
}

// 初始化泡泡
for (let i = 0; i < 15; i++) {
    createBubble();
}

// 定期添加新泡泡
setInterval(createBubble, 2000);

// 心情记录功能
const moodOptions = document.querySelectorAll('.mood-option');
const moodMessage = document.getElementById('moodMessage');

moodOptions.forEach(option => {
    option.addEventListener('click', function() {
        // 移除之前的选择
        moodOptions.forEach(opt => opt.classList.remove('selected'));
        
        // 标记当前选择
        this.classList.add('selected');
        
        // 更新消息
        const mood = this.getAttribute('data-mood');
        const messages = {
            sad: "没关系，每个人都有低落的时候。给自己一点时间和空间。",
            neutral: "平静也是一种美好。享受此刻的宁静吧。",
            happy: "看到你开心真好！继续保持这份好心情！",
            excited: "哇！你看起来充满活力！有什么好消息要分享吗？",
            love: "爱是最美的情感。愿你的心中永远充满爱与温暖。"
        };
        
        moodMessage.textContent = messages[mood];
    });
});

// 冥想呼吸功能
const breathingCircle = document.getElementById('breathingCircle');
const breathInstruction = document.getElementById('breathInstruction');
let isBreathing = false;
let breathInterval;

breathingCircle.addEventListener('click', function() {
    if (!isBreathing) {
        // 开始呼吸练习
        isBreathing = true;
        breathingCircle.classList.add('breathing');
        breathingCircle.textContent = "呼吸中...";
        
        let step = 0;
        const instructions = [
            "缓慢吸气...",
            "屏住呼吸...",
            "缓慢呼气...",
            "休息片刻..."
        ];
        
        breathInstruction.textContent = instructions[0];
        
        breathInterval = setInterval(() => {
            step = (step + 1) % 4;
            breathInstruction.textContent = instructions[step];
        }, 4000);
    } else {
        // 停止呼吸练习
        isBreathing = false;
        breathingCircle.classList.remove('breathing');
        breathingCircle.textContent = "点击开始呼吸练习";
        breathInstruction.textContent = "吸气... 屏息... 呼气...";
        clearInterval(breathInterval);
    }
});

// 星空许愿功能
const wishArea = document.getElementById('wishArea');
const wishInput = document.getElementById('wishInput');
const wishButton = document.getElementById('wishButton');

// 创建星星背景
function createStars() {
    for (let i = 0; i < 50; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        const size = Math.random() * 3 + 1;
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const duration = Math.random() * 4 + 2;
        
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.left = `${x}%`;
        star.style.top = `${y}%`;
        star.style.animationDuration = `${duration}s`;
        
        wishArea.appendChild(star);
    }
}

createStars();

wishButton.addEventListener('click', function() {
    const wish = wishInput.value.trim();
    if (wish) {
        // 创建流星效果
        const shootingStar = document.createElement('div');
        shootingStar.style.position = 'absolute';
        shootingStar.style.width = '2px';
        shootingStar.style.height = '2px';
        shootingStar.style.background = 'white';
        shootingStar.style.borderRadius = '50%';
        shootingStar.style.boxShadow = '0 0 10px 2px white';
        shootingStar.style.left = '10%';
        shootingStar.style.top = '20%';
        
        wishArea.appendChild(shootingStar);
        
        // 流星动画
        const animation = shootingStar.animate([
            { transform: 'translate(0, 0)', opacity: 1 },
            { transform: 'translate(500px, 200px)', opacity: 0 }
        ], {
            duration: 1500,
            easing: 'ease-out'
        });
        
        animation.onfinish = () => {
            shootingStar.remove();
        };
        
        // 显示愿望已发送消息
        alert(`你的心愿"${wish}"已随流星飞向星空！✨`);
        wishInput.value = '';
    } else {
        alert('请先写下你的心愿！');
    }
});



// 自然声音播放器功能 - 修复版
const soundOptions = document.querySelectorAll('.sound-option');
const volumeSlider = document.getElementById('volumeSlider');
const soundStatus = document.getElementById('soundStatus');

let currentAudio = null;
let currentSound = null;

// 使用在线音频资源（免版权的自然声音）
const soundFiles = {
    rain: '../music/Totoro.mp3',
    waves: '../music/Spirited away.mp3',
    birds: '../music/background.mp3',
    forest: '../music/Aprial Encounter.mp3'
};

// 备用音频资源（如果上面的链接不可用）
const backupSoundFiles = {
    rain: 'https://www.soundjay.com/nature/rain-01.mp3',
    waves: 'https://www.soundjay.com/nature/ocean-wave-1.mp3',
    birds: 'https://www.soundjay.com/nature/birds-chirping.mp3',
    forest: 'https://www.soundjay.com/nature/forest-ambience.mp3'
};

// 初始化声音播放器
function initSoundPlayer() {
    // 设置音量控制
    volumeSlider.addEventListener('input', function() {
        if (currentAudio) {
            currentAudio.volume = this.value / 100;
        }
    });
    
    // 为每个声音选项添加点击事件
    soundOptions.forEach(option => {
        option.addEventListener('click', function() {
            const sound = this.getAttribute('data-sound');
            
            // 如果点击的是当前正在播放的声音，则停止播放
            if (currentSound === sound) {
                stopSound();
                return;
            }
            
            // 播放新声音
            playSound(sound);
        });
    });
}

// 播放声音
function playSound(sound) {
    // 停止当前播放的声音
    stopSound();
    
    // 移除所有选项的播放状态
    soundOptions.forEach(opt => opt.classList.remove('playing'));
    
    // 设置当前播放的声音
    currentSound = sound;
    
    // 标记当前播放的选项
    document.querySelector(`.sound-option[data-sound="${sound}"]`).classList.add('playing');
    
    // 创建音频对象
    currentAudio = new Audio();
    currentAudio.loop = true;
    currentAudio.volume = volumeSlider.value / 100;
    
    // 设置音频源
    currentAudio.src = soundFiles[sound];
    
    // 播放音频
    currentAudio.play().then(() => {
        soundStatus.textContent = `正在播放${getSoundName(sound)} - 使用滑块调整音量`;
        soundStatus.style.color = '#4CAF50';
    }).catch(error => {
        console.error('播放失败，尝试备用音频:', error);
        // 如果主要音频失败，尝试备用音频
        tryBackupAudio(sound);
    });
    
    // 添加错误处理
    currentAudio.addEventListener('error', function() {
        console.error('音频加载失败:', sound);
        tryBackupAudio(sound);
    });
}

// 尝试播放备用音频
function tryBackupAudio(sound) {
    if (currentAudio && backupSoundFiles[sound]) {
        currentAudio.src = backupSoundFiles[sound];
        currentAudio.play().then(() => {
            soundStatus.textContent = `正在播放${getSoundName(sound)} (备用源) - 使用滑块调整音量`;
            soundStatus.style.color = '#FF9800';
        }).catch(error => {
            console.error('备用音频也播放失败:', error);
            soundStatus.textContent = '音频播放失败，请检查网络连接';
            soundStatus.style.color = '#F44336';
            stopSound();
        });
    }
}

// 停止声音
function stopSound() {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentAudio = null;
    }
    
    // 移除播放状态
    soundOptions.forEach(opt => opt.classList.remove('playing'));
    
    currentSound = null;
    soundStatus.textContent = '选择一个声音开始播放';
    soundStatus.style.color = '#666';
}

// 获取声音名称
function getSoundName(sound) {
    const soundNames = {
        rain: 'Totoro（龙猫）',
        waves: '与你同在',
        birds: '鸟之诗',
        forest: '森林声音'
    };
    return soundNames[sound] || '自然声音';
}

// 初始化声音播放器
initSoundPlayer();

// 页面卸载时停止所有声音
window.addEventListener('beforeunload', function() {
    stopSound();
});

// 植物养成功能
const plant = document.getElementById('plant');
const growthValue = document.getElementById('growthValue');
const moodValue = document.getElementById('moodValue');
const breatheTask = document.getElementById('breatheTask');
const moodTask = document.getElementById('moodTask');
const gratitudeTask = document.getElementById('gratitudeTask');

let plantGrowth = parseInt(localStorage.getItem('plantGrowth')) || 0;
let plantMood = parseInt(localStorage.getItem('plantMood')) || 50;
let completedTasks = JSON.parse(localStorage.getItem('completedTasks')) || {
    breathe: false,
    mood: false,
    gratitude: false
};

// 初始化植物状态
function initPlant() {
    growthValue.textContent = plantGrowth;
    moodValue.textContent = plantMood;
    updatePlantAppearance();
    updateTaskButtons();
}

// 更新植物外观
function updatePlantAppearance() {
    // 移除所有级别类
    plant.className = 'plant';
    
    // 根据成长值设置植物级别
    if (plantGrowth >= 80) {
        plant.classList.add('level-5');
    } else if (plantGrowth >= 60) {
        plant.classList.add('level-4');
    } else if (plantGrowth >= 40) {
        plant.classList.add('level-3');
    } else if (plantGrowth >= 20) {
        plant.classList.add('level-2');
    } else if (plantGrowth >= 5) {
        plant.classList.add('level-1');
    }
}

// 更新任务按钮状态
function updateTaskButtons() {
    breatheTask.disabled = completedTasks.breathe;
    moodTask.disabled = completedTasks.mood;
    gratitudeTask.disabled = completedTasks.gratitude;
    
    // 更新按钮文本
    breatheTask.textContent = completedTasks.breathe ? '已完成呼吸练习' : '完成呼吸练习';
    moodTask.textContent = completedTasks.mood ? '已记录心情' : '记录心情';
    gratitudeTask.textContent = completedTasks.gratitude ? '已写感恩日记' : '写感恩日记';
}

// 完成任务
function completeTask(taskType) {
    if (!completedTasks[taskType]) {
        completedTasks[taskType] = true;
        plantGrowth += 10;
        plantMood = Math.min(plantMood + 15, 100);
        
        // 保存到本地存储
        localStorage.setItem('plantGrowth', plantGrowth);
        localStorage.setItem('plantMood', plantMood);
        localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
        
        // 更新显示
        growthValue.textContent = plantGrowth;
        moodValue.textContent = plantMood;
        updatePlantAppearance();
        updateTaskButtons();
        
        // 显示鼓励消息
        showMessage(`太棒了！你的植物因为${getTaskName(taskType)}而成长了！`);
        
        // 检查是否所有任务都完成了
        checkAllTasksCompleted();
    }
}

// 获取任务名称
function getTaskName(taskType) {
    const taskNames = {
        breathe: '呼吸练习',
        mood: '心情记录',
        gratitude: '感恩日记'
    };
    return taskNames[taskType] || '完成任务';
}

// 显示消息
function showMessage(message) {
    // 创建自定义消息提示
    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    // 添加动画样式
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);
    
    // 3秒后自动移除
    setTimeout(() => {
        messageDiv.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(messageDiv);
        }, 300);
    }, 3000);
}

// 检查所有任务是否完成
function checkAllTasksCompleted() {
    if (Object.values(completedTasks).every(task => task)) {
        // 重置任务状态，但保留成长值
        completedTasks = {
            breathe: false,
            mood: false,
            gratitude: false
        };
        localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
        updateTaskButtons();
        showMessage('恭喜！你完成了所有今日任务！明天继续照顾你的植物吧！');
    }
}

// 任务按钮事件监听
breatheTask.addEventListener('click', () => completeTask('breathe'));
moodTask.addEventListener('click', () => completeTask('mood'));
gratitudeTask.addEventListener('click', () => completeTask('gratitude'));

// 初始化植物
initPlant();

// 色彩疗法功能
const colorOptions = document.querySelectorAll('.color-option');
const colorDisplay = document.getElementById('colorDisplay');
const colorBreathing = document.getElementById('colorBreathing');

let currentColor = null;
let breathingInterval = null;

// 初始化色彩疗法
function initColorTherapy() {
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            const colorType = this.getAttribute('data-color');
            applyColorTherapy(colorType);
        });
    });
}

// 应用色彩疗法
function applyColorTherapy(colorType) {
    // 停止之前的呼吸效果
    if (breathingInterval) {
        clearInterval(breathingInterval);
        colorBreathing.style.transform = 'scale(1)';
    }
    
    // 设置颜色和消息
    const colorInfo = getColorInfo(colorType);
    colorDisplay.style.background = colorInfo.background;
    colorDisplay.innerHTML = colorInfo.message;
    colorDisplay.style.color = colorInfo.textColor;
    
    // 设置呼吸效果
    colorBreathing.style.background = colorInfo.background;
    colorBreathing.style.color = colorInfo.textColor;
    
    // 开始呼吸动画
    startBreathingAnimation(colorInfo.background);
    
    // 显示颜色描述
    showColorDescription(colorInfo);
}

// 获取颜色信息
function getColorInfo(colorType) {
    const colorMap = {
        calm: {
            background: 'linear-gradient(135deg, #87CEEB 0%, #E0F7FA 100%)',
            message: '<span style="font-size: 1.2em;">🌊 平静与安宁</span><br>让蓝色带走你的焦虑，带来内心的平静',
            textColor: '#1565C0',
            description: '蓝色有助于降低血压和心率，带来平静和放松的感觉。'
        },
        energy: {
            background: 'linear-gradient(135deg, #FF6B6B 0%, #FFE0E0 100%)',
            message: '<span style="font-size: 1.2em;">🔥 活力与热情</span><br>让红色点燃你的激情，激发内在能量',
            textColor: '#C62828',
            description: '红色能够增加能量水平，提高心率和肾上腺素，带来活力。'
        },
        happy: {
            background: 'linear-gradient(135deg, #FFD93D 0%, #FFF9C4 100%)',
            message: '<span style="font-size: 1.2em;">☀️ 快乐与乐观</span><br>让黄色照亮你的心情，带来温暖和快乐',
            textColor: '#F9A825',
            description: '黄色能够刺激神经系统，促进快乐感和乐观情绪。'
        },
        balance: {
            background: 'linear-gradient(135deg, #6BCF7F 0%, #C8E6C9 100%)',
            message: '<span style="font-size: 1.2em;">🌿 平衡与和谐</span><br>让绿色平衡你的情绪，带来和谐与新生',
            textColor: '#2E7D32',
            description: '绿色有助于创造平衡和和谐，缓解压力，促进放松。'
        }
    };
    
    return colorMap[colorType] || colorMap.calm;
}

// 开始呼吸动画
function startBreathingAnimation(background) {
    let isInhaling = true;
    let scale = 1;
    
    breathingInterval = setInterval(() => {
        if (isInhaling) {
            scale += 0.01;
            if (scale >= 1.1) {
                isInhaling = false;
            }
        } else {
            scale -= 0.01;
            if (scale <= 0.9) {
                isInhaling = true;
            }
        }
        
        colorBreathing.style.transform = `scale(${scale})`;
    }, 50);
}

// 显示颜色描述
function showColorDescription(colorInfo) {
    // 在实际应用中，可以创建一个更美观的提示方式
    console.log(colorInfo.description);
}

// 初始化色彩疗法
initColorTherapy();

// 添加每日重置功能
function resetDailyTasks() {
    const lastReset = localStorage.getItem('lastReset');
    const today = new Date().toDateString();
    
    if (lastReset !== today) {
        completedTasks = {
            breathe: false,
            mood: false,
            gratitude: false
        };
        localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
        localStorage.setItem('lastReset', today);
        updateTaskButtons();
    }
}

// 页面加载时检查是否需要重置任务
resetDailyTasks();





// 在现有的JavaScript代码中添加
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if(targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if(targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});


// 八音盒钢琴功能
const pianoKeys = document.querySelectorAll('.white-key, .black-key');
const pianoVolume = document.getElementById('pianoVolume');
const demoBtn = document.getElementById('demoBtn');
const pianoStatus = document.getElementById('pianoStatus');
const musicBox = document.querySelector('.music-box-container');
const dancer = document.getElementById('dancer');

let audioContext;
let gainNode;
let isPlayingDemo = false;

// 音符频率映射 (八音盒音色范围)
const noteFrequencies = {
    'C4': 261.63,
    'C#4': 277.18,
    'D4': 293.66,
    'D#4': 311.13,
    'E4': 329.63,
    'F4': 349.23,
    'F#4': 369.99,
    'G4': 392.00,
    'G#4': 415.30,
    'A4': 440.00,
    'A#4': 466.16,
    'B4': 493.88,
    'C5': 523.25
};

// 示范曲 - 小星星
const demoNotes = [
    'C4', 'C4', 'G4', 'G4', 'A4', 'A4', 'G4',
    'F4', 'F4', 'E4', 'E4', 'D4', 'D4', 'C4',
    'G4', 'G4', 'F4', 'F4', 'E4', 'E4', 'D4',
    'G4', 'G4', 'F4', 'F4', 'E4', 'E4', 'D4',
    'C4', 'C4', 'G4', 'G4', 'A4', 'A4', 'G4',
    'F4', 'F4', 'E4', 'E4', 'D4', 'D4', 'C4'
];

// 初始化音频上下文
function initAudio() {
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        gainNode = audioContext.createGain();
        gainNode.connect(audioContext.destination);
        gainNode.gain.value = pianoVolume.value / 100;
    } catch (e) {
        console.error('音频上下文初始化失败:', e);
        pianoStatus.textContent = '音频功能不可用，请使用现代浏览器';
    }
}

// 播放音符 (八音盒音色)
function playNote(note) {
    if (!audioContext) initAudio();
    
    const frequency = noteFrequencies[note];
    if (!frequency) return;
    
    // 创建振荡器 (八音盒使用正弦波)
    const oscillator = audioContext.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;
    
    // 创建包络 (模拟八音盒音色)
    const envelope = audioContext.createGain();
    oscillator.connect(envelope);
    envelope.connect(gainNode);
    
    // 设置音量包络 - 快速起音，缓慢衰减
    envelope.gain.setValueAtTime(0, audioContext.currentTime);
    envelope.gain.linearRampToValueAtTime(0.7, audioContext.currentTime + 0.01);
    envelope.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1.5);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 1.5);
    
    // 激活视觉效果
    activateVisualFeedback();
    
    // 更新状态
    pianoStatus.textContent = `正在播放: ${note}`;
}

// 激活视觉反馈
function activateVisualFeedback() {
    musicBox.classList.add('playing');
    clearTimeout(musicBox.timeout);
    musicBox.timeout = setTimeout(() => {
        musicBox.classList.remove('playing');
    }, 300);
}

// 钢琴按键事件
pianoKeys.forEach(key => {
    const note = key.getAttribute('data-note');
    if (!note) return;
    
    // 鼠标点击
    key.addEventListener('mousedown', () => {
        key.classList.add('active');
        playNote(note);
    });
    
    key.addEventListener('mouseup', () => {
        key.classList.remove('active');
    });
    
    key.addEventListener('mouseleave', () => {
        key.classList.remove('active');
    });
    
    // 触摸支持
    key.addEventListener('touchstart', (e) => {
        e.preventDefault();
        key.classList.add('active');
        playNote(note);
    });
    
    key.addEventListener('touchend', () => {
        key.classList.remove('active');
    });
});

// 键盘事件支持
document.addEventListener('keydown', (e) => {
    const keyMap = {
        'a': 'C4', 'w': 'C#4', 's': 'D4', 'e': 'D#4', 'd': 'E4',
        'f': 'F4', 't': 'F#4', 'g': 'G4', 'y': 'G#4', 'h': 'A4',
        'u': 'A#4', 'j': 'B4', 'k': 'C5'
    };
    
    const note = keyMap[e.key.toLowerCase()];
    if (note && !isPlayingDemo) {
        const keyElement = document.querySelector(`[data-note="${note}"]`);
        if (keyElement) {
            keyElement.classList.add('active');
            playNote(note);
        }
    }
});

document.addEventListener('keyup', (e) => {
    const keyMap = {
        'a': 'C4', 'w': 'C#4', 's': 'D4', 'e': 'D#4', 'd': 'E4',
        'f': 'F4', 't': 'F#4', 'g': 'G4', 'y': 'G#4', 'h': 'A4',
        'u': 'A#4', 'j': 'B4', 'k': 'C5'
    };
    
    const note = keyMap[e.key.toLowerCase()];
    if (note) {
        const keyElement = document.querySelector(`[data-note="${note}"]`);
        if (keyElement) {
            keyElement.classList.remove('active');
        }
    }
});

// 音量控制
pianoVolume.addEventListener('input', function() {
    if (gainNode) {
        gainNode.gain.value = this.value / 100;
    }
});

// 示范曲功能
demoBtn.addEventListener('click', function() {
    if (isPlayingDemo) {
        stopDemo();
    } else {
        playDemo();
    }
});

function playDemo() {
    if (!audioContext) initAudio();
    
    isPlayingDemo = true;
    demoBtn.textContent = '停止示范曲';
    pianoStatus.textContent = '正在播放: 小星星';
    
    let noteIndex = 0;
    
    function playNextNote() {
        if (!isPlayingDemo || noteIndex >= demoNotes.length) {
            stopDemo();
            return;
        }
        
        const note = demoNotes[noteIndex];
        const keyElement = document.querySelector(`[data-note="${note}"]`);
        
        if (keyElement) {
            keyElement.classList.add('active');
            playNote(note);
            
            setTimeout(() => {
                keyElement.classList.remove('active');
            }, 300);
        }
        
        noteIndex++;
        
        if (noteIndex < demoNotes.length) {
            setTimeout(playNextNote, 500);
        } else {
            stopDemo();
        }
    }
    
    playNextNote();
}

function stopDemo() {
    isPlayingDemo = false;
    demoBtn.textContent = '播放示范曲';
    pianoStatus.textContent = '示范曲已停止';
    
    // 移除所有激活状态
    pianoKeys.forEach(key => key.classList.remove('active'));
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', function() {
    initAudio();
});