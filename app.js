new Vue({
    el: '#app',
    data: {
        playerHealth: 100,
        monsterHealth: 100,
        gameIsRunning: false,
        turns: [] // 回合紀錄
    },
    computed: {

    }, watch: {

    },
    methods: {
        startGame: function () {
            this.gameIsRunning = true;
            this.playerHealth = 100;
            this.monsterHealth = 100;
            this.turns = [];
        },
        attack: function () {
            // player attack monster
            var damage = this.calculateDamage(3, 10)
            this.monsterHealth -= damage;
            this.turns.unshift({
                isPlayer: true,
                text: 'Player hits monster for ' + damage
            }); // push塞在最後面，unshift塞在最前面
            // see if monsterHealth is less than 0
            if (this.checkWin()) {
                // 有結果就不用再往後跑了
                return;
            }

            // monster attack player
            this.monsterAttack();
        },
        specialAttack: function (event) {
            // player attack monster
             var damage = this.calculateDamage(6, 20);
            this.monsterHealth -= damage;
            this.turns.unshift({
                isPlayer: true,
                text: 'Player use Special Attack and hits monster for ' + damage
            });
            // see if monsterHealth is less than 0
            if (this.checkWin()) {
                // 有結果就不用再往後跑了
                return;
            }

            // monster attack player
            this.monsterAttack();

            // 使用特殊攻擊會硬直2秒鐘才解開
            this.disableAction(event.target, 2000);
        },
        heal: function (event) {
            // 補血血量不可超過100
            if (this.playerHealth <= 90) {
                this.playerHealth += 10;
            } else {
                this.playerHealth = 100;
            }
            this.turns.unshift({
                isPlayer: true,
                text: 'Player heals for 10'
            });
            
            this.monsterAttack();
            // 補血會硬直一段時間才能繼續補
            this.disableAction(event.target, 2000);
        },
        giveUp: function () {
            if (confirm('Give up?')) {
                this.gameIsRunning = false;
            }
        },
        monsterAttack: function () {
            // monster attack player
            var damage = this.calculateDamage(5, 15)
            this.playerHealth -= damage;
            this.turns.unshift({
                isPlayer: false,
                text: 'Monster hits player for ' + damage
            });

            // see if playerHealth is less than 0
            this.checkWin();
        },
        calculateDamage: function (min, max) {
            // Math.random() 的值為0以下的小數點
            return Math.max(Math.floor(Math.random() * max) + 1, min);
        },
        checkWin: function () {
            /**
             * 檢查目前血量是否有歸0的？
             */
            if (this.monsterHealth <= 0) {
                if (confirm('You win!!! New Game?')) {
                    this.startGame();
                } else {
                    this.gameIsRunning = false;
                }
                return true;
            } else if (this.playerHealth <= 0) {
                if (confirm('You lost!!! New Game?')) {
                    this.startGame();
                } else {
                    this.gameIsRunning = false;
                }
                return true;
            }
            return false;
        },
        disableAction: function (target, stopLatency) {
            target.disabled = true;
            setTimeout(function () {
                target.disabled = false;
            }, stopLatency);
        }
    }
});