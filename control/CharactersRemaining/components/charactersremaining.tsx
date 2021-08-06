import * as React from 'react'

export interface CharactersRemainingComponentProps {
    value: string
    numberOfLines: number
    allowedNumberOfCharacters: number
    disabled: boolean
    notifyOutputChanged: (newValue: string) => void
    formatNumber: (n: number) => string
}

export const CharactersRemainingComponent = (props: CharactersRemainingComponentProps) => {

    const [value, setValue] = React.useState(props.value)
    const [active, setActive] = React.useState(false)

    const error = value.length > props.allowedNumberOfCharacters
    const formattedCharactersRemaining = props.formatNumber(props.allowedNumberOfCharacters - value.length)

    function onChange(element: React.ChangeEvent<HTMLTextAreaElement>): void {
        const newValue = element.currentTarget.value
        setValue(newValue)
        props.notifyOutputChanged(newValue)
    }

    function onKeyPress(ev: React.KeyboardEvent) {
        if (props.numberOfLines === 1 && ev.key === 'Enter') {
            ev.preventDefault()
        }
    }

    if (props.disabled) return (
        <div className='wrapper disabled'>
            <div className='characters-remaining'>
                <textarea value={value}
                    placeholder={'---'}
                    disabled={props.disabled}
                    rows={props.numberOfLines} />
            </div>
        </div>
    )

    return (
        <div className='wrapper'>
            <div className={`characters-remaining ${active ? 'active' : ''} ${error ? 'error' : ''}`.trim()}
                onClick={() => setActive(true)}>
                <textarea value={value}
                    placeholder={active ? '' : '---'}
                    onChange={onChange}
                    onKeyPress={onKeyPress}
                    onFocus={() => setActive(true)}
                    onBlur={() => setActive(false)}
                    className={`${props.numberOfLines === 1 ? 'input' : 'textarea'} ${active ? 'active' : ''} ${error ? 'error' : ''}`}
                    rows={props.numberOfLines}
                    autoComplete='off'
                    autoCorrect='off'
                    autoCapitalize='false'
                    spellCheck={active}
                />
                <div className={`label-container ${active ? '' : 'hidden'}`.trim()}>
                    <hr />
                    <label className={`${active ? '' : 'hidden'} ${error ? 'error' : ''}`.trim()}>
                        {formattedCharactersRemaining}
                    </label>
                </div>
            </div>
        </div>
    )
}
