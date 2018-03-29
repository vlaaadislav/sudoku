<template>
    <div class="sudoku container">
        <div class="row">
            <div class="col-10">
                <table class="table table-bordered">
                    <tr class="sudoku-row" v-for="(row, rowIndex) in showedField">
                        <td :class="item ? test(rowIndex, itemIndex) : 'empty'" v-for="(item, itemIndex) in row" @click="setValue(rowIndex, itemIndex)">
                            {{ item || '9' }}
                        </td>
                    </tr>
                </table>
            </div>

            <div class="col">
                <table class="table table-bordered">
                    <tr v-for="choice in template">
                        <td class="page-item" :class="selectedValue === choice ? 'bg-info': ''" @click="selectValue(choice)">{{ choice }}</td>
                    </tr>
                </table>
            </div>
        </div>

        <div class="row">
            <div class="col">
                <button class="btn btn-primary btn-lg btn-block" @click="randomize">Randomize</button>
            </div>
            <div class="col">
                <button class="btn btn-info btn-lg btn-block" @click="showAnswer">Show Answer</button>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                fieldSize: 9,
                cellSize: 3,
                template: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                field: [],
                showedField: [],
                selectedValue: null,
                gameStatus: 'inProgress'
            }
        },
        methods: {
            generateField() {
                const res = [];
                for (let i = 0; i < this.fieldSize; i++) {
                    // offset = +3 on each line + 1 each 3row
                    let offset = (i % this.cellSize) * this.cellSize + Math.floor(i / this.cellSize);
                    res.push(this.getOffsetedArray(this.template, offset));
                }
                return res;
            },
            getOffsetedArray(a, offset = 0) {
                let copy = a.slice();
                return copy.splice(offset).concat(copy);
            },
            hideFields(qty = this.getRandomInt(20, 60)) {
                const showedField = this.copy(this.field);
                while (qty > 0) {
                    let row = this.getRandomInt();
                    let cell = this.getRandomInt();
                    if (!showedField[row][cell]) {
                        continue;
                    }
                    showedField[row][cell] = null;
                    qty -= 1;
                }
                return showedField;
            },
            test(row, col) {
                const testedValue = this.showedField[row][col];

                // test row and column
                for (let i = 0; i < this.fieldSize; i++) {
                    if (this.showedField[row][i] === testedValue && i !== col) {
                        return 'bg-danger';
                    }

                    if (this.showedField[i][col] === testedValue && i !== row) {
                        return 'bg-danger';
                    }
                }

                //test cell
                // интервал рядов
                let rowMin = row - (row % this.cellSize);
                let rowMax = rowMin + this.cellSize - 1;
                // интервал колонок
                let colMin = col - (col % this.cellSize);
                let colMax = colMin + this.cellSize - 1;

                for (let i = rowMin; i <= rowMax; i++) {
                    for (let j = colMin; j <= colMax; j++) {
                        if (testedValue === this.showedField[i][j] && (i !== row && j !== col)) {
                            return 'bg-danger';
                        }
                    }
                }
            },
            setValue(row, cell) {
                if (this.showedField[row][cell] || !this.selectedValue) {
                    return;
                }
                this.$set(this.showedField[row], cell, this.selectedValue);

                if (this.gameStatus !== 'inProgress') {
                    return;
                }

                this.checkEndGame(this.test(row, cell) && 'lost');
            },
            selectValue(value) {
                this.selectedValue = this.selectedValue !== value ? value : null;
            },
            randomize() {
                this.gameStatus = 'inProgress';
                this.randomizeRows();
                this.randomizeColumns()
            },
            showAnswer() {
                this.showedField = this.field;
            },
            randomizeRows() {
                for (let i = 0; i < this.fieldSize; i += this.cellSize) {
                    const shuffledCell = this.shuffle(this.field.slice(i, i + this.cellSize));
                    this.field.splice(i, this.cellSize, ...shuffledCell);
                }
            },
            randomizeColumns() {
                const newField = this.field.slice();
                let order = [];
                for (let i = 0; i < this.fieldSize; i += this.cellSize) {
                    order.push(i);
                }
                order = this.shuffle(order);
                // order: [0, 3, 7]
                for (let cell of order) {
                    for (let item of newField) {
                        let newCell = item.slice(cell, cell + this.cellSize);
                        item.splice(cell, this.cellSize, ...newCell);
                    }
                }
                this.field = newField;
                this.showedField = this.hideFields();
            },
            shuffle(a) {
                for (let i = a.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [a[i], a[j]] = [a[j], a[i]];
                }
                return a;
            },
            getRandomInt(min = 0, max = this.fieldSize - 1) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            },
            copy(o) {
                return JSON.parse(JSON.stringify(o));
            },
            checkEndGame(lostStatus) {
                if (lostStatus) {
                    this.gameStatus = lostStatus;
                    return this.lost();
                }
                this.showedField.find((item) => item.includes(null)) || this.win();
            },
            lost() {

            },
            win() {

            }
        },
        created() {
            this.field = this.generateField();
            this.showedField = this.hideFields();
        }
    }
</script>

<style lang="scss">
    @import "~bootstrap/dist/css/bootstrap.css";
    @import "~bootstrap/dist/css/bootstrap-grid.css";
    @import "~bootstrap/dist/css/bootstrap-reboot.css";

    body {
        height: 100vh;
        width: 100%;
        padding: 0;
        margin: 0;
        user-select: none;
    }

    .sudoku {
        padding-top: 10px;
    }

    .table td {
        text-align: center;
        cursor: default;
    }

    .empty {
        color: transparent;
        cursor: pointer !important;
    }
</style>