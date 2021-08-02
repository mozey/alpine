import { haveText, html, test } from '../utils'

test('can register custom data providers',
    html`
        <script>
            document.addEventListener('alpine:init', () => {
                Alpine.data('test', () => ({
                    foo: 'bar'
                }))
            })
        </script>

        <div x-data="test">
            <span x-text="foo"></span>
        </div>
    `,
    ({ get }) => get('span').should(haveText('bar'))
)

test('can accept initial params',
    html`
        <script>
            document.addEventListener('alpine:init', () => {
                Alpine.data('test', (first, second) => ({
                    foo: first,
                    bar: second,
                }))
            })
        </script>

        <div x-data="test('baz', 'bob')">
            <h1 x-text="foo"></h1>
            <h2 x-text="bar"></h2>
        </div>
    `,
    ({ get }) => {
        get('h1').should(haveText('baz'))
        get('h2').should(haveText('bob'))
    }
)

test('can spread together',
    html`
        <script>
            document.addEventListener('alpine:init', () => {
                Alpine.data('test', (first) => ({
                    foo: first,
                }))

                Alpine.data('test2', (second) => ({
                    bar: second,
                }))
            })
        </script>

        <div x-data="{ ...test('baz'), ...test2('bob') }">
            <h1 x-text="foo"></h1>
            <h2 x-text="bar"></h2>
        </div>
    `,
    ({ get }) => {
        get('h1').should(haveText('baz'))
        get('h2').should(haveText('bob'))
    }
)

test('init functions inside custom datas are called automatically',
    html`
        <script>
            document.addEventListener('alpine:init', () => {
                Alpine.data('test', () => ({
                    init() {
                        this.foo = 'baz'
                    },

                    foo: 'bar'
                }))
            })
        </script>

        <div x-data="test">
            <span x-text="foo"></span>
        </div>
    `,
    ({ get }) => {
        get('span').should(haveText('baz'))
    }
)

test('init functions "this" context is reactive',
    html`
        <script>
            document.addEventListener('alpine:init', () => {
                Alpine.data('test', () => ({
                    init() {
                        window.addEventListener('click', () => {
                            this.foo = 'baz'
                        })
                    },

                    foo: 'bar'
                }))
            })
        </script>

        <div x-data="test">
            <span x-text="foo"></span>

            <button>click me</button>
        </div>
    `,
    ({ get }) => {
        get('span').should(haveText('bar'))
        get('button').click()
        get('span').should(haveText('baz'))
    }
)
