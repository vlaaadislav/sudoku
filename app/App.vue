<template>
    <div class="sudoku">
        <table class="sudoku-table">
            <tr class="sudoku-row" v-for="row in field">
                <td class="sudoku-data" v-for="item in row">{{ item }}</td>
            </tr>
        </table>
        <button @click="randomize">Randomize</button>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                fieldSize: 9,
                cellSize: 3,
                field: []
            }
        },
        methods: {
            generateField() {
                const template = [1, 2, 3, 4, 5, 6, 7, 8, 9];
                const res = [];

                for (let i = 0; i < this.fieldSize; i++) {
                    // offset = +3 on each line + 1 each 3row
                    let offset = (i % this.cellSize) * this.cellSize + Math.floor(i / this.cellSize);
                    res.push(this.getArrayOffset(template, offset));
                }

                return res;
            },
            getArrayOffset(a, offset = 0) {
                let copy = a.slice();
                return copy.splice(offset).concat(copy);
            },
            randomize() {
                this.randomizeRows();
                this.randomizeColumns();
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

                console.log(newField);

                this.field = newField;
            },
            shuffle(a) {
                for (let i = a.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [a[i], a[j]] = [a[j], a[i]];
                }
                return a;
            }
        },
        mounted() {
            this.field = this.generateField();
        }
    }
</script>

<style lang="scss">
    @import '~skeleton-css/css/normalize.css';
    @import '~skeleton-css/css/skeleton.css';

    .sudoku-table {
        border: 4px solid black;
        border-collapse: collapse;
        text-align: center;

        .sudoku-row {

            &:nth-child(3n) {
                border-bottom: 2px solid black;
            }
        }

        .sudoku-data {
            width: 25px;
            height: 25px;
            border-right: 1px dotted black;
            border-bottom: 1px solid black;

            &:nth-child(3n) {
                border-right: 2px solid black;
            }
        }
    }
</style>
