import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { CharactersRemainingComponent, CharactersRemainingComponentProps } from './components'

import { IInputs, IOutputs } from './generated/ManifestTypes'

export class CharactersRemaining implements ComponentFramework.StandardControl<IInputs, IOutputs> {

    private container: HTMLDivElement
    private notifyOutputChanged: () => void
    private value: string

    public init(context: ComponentFramework.Context<IInputs>, 
                notifyOutputChanged: () => void, 
                state: ComponentFramework.Dictionary, 
                container: HTMLDivElement) {
        
        this.container = container
        this.notifyOutputChanged = notifyOutputChanged
    }

    public updateView(context: ComponentFramework.Context<IInputs>): void {
        // Add code to update control view
        const props: CharactersRemainingComponentProps = {
            value: context.parameters.value.raw || '',
            numberOfLines: context.parameters.numberOfLines.raw || 1,
            maxCharacters: context.parameters.value.attributes?.MaxLength || 100,
            disabled: context.mode.isControlDisabled,
            notifyOutputChanged: (newValue: string) => (this.value = newValue, this.notifyOutputChanged()),
            formatNumber: (n: number): string => context.formatting.formatInteger(n),
        }

        ReactDOM.render(
            React.createElement(CharactersRemainingComponent, props),
            this.container
        )
    }

    public getOutputs(): IOutputs {
        return {
            value: this.value
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
