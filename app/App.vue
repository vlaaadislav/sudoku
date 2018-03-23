<template>
    <div id="app">
        <div class="sudoku">
            <table class="sudoku-table">
                <tr class="sudoku-row" v-for="row in field">
                    <td class="sudoku-data" v-for="item in row">{{ item }}</td>
                </tr>
            </table>
            <div class="settings">

            </div>
        </div>
        <div class="button-group">
            <button class="btn" @click="randomize">Randomize</button>
        </div>
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
    body {
        padding: 0;
        margin: 0;
        box-sizing: border-box;
        user-select: none;
        width: 100vw;
        height: 100vh;
        overflow: hidden;
    }

    #app {
        width: inherit;
        height: inherit;
    }

    .sudoku {
        display: flex;
    }

    .sudoku-table {
        width: 85vw;
        height: 90vh;
        border: 4px solid black;
        border-collapse: collapse;
        text-align: center;

        .sudoku-row {

            &:nth-child(3n) {
                border-bottom: 2px solid black;
            }
        }

        .sudoku-data {
            border-right: 1px dotted black;
            border-bottom: 1px solid black;

            &:nth-child(3n) {
                border-right: 2px solid black;
            }
        }
    }

    .settings {
        border: 4px solid black;
        width: 15vw;
    }

    .button-group {
        display: flex;
    }

    .btn {
        flex: 1;
    }

    /* skeleton button */
    /* Buttons
–––––––––––––––––––––––––––––––––––––––––––––––––– */
    .button,
    button,
    input[type="submit"],
    input[type="reset"],
    input[type="button"] {
        display: inline-block;
        height: 38px;
        padding: 0 30px;
        color: #555;
        text-align: center;
        font-size: 11px;
        font-weight: 600;
        line-height: 38px;
        letter-spacing: .1rem;
        text-transform: uppercase;
        text-decoration: none;
        white-space: nowrap;
        background-color: transparent;
        border-radius: 4px;
        border: 1px solid #bbb;
        cursor: pointer;
        box-sizing: border-box; }
    .button:hover,
    button:hover,
    input[type="submit"]:hover,
    input[type="reset"]:hover,
    input[type="button"]:hover,
    .button:focus,
    button:focus,
    input[type="submit"]:focus,
    input[type="reset"]:focus,
    input[type="button"]:focus {
        color: #333;
        border-color: #888;
        outline: 0; }
    .button.button-primary,
    button.button-primary,
    input[type="submit"].button-primary,
    input[type="reset"].button-primary,
    input[type="button"].button-primary {
        color: #FFF;
        background-color: #33C3F0;
        border-color: #33C3F0; }
    .button.button-primary:hover,
    button.button-primary:hover,
    input[type="submit"].button-primary:hover,
    input[type="reset"].button-primary:hover,
    input[type="button"].button-primary:hover,
    .button.button-primary:focus,
    button.button-primary:focus,
    input[type="submit"].button-primary:focus,
    input[type="reset"].button-primary:focus,
    input[type="button"].button-primary:focus {
        color: #FFF;
        background-color: #1EAEDB;
        border-color: #1EAEDB; }
</style>
