import * as React from 'react'

export interface CharactersRemainingComponentProps {
    value: string
    numberOfLines: number
    allowedNumberOfCharacters: number
    notifyOutputChanged: () => void
    formatNumber: (n: number) => string
}

interface CharactersRemainingComponentState {
    active: boolean
    cssActive: boolean
    value: string | null
}

export class CharactersRemainingComponent extends React.Component<CharactersRemainingComponentProps, CharactersRemainingComponentState> {

    private textarea: React.RefObject<HTMLTextAreaElement>
    
    constructor(props: CharactersRemainingComponentProps) {
        super(props)
        this.textarea = React.createRef<HTMLTextAreaElement>()
        this.state = {
            active: false,
            cssActive: false,
            value: props.value,
        }
    }

    render() {
        return (
            <div
                className={'characters-remaining ' + this.getActiveClass() + this.getErrorClass()}
                onClick={this.onClick}
            >
                <div className='wrapper'>
                    <textarea
                        value={this.state.value ?? ''}
                        placeholder={this.state.active ? '' : '---'}
                        onChange={this.onChange}
                        onFocus={this.onFocus}
                        onBlur={this.onBlur}
                        onKeyPress={this.onKeyPress}
                        className={this.getControlTypeClass() + this.getActiveClass() + this.getErrorClass()}
                        rows={this.props.numberOfLines}
                        autoComplete='off'
                        autoCorrect='off'
                        autoCapitalize='false'
                        spellCheck={this.state.active}
                        ref={this.textarea}
                    />
                    <div className={'label-container' + this.getHiddenClass()}>
                        <hr />
                        <label className={this.getHiddenClass() + this.getErrorClass()}>
                            {this.getFormattedCharactersRemaining()}
                        </label>
                    </div>
                </div>
            </div>
        )
    }

    // State
    getValue = (): string | null => this.state.value
    setValue = (value: string | null) => {
        // Mediate whether the value should be updated in state.
        // Without this check, the value could be overwritten by an old value received by the PCF framework.
        if (this.state.active) return
        this.setValueInternal(value)
    }
    private setValueInternal = (value: string | null): void => {
        this.setState({ value }, this.props.notifyOutputChanged)
    }
    private getRemainingNumberOfCharacters = (): number => {
        return this.props.allowedNumberOfCharacters - (this.getValue()?.length || 0)
    }

    // CSS Class Names
    private getErrorClass = (): string => this.getRemainingNumberOfCharacters() < 0 ? ' error' : ''
    private getActiveClass = (): string => this.state.cssActive ? ' active' : ''
    private getControlTypeClass = (): string => this.props.numberOfLines === 1 ? 'input' : 'textarea'
    private getHiddenClass = (): string => this.state.active ? '' : ' hidden'

    // Event handlers
    private onChange = (): void => this.setValueInternal(this.textarea.current?.value ?? null)
    private onClick = (): void => this.textarea.current?.focus()
    private onFocus = (): void => {
        // HACK: React setState is not synchronous.
        //
        // Make the CSS class display as active, but don't make the control consider itself as active
        // until a delay has happened.
        // This allows tabbing onto the control in a way that the new value will still be received.
        this.setState({ cssActive: true })
        setTimeout(() => this.setState({ active: true }), 50)
    }
    private onBlur = (): void => this.setState({ active: false, cssActive: false })
    private onKeyPress = (ev: React.KeyboardEvent): void => {
        // Single line of text: Prevent new lines
        if (this.props.numberOfLines === 1 && ev.charCode === 13) ev.preventDefault()   // TODO: charCode Deprecated
    }

    // Utility
    private getFormattedCharactersRemaining = (): string => this.props.formatNumber(this.getRemainingNumberOfCharacters())
}
