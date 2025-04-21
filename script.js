let currentChance = 1.0;  // 100%
let attemptsLeft = 15;
let decreaseRate = 0.05; // 첫 번째 성공 시 확률 감소 비율 (10%)

const tryBtn = document.getElementById('tryBtn');
const resultDiv = document.getElementById('result');
const rankDiv = document.getElementById('rank');
const finalMessageDiv = document.getElementById('finalMessage');
const resetBtn = document.getElementById('resetBtn');
const statusP = document.getElementById('status');
const titleMessageDiv = document.getElementById('titleMessage');  // 새로운 타이틀 메시지 표시

// 사운드 객체 생성
const successSound = new Audio('sound/성공.mp3');
const failSound = new Audio('sound/실패.mp3');
const winSound = new Audio('sound/축하.mp3');

function playSound(sound) {
  sound.pause();
  sound.currentTime = 0;
  sound.play().catch(e => {
    console.warn('사운드 재생 실패:', e);
  });

  setTimeout(() => {
    sound.pause();
    sound.currentTime = 0;
  }, 2000);
}

// 타이틀 메시지 객체
const titleMessages = {
    'A+': "이제 '진짜' 공부하러 가세요.",
    'A0': "다음이 마지막이에요.",
    'B+': "여기서 만족할 거에요?",
    'B0': "여기까지는 그냥 딸깍 몇 번이면 금방 와요",
    'C+': "갈 길이 멀어요",
    'C0': "아직 이 정도로는 만족 못 하잖아요?",
    'D+': "이 정도는 누구나",
    'D0': "100% 성공했는데 왜 좋아하세요?",
    'F': "ㅋ"
  };

// 등급을 구하는 함수
function getRank(chance) {
  if (chance >= 1.0) return 'F';
  if (chance >= 0.9500) return 'D0';
  if (chance >= 0.8690) return 'D+';
  if (chance >= 0.7580) return 'C0';
  if (chance >= 0.6160) return 'C+';
  if (chance >= 0.4440) return 'B0';
  if (chance >= 0.2420) return 'B+';
  if (chance >= 0.0090) return 'A0';
  return 'A+';
}

// 상태 업데이트 함수
function updateStatus() {
  const percent = Math.round(currentChance * 10000) / 100;
  statusP.textContent = `현재 확률: ${percent}% / 남은 기회: ${attemptsLeft}`;
}

// 사운드
function playSound(sound) {
  sound.pause();         // 혹시 재생 중이면 멈추고
  sound.currentTime = 0; // 소리 처음부터 재생
  sound.play().catch(e => {
    console.warn('사운드 재생 실패:', e);
  });
}

// 등급 업데이트 함수
function updateRank() {
  const rank = getRank(currentChance);
  rankDiv.textContent = `등급: ${rank}`;

  //등급이 바뀔 때마다 타이틀 메시지 갱신
  titleMessageDiv.textContent = titleMessages[rank];

  // 마지막 등급일 경우 메시지 표시
  if (rank === 'A+') {
    finalMessageDiv.textContent = '이걸 성공하네..';
    finalMessageDiv.style.display = 'block';
    playSound(winSound);

    // 기회가 남아있는 경우 안내 메시지 추가
    if (attemptsLeft > 0) {
      finalMessageDiv.textContent = '도전 기회를 모두 소진해 주세요';
      finalMessageDiv.style.display = 'block';
    }
  }

  if(attemptsLeft === 0) {
    resetBtn.style.display = 'inline-block'; // 다시 시작 버튼 표시
  } else {
    resetBtn.style.display = 'none';
  }
}

// 결과 표시 함수
function showResult(text, color, animationClass) {
  resultDiv.textContent = text;
  resultDiv.style.color = color;
  resultDiv.classList.remove('animate-success', 'animate-fail');
  void resultDiv.offsetWidth; // 애니메이션 리셋
  resultDiv.classList.add(animationClass);
}

// 게임 리셋 함수
function resetGame() {
  currentChance = 1.0;
  attemptsLeft = 15;
  decreaseRate = 0.05;  // 리셋 시 감소 비율 초기화
  resultDiv.textContent = '';
  resultDiv.style.color = '';
  finalMessageDiv.textContent = '';
  finalMessageDiv.style.display = 'none';
  tryBtn.disabled = false;
  resetBtn.style.display = 'none';
  updateStatus();
  updateRank();
}

// 버튼 클릭 이벤트 핸들러
tryBtn.addEventListener('click', () => {
  if (attemptsLeft <= 0) {
    resultDiv.textContent = '💀 게임 종료!';
    resultDiv.style.color = 'gray';
    tryBtn.disabled = true;
    return;
  }

  const roll = Math.random();
  attemptsLeft--;

  if (roll < currentChance) {
    //성공
    currentChance = Math.max(0, currentChance - decreaseRate); // 확률 감소
    decreaseRate += 0.0305;
    playSound(successSound); // 성공 사운드 재생
  } else {
    currentChance = Math.max(0, currentChance + 0.01); // 확률 감소
    playSound(failSound);  // 실패 사운드 재생
  }

  updateStatus();
  updateRank();

  if (attemptsLeft <= 0) {
    tryBtn.disabled = true;
  }
});

// 다시 시작 버튼 클릭 이벤트
resetBtn.addEventListener('click', resetGame);

// 초기 상태 설정
updateStatus();
updateRank();
