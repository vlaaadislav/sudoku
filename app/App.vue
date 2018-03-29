<template>
    <div class="sudoku">
        <div class="tables">
            <table class="sudoku-table">
                <tr class="sudoku-row" v-for="(row, rowIndex) in showedField">
                    <td class="sudoku-data" :class="item ? test(rowIndex, itemIndex): ''" v-for="(item, itemIndex) in row" @click="setValue(rowIndex, itemIndex)">{{ item }}</td>
                </tr>
            </table>
            <table class="choices">
                <tr v-for="choice in values">
                    <td class="choice" :class="selectedValue === choice ? 'active': ''" @click="selectValue(choice)">{{ choice }}</td>
                </tr>
            </table>
        </div>
        <button @click="randomize">Randomize</button>
        <button @click="showAnswer">Show Answer</button>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                fieldSize: 9,
                cellSize: 3,
                field: [],
                showedField: [],
                values: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                selectedValue: null
            }
        },
        methods: {
            generateField() {
                const template = this.values.slice();
                const res = [];
                for (let i = 0; i < this.fieldSize; i++) {
                    // offset = +3 on each line + 1 each 3row
                    let offset = (i % this.cellSize) * this.cellSize + Math.floor(i / this.cellSize);
                    res.push(this.getArrayOffset(template, offset));
                }
                return res;
            },
            hideFields(qty = 60) {
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
                        return 'error';
                    }

                    if (this.showedField[i][col] === testedValue && i !== row) {
                        return 'error';
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
                            return 'error';
                        }
                    }
                }
            },
            setValue(row, cell) {
                if (this.showedField[row][cell] || !this.selectedValue) {
                    return;
                }
                this.$set(this.showedField[row], cell, this.selectedValue);
            },
            selectValue(value) {
                this.selectedValue = this.selectedValue !== value ? value : null;
            },
            getArrayOffset(a, offset = 0) {
                let copy = a.slice();
                return copy.splice(offset).concat(copy);
            },
            randomize() {
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
            }
        },
        created() {
            this.field = this.generateField();
            this.showedField = this.hideFields();
        }
    }
</script>

<style lang="scss">
    .error {
        background-color: red;
    }

    .active {
        background-color: green;
    }

    .tables {
        display: flex;
        justify-content: center;
    }

    .sudoku-table {
        border: 3px solid black;
        border-collapse: collapse;

        .sudoku-row {
            &:nth-child(3n) {
                border-bottom: 3px solid black;
            }
        }

        .sudoku-data {
            border-right: 1px dotted black;
            border-bottom: 1px solid black;
            width: 30px;
            height: 30px;

            &:hover {
                cursor: default;

                &:empty {
                    cursor: pointer;
                }
            }

            &:nth-child(3n) {
                border-right: 3px solid black;
            }
        }
    }

    .choices {
        border: 3px solid black;
        border-collapse: collapse;
        margin-left: 50px;

        tr {
            &:nth-child(3n) {
                border-bottom: 3px solid black;
            }
        }

        .choice {
            border: 1px solid black;
            width: 30px;
            height: 30px;

            &:hover {
                cursor: pointer;
            }
        }
    }
</style>