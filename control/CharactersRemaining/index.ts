import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { CharactersRemainingComponent, CharactersRemainingComponentProps } from './components'

import { IInputs, IOutputs } from './generated/ManifestTypes'

export class CharactersRemaining implements ComponentFramework.StandardControl<IInputs, IOutputs> {

    private container: HTMLDivElement
    private charactersRemaining: CharactersRemainingComponent

    public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container: HTMLDivElement) {
        
        const value: string = context.parameters.value.raw || ''
        const numberOfLines: number = context.parameters.numberOfLines.raw || 1
        const allowedNumberOfCharacters: number = context.parameters.value.attributes?.MaxLength || 100
        const disabled = context.mode.isControlDisabled
        const props: CharactersRemainingComponentProps = {
            value,
            numberOfLines,
            allowedNumberOfCharacters,
            disabled,
            notifyOutputChanged,
            formatNumber: (n: number): string => context.formatting.formatInteger(n),
        }
        this.container = container

        this.charactersRemaining = ReactDOM.render(
            React.createElement(
                CharactersRemainingComponent,
                props
            ),
            this.container
        )
    }

    public updateView(context: ComponentFramework.Context<IInputs>): void {
        // Add code to update control view
        this.charactersRemaining.setValue(context.parameters.value.raw)
    }

    public getOutputs(): IOutputs {
        return {
            value: this.charactersRemaining.getValue() ?? undefined,
        }
    }

    public destroy(): void {
        ReactDOM.unmountComponentAtNode(this.container)
    }
}

// HACK: 'context.formatting.formatInteger' throws an error for negative numbers in the test harness.
// 
// In the test harness calling context.formatting.formatInteger with a negative number will throw an error.
// 'String.format is not defined' : ./ccf/ts/es6/CustomControls/Models/PropertyFallbacks/Formatting/FormatterUtils.js
if (!(String as any).format) {
    (String as any).format = function (...args: string[]) {
        let str = args[0]
        args.slice(1).forEach((replacement, index) => {
            const regex = new RegExp('\\{' + index + '\\}', 'g')
            str = str.replace(regex, replacement)
        })
        return str
    }
}
