const container = document.getElementById('container');
const CONTAINER_WIDTH = 1000;
const CONTAINER_HEIGHT = 625;
const levelUpScreen = document.getElementById('levelUpScreen');
const gameOverScreen = document.getElementById('gameOverScreen');

class Tama {
  constructor(x, y, vx, vy, r = 5, power = 1, isPenetratable = false) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.r = r;
    this.power = power
    this.willRemove = false;
    this.isPenetratable = isPenetratable

    const div = document.createElement('div');
    div.style.position = 'absolute';
    div.style.top = `${this.y - this.r}px`;
    div.style.left = `${this.x - this.r}px`;
    div.style.width = `${this.r * 2}px`
    div.style.height = `${this.r * 2}px`
    div.style.border = '1px solid #000';
    div.style.backgroundColor = this.isPenetratable ? '#a9ceec' : '#fff'
    div.style.borderRadius = '50%';
    container.appendChild(div);

    this.elm = div;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x + this.r * 2 > CONTAINER_WIDTH
      || this.y < 0 || this.y + this.r * 2 > CONTAINER_HEIGHT) {
      this.willRemove = true;
    }
    this.elm.style.top = `${this.y - this.r}px`;
    this.elm.style.left = `${this.x - this.r}px`;
  }

}

class Teki {
  constructor(x, y, vx, vy, maxHp, speed = 0.8, text = '👾', power = 1) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.maxHp = maxHp;
    this.hp = this.maxHp;
    this.speed = speed;
    this.willRemove = false;
    this.size = 20;
    this.text = text;
    this.power = power;

    const div = document.createElement('div');
    div.style.position = 'absolute';
    div.style.top = `${this.y - this.size / 2}px`;
    div.style.left = `${this.x - this.size / 2}px`;
    div.style.width = `${this.size}px`
    div.style.height = `${this.size}px`
    div.style.fontSize = `${this.size}px`
    div.textContent = this.text;
    const hpBar = document.createElement('div');
    hpBar.style.position = 'absolute';
    hpBar.style.top = 0;
    hpBar.style.left = 0;
    hpBar.style.width = '100%'
    hpBar.style.height = '10%'
    hpBar.style.border = '1px solid #000';
    hpBar.style.background = '#fff';
    const hpGage = document.createElement('div');
    hpGage.style.position = 'absolute';
    hpGage.style.top = 0;
    hpGage.style.left = 0;
    hpGage.style.width = `${this.hp / this.maxHp * 100}%`
    hpGage.style.height = '100%'
    hpGage.style.background = '#0e0';
    hpBar.appendChild(hpGage);
    div.appendChild(hpBar);
    container.appendChild(div);

    this.hpGage = hpGage;
    this.elm = div;
  }
  update() {
    const diffX = heroX - this.x;
    const diffY = heroY - this.y;
    const angle = Math.atan2(diffY, diffX);
    this.vx = Math.cos(angle);
    this.vy = Math.sin(angle);
    this.x += this.vx * this.speed;
    this.y += this.vy * this.speed;
    this.elm.style.top = `${this.y - this.size / 2}px`;
    this.elm.style.left = `${this.x - this.size / 2}px`;

    this.hpGage.style.width = `${this.hp / this.maxHp * 100}%`
    if (this.hp <= 0) {
      this.willRemove = true;
    }
  }
}

