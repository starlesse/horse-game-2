document.addEventListener('DOMContentLoaded', () => {
    let selectedHorse = null;
    let betAmount = 0;
    let money = 50000;

    const updateMoneyDisplay = () => {
        document.getElementById('current-money').textContent = money;
    };

    const resetGame = () => {
        money = 50000;
        updateMoneyDisplay();
        selectedHorse = null;
        betAmount = 0;
        document.querySelector('.horse-selection').style.display = 'block';
        document.querySelector('.race-track').style.display = 'none';
        document.getElementById('startButton').style.display = 'none';
        document.getElementById('result').style.display = 'none';
        document.getElementById('bet-amount').value = 1;
    };

    const selectHorse = (button) => {
        selectedHorse = button.dataset.horse;
        betAmount = parseInt(document.getElementById('bet-amount').value, 10);

        if (isNaN(betAmount) || betAmount <= 0 || betAmount > money) {
            alert('유효한 금액을 입력하세요.');
            return;
        }

        money -= betAmount;
        updateMoneyDisplay();

        document.querySelector('.horse-selection').style.display = 'none';
        document.querySelector('.race-track').style.display = 'block';
        document.getElementById('startButton').style.display = 'block';
        document.getElementById('result').style.display = 'none'; // 결과 숨기기
    };

    const generateUniqueSpeeds = (numHorses, minSpeed, maxSpeed) => {
        const speeds = new Set();
        while (speeds.size < numHorses) {
            const speed = Math.floor(Math.random() * (maxSpeed - minSpeed + 1)) + minSpeed;
            speeds.add(speed);
        }
        return Array.from(speeds);
    };

    const startRace = () => {
        if (!selectedHorse) {
            alert('먼저 말을 선택하세요!');
            return;
        }

        const horses = Array.from(document.querySelectorAll('.horse'));
        const trackWidth = document.querySelector('.race-track').offsetWidth;
        const horsePositions = {};

        // 말들의 속도를 무작위로 설정 (속도는 모두 다르게 설정)
        const minSpeed = 5;
        const maxSpeed = 15;
        const uniqueSpeeds = generateUniqueSpeeds(horses.length, minSpeed, maxSpeed);

        horses.forEach((horse, index) => {
            const id = horse.id;
            const speed = uniqueSpeeds[index];
            horse.dataset.speed = speed; // HTML data 속성에 설정된 속도
            horse.style.left = '0px';
            horsePositions[id] = 0;
        });

        let raceEnded = false;

        const raceInterval = setInterval(() => {
            if (raceEnded) return;

            let positions = [];

            horses.forEach(horse => {
                const currentLeft = parseInt(horse.style.left, 10);
                const speed = parseInt(horse.dataset.speed, 10);
                const newLeft = currentLeft + speed;

                horse.style.left = newLeft + 'px';
                horsePositions[horse.id] = newLeft;

                positions.push({ id: horse.id, left: newLeft });

                if (newLeft >= (trackWidth - horse.offsetWidth)) {
                    clearInterval(raceInterval);
                    raceEnded = true;

                    positions.sort((a, b) => b.left - a.left);

                    let resultText = '경주 결과:\n';
                    positions.forEach((horse, index) => {
                        const place = index + 1;
                        resultText += `${place}등: ${horse.id}\n`;
                    });

                    const selectedHorsePosition = positions.findIndex(horse => horse.id === selectedHorse) + 1;
                    let winnings = 0;
                    if (selectedHorsePosition === 1) {
                        winnings = betAmount * 5;
                    } else if (selectedHorsePosition === 2) {
                        winnings = betAmount * 3;
                    } else if (selectedHorsePosition === 3) {
                        winnings = betAmount * 2;
                    }

                    money += winnings;
                    updateMoneyDisplay();

                    resultText += `\n선택한 ${selectedHorse}는 ${selectedHorsePosition}등입니다.`;
                    if (winnings > 0) {
                        resultText += `\n축하합니다! ${winnings}원을 획득했습니다.`;
                    } else {
                        resultText += `\n아쉽습니다. 이기지 못했습니다.`;
                    }

                    document.getElementById('result').textContent = resultText;
                    document.getElementById('result').style.display = 'block';

                    if (money <= 0) {
                        document.getElementById('result').textContent += '\n자산이 소진되었습니다. 게임을 다시 시작합니다.';
                        setTimeout(resetGame, 3000);
                    } else {
                        document.querySelector('.horse-selection').style.display = 'block';
                        document.querySelector('.race-track').style.display = 'none';
                        document.getElementById('startButton').style.display = 'none';
                    }
                }
            });
        }, 100);
    };

    document.querySelectorAll('.select-button').forEach(button => {
        button.addEventListener('click', () => selectHorse(button));
    });

    document.getElementById('startButton').addEventListener('click', startRace);

    updateMoneyDisplay();
});
