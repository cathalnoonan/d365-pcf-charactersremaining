import * as React from 'react'

export interface CharactersRemainingComponentProps {
    value: string
    numberOfLines: number
    maxCharacters: number
    disabled: boolean
    notifyOutputChanged: (newValue: string) => void
    formatNumber: (n: number) => string
}

export const CharactersRemainingComponent = (props: CharactersRemainingComponentProps) => {

    const [value, setValue] = React.useState(props.value)
    const [active, setActive] = React.useState(false)

    // Allow external changes to the value (e.g. formContext, or changes in the attribute in another control)
    if (!active && props.value !== value) {
        setValue(props.value)
    }

    const error = value.length > props.maxCharacters
    const formattedCharactersRemaining = props.formatNumber(props.maxCharacters - value.length)

    function onChange(element: React.ChangeEvent<HTMLTextAreaElement>): void {
        const newValue = element.currentTarget.value
        setValue(newValue)
        props.notifyOutputChanged(newValue)
    }

    function onKeyPress(ev: React.KeyboardEvent<HTMLTextAreaElement>) {
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
                <textarea 
                    value={value}
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