class Energie {
  constructor(x, y, exp, color = '#b5ff14') {
    this.x = x;
    this.y = y;
    this.exp = exp
    this.willRemove = false;
    this.r = 2;
    this.color = color;

    const div = document.createElement('div');
    div.style.position = 'absolute';
    div.style.top = `${this.y - this.r}px`;
    div.style.left = `${this.x - this.r}px`;
    div.style.width = `${this.r * 2}px`
    div.style.height = `${this.r * 2}px`
    div.style.border = '1px solid #000';
    div.style.backgroundColor = this.color;
    div.style.borderRadius = '50%';
    container.appendChild(div);

    this.elm = div;
  }
  update() {
    const diffX = heroX - this.x;
    const diffY = heroY - this.y;
    const angle = Math.atan2(diffY, diffX);
    this.vx = Math.cos(angle);
    this.vy = Math.sin(angle);
    this.x += this.vx * this.speed;
    this.y += this.vy * this.speed;
    if (this.x < 0 || this.x + this.size > CONTAINER_WIDTH
      || this.y < 0 || this.y + this.size > CONTAINER_HEIGHT) {
      this.willRemove = true;
    }
    this.elm.style.top = `${this.y - this.size / 2}px`;
    this.elm.style.left = `${this.x - this.size / 2}px`;

    this.hpGage.style.width = `${this.hp / this.maxHp * 100}%`
    if (this.hp < 0) {
      this.willRemove = true;
    }
  }
}

const isCollision = (x1, y1, r1, x2, y2, r2, detection = 1) => {
  const d = (x1 - x2) ** 2 + (y1 - y2) ** 2;
  return d < ((r1 + r2) ** 2) * detection;
}

const init = () => {

}

let heroX = 30;
let heroY = 30;
let heroMaxHp = 1000;
let heroHp = heroMaxHp;
let heroSpeed = 1;
let exp = 0;
let nextExp = 20;
let bukiLv = 0;
let tamaR = 5;
let tamaPower = 1;
let gameOver = false;
let score = 0;
let energiePopCorrection = 1;
let energyVacuumCorrection = 1;
let tamaInterval = 20;
let isShowLevelUpScreen = false;
let timer = 0;
let isDanger = false;
let isPenetratable = false;
window.onload = async () => {

  // ローカルストレージを読み込む
  let highScore = parseInt(localStorage.getItem("highScore")) || 0;
  const highScoreElement = document.getElementById('high-score')
  highScoreElement.textContent = highScore;


  const infoContainer = document.createElement('div');
  infoContainer.style.position = 'absolute';
  infoContainer.style.top = '20px';
  infoContainer.style.left = '20px';
  infoContainer.style.border = '1px solid #000';
  infoContainer.style.padding = '5px';
  infoContainer.style.backgroundColor = '#fff';
  infoContainer.style.fontSize = '16px';
  infoContainer.style.fontFamily = 'impact'
  container.appendChild(infoContainer);
  const refleshInfoContainer = () => {
    infoContainer.innerHTML = `
    HP: ${heroHp} / ${heroMaxHp}<br>
    exp: ${exp} / ${nextExp}<br>
    score: ${score}<br>
    bukiLV: ${bukiLv}<br>
    power: ${tamaPower}<br>
    interval: ${tamaInterval}<br>
    energyLV : ${energiePopCorrection.toFixed(2)}<br>
    vacuumLX : ${energyVacuumCorrection.toFixed(2)}<br>
    speed: ${heroSpeed.toFixed(2)}
    `
  }
  refleshInfoContainer();

  const hero = document.createElement('div');
  let heroSize = 20;
  hero.style.position = 'absolute';
  hero.style.top = `${heroY - heroSize / 2}px`;
  hero.style.left = `${heroX - heroSize / 2}px`;
  hero.style.width = `${heroSize}px`
  hero.style.height = `${heroSize}px`
  hero.style.display = 'flex';
  hero.style.justifyContent = 'center';
  hero.style.alignItems = 'center';
  hero.textContent = '🐥';
  hero.style.fontSize = `${heroSize * 0.8}px`
  container.appendChild(hero);

  let tamaArr = [];
  let tekiArr = [];
  let energirArr = [];
  container.addEventListener('mousemove', (e) => {
    const target_rect = e.currentTarget.getBoundingClientRect();
    mouseX = e.clientX - target_rect.left;
    mouseY = e.clientY - target_rect.top;
  })

  let isSpaceKeyDown = false;
  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
      isSpaceKeyDown = true;
    }
  });
  document.addEventListener('keyup', (e) => {
    if (e.code === 'Space') {
      isSpaceKeyDown = false;
    }
  });

  let mouseX = 100;
  let mouseY = 100;
  let tamaIntervalCount = tamaInterval;



  const DegToRadian = (deg) => deg * 2 * Math.PI / 360;

  const lvUp = () => {
    isShowLevelUpScreen = true;
    levelUpScreen.style.display = 'flex';
    levelUpScreen.style.flexWrap = 'wrap';
    while (levelUpScreen.firstChild) {
      levelUpScreen.removeChild(levelUpScreen.firstChild);
    }

    for (let i = 0; i < lvUpFunctions.length; i++) {
      const item = document.createElement('div');
      item.style.display = 'flex';
      item.style.flexDirection = 'column';
      item.style.alignItems = 'center';
      item.style.justifyContent = 'center';
      item.style.cursor = 'pointer';
      item.style.width = '200px';
      item.style.height = '200px';
      item.style.backgroundColor = '#fff';
      const name = document.createElement('span');
      name.style.fontSize = '32px';
      name.textContent = lvUpFunctions[i].name;
      const desc = document.createElement('span');
      desc.textContent = lvUpFunctions[i].desc;
      item.appendChild(name);
      item.appendChild(desc);
      levelUpScreen.appendChild(item);
      if (lvUpFunctions[i].isDisabled === undefined || !lvUpFunctions[i].isDisabled()) {
        item.addEventListener('click', () => {
          lvUpFunctions[i].func();
          levelUpScreen.style.display = 'none';
          isShowLevelUpScreen = false;
          refleshInfoContainer();
        });
      } else {
        item.style.backgroundColor = '#555';
        item.style.cursor = 'auto'
      }
    }
  }
  const lvUpFunctions = [
    {
      name: '⚔️',
      desc: '弾丸数アップ',
      isDisabled: () => bukiLv >= 6,
      func: () => { bukiLv++ }
    },
    {
      name: '🔫',
      desc: '発射間隔アップ',
      isDisabled: () => tamaInterval <= 8,
      func: () => { tamaInterval-- }
    },
    {
      name: '💥',
      desc: '弾丸パワーアップ',
      isDisabled: () => tamaPower >= 15,
      func: () => { tamaPower++ }
    },
    {
      name: '🟢',
      desc: 'エネルギー出現率アップ',
      isDisabled: () => energiePopCorrection > 10,
      func: () => { energiePopCorrection *= 1.2 }
    },
    {
      name: '👟',
      desc: 'スピードアップ',
      isDisabled: () => heroSpeed > 3,
      func: () => { heroSpeed *= 1.1 }
    },
    {
      name: '🧹',
      desc: 'エネルギー吸引力アップ',
      isDisabled: () => energyVacuumCorrection >= 4,
      func: () => { energyVacuumCorrection *= 1.1 }
    },
    {
      name: '💘',
      desc: '貫通弾(武器LV4以上で解放)',
      isDisabled: () => isPenetratable || bukiLv <= 3,
      func: () => { isPenetratable = true }
    },
    {
      name: '💖',
      desc: '回復',
      func: () => { heroHp += 200 }
    },
  ]


  while (true) {
    await new Promise(r => setTimeout(r, 1000 / 60));
    if (gameOver) return;

    if (isShowLevelUpScreen) continue;
    timer++;

    if (!isDanger && heroHp / heroMaxHp < 0.2) {
      container.style.backgroundColor = 'rgb(255, 208, 208)';
      isDanger = true;
    } else if (isDanger && heroHp / heroMaxHp >= 0.2) {
      container.style.backgroundColor = '#eee';
      isDanger = false;
    }

    const diffX = mouseX - heroX;
    const diffY = mouseY - heroY;
    const angle = Math.atan2(diffY, diffX);
    const heroVx = Math.cos(angle);
    const heroVy = Math.sin(angle);
    if (!isSpaceKeyDown) {
      heroX += heroVx * heroSpeed;
      heroY += heroVy * heroSpeed;
      hero.style.top = `${heroY - heroSize / 2}px`;
      hero.style.left = `${heroX - heroSize / 2}px`;
    }


    if (tamaIntervalCount === 0) {
      let startDeg;
      let tamaCount;
      startDeg = bukiLv * 10
      tamaCount = 1 + 2 * bukiLv

      let dist = DegToRadian(startDeg)
      for (let i = 0; i < tamaCount; i++) {
        const isPenetrateTarget = isPenetratable && i == (tamaCount - 1) / 2
        let tama = new Tama(heroX, heroY, Math.cos(angle + dist) * 10, Math.sin(angle + dist) * 10, tamaR, isPenetrateTarget ? tamaPower / 4 : tamaPower, isPenetrateTarget)
        tamaArr.push(tama);
        if (tamaCount !== 1) {
          dist -= DegToRadian(startDeg) * 2 / (tamaCount - 1)
        }
      }
      tamaIntervalCount = tamaInterval;
    } else tamaIntervalCount--;

    if (Math.random() < 0.05) {
      let x = Math.random() * CONTAINER_WIDTH;
      let y = Math.random() * CONTAINER_HEIGHT;
      if (!isCollision(heroX, heroY, heroSize / 2, x, y, 50)) {
        const rand = Math.random();
        if (timer < 2000) {
          let teki = new Teki(x, y, 0, 0, 10, 0.2);
          tekiArr.push(teki);
        } else if (timer < 4000) {
          if (rand < 0.5) {
            let teki = new Teki(x, y, 0, 0, 20, 0.4, '👽');
            tekiArr.push(teki);
          } else {
            let teki = new Teki(x, y, 0, 0, 10, 0.2);
            tekiArr.push(teki);
          }
        } else if (timer < 6000) {
          if (rand < 0.5) {
            let teki = new Teki(x, y, 0, 0, 50, 0.2, '🤖');
            tekiArr.push(teki);
          } else {
            let teki = new Teki(x, y, 0, 0, 20, 0.4, '👽');
            tekiArr.push(teki);
          }
        } else if (timer < 8000) {
          if (rand < 0.5) {
            let teki = new Teki(x, y, 0, 0, 50, 0.6, '👹');
            tekiArr.push(teki);
          } else {
            let teki = new Teki(x, y, 0, 0, 50, 0.2, '🤖');
            tekiArr.push(teki);
          }
        } else if (timer < 10000) {
          if (rand < 0.5) {
            let teki = new Teki(x, y, 0, 0, 70, 0.8, '👿');
            tekiArr.push(teki);
          } else {
            let teki = new Teki(x, y, 0, 0, 50, 0.6, '👹');
            tekiArr.push(teki);
          }
        } else if (timer < 15000) {
          if (rand < 0.2) {
            let teki = new Teki(x, y, 0, 0, 90, 0.8, '👺');
            tekiArr.push(teki);
          } else {
            let teki = new Teki(x, y, 0, 0, 70, 0.8, '👿');
            tekiArr.push(teki);
          }
        } else if (timer < 20000) {
          if (rand < 0.2) {
            let teki = new Teki(x, y, 0, 0, 120, 1.5, '💩');
            tekiArr.push(teki);
          } else {
            let teki = new Teki(x, y, 0, 0, 70, 0.8, '👿');
            tekiArr.push(teki);
          }
        } else if (timer < 25000) {
          if (rand < 0.5) {
            let teki = new Teki(x, y, 0, 0, 120, 1.5, '💩');
            tekiArr.push(teki);
          } else {
            let teki = new Teki(x, y, 0, 0, 90, 0.8, '👺');
            tekiArr.push(teki);
          }
        } else if (timer < 50000) {
          const phase = 1 + Math.floor((timer - 25000) / 5000)
          let teki = new Teki(x, y, 0, 0, 200 * phase, 1.5 + 0.3 * phase, '💀', 1 + Math.floor(phase / 2));
          tekiArr.push(teki);
        } else {
          let teki = new Teki(x, y, 0, 0, 99999, 40, '😇', 10);
          tekiArr.push(teki);
        }
      }
    }

    if (Math.random() < 0.05 * energiePopCorrection) {
      let x = Math.random() * CONTAINER_WIDTH;
      let y = Math.random() * CONTAINER_HEIGHT;
      if (!isCollision(heroX, heroY, heroSize / 2, x, y, 50)) {
        let energie = new Energie(x, y, 1);
        energirArr.push(energie);
      }
    }
    if (Math.random() < 0.0005 * energiePopCorrection) {
      let x = Math.random() * CONTAINER_WIDTH;
      let y = Math.random() * CONTAINER_HEIGHT;
      if (!isCollision(heroX, heroY, heroSize / 2, x, y, 50)) {
        let energie = new Energie(x, y, Math.floor(nextExp / 4), 'red');
        energirArr.push(energie);
      }
    }

    if (tamaArr.length > 0) {
      for (let tama of tamaArr) {
        tama.update();
        if (tama.willRemove) tama.elm.remove();
      }
    }
    tamaArr = tamaArr.filter(tama => !tama.willRemove);

    if (tekiArr.length > 0) {
      for (let teki of tekiArr) {
        teki.update();
        if (teki.willRemove) {
          teki.elm.remove()
          score += teki.maxHp;
          exp += Math.min(Math.floor(teki.maxHp / 8), 15)
          if (exp >= nextExp) {
            lvUp();
            exp -= nextExp;
            nextExp += 5
          }
          refleshInfoContainer();
        };
      }
    }
    tekiArr = tekiArr.filter(teki => !teki.willRemove);

    let heroDameged = false
    hero.style.filter = ''
    for (let teki of tekiArr) {
      if (teki.willRemove) continue;
      for (let tama of tamaArr) {
        if (tama.willRemove) continue;
        if (isCollision(teki.x, teki.y, teki.size / 2, tama.x, tama.y, tama.r)) {
          if (!tama.isPenetratable) tama.willRemove = true;
          teki.hp -= tama.power;
        }
      }

      if (!heroDameged && isCollision(teki.x, teki.y, teki.size / 2, heroX, heroY, heroSize / 2)) {
        heroHp -= teki.power;
        heroDameged = true;
        hero.style.filter = 'hue-rotate(295deg)'
        if (heroHp < 0) {
          heroHp = 0;
          gameOver = true;
          let gameOverMessage = `GAME OVER<br>SCORE: ${score}`;
          if(score > highScore) {
            highScore = score;
            localStorage.setItem('highScore', score);
            highScoreElement.textContent = highScore;
            gameOverMessage += `<br><span style="color: red; font-size: 48px;">最高記録更新！</span>`;
          }
          gameOverScreen.innerHTML = gameOverMessage;
          gameOverScreen.style.display = 'flex';
        }
        refleshInfoContainer();
      }
    }

    for (let energie of energirArr) {
      if (energie.willRemove) continue;

      if (isCollision(energie.x, energie.y, energie.r * 30 * energyVacuumCorrection, heroX, heroY, heroSize / 2)) {
        const diffX = heroX - energie.x;
        const diffY = heroY - energie.y;
        const angle = Math.atan2(diffY, diffX);
        energie.vx = Math.cos(angle) * 5;
        energie.vy = Math.sin(angle) * 5;
        energie.x += energie.vx;
        energie.y += energie.vy;
        energie.elm.style.top = `${energie.y - energie.r}px`;
        energie.elm.style.left = `${energie.x - energie.r}px`;
      }

      if (isCollision(energie.x, energie.y, energie.r, heroX, heroY, heroSize / 2)) {
        energie.willRemove;
        exp += energie.exp;
        energie.willRemove = true;
        if (exp >= nextExp) {
          lvUp();
          exp -= nextExp;
          nextExp += 5
        }
        refleshInfoContainer();
      }

      if (energie.willRemove) energie.elm.remove();
    }
    energirArr = energirArr.filter(energie => !energie.willRemove);
  }

}