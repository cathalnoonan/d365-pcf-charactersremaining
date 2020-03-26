# D365 PCF - Characters Remaining

This is a PCF Control to show the number of characters remaining in the field, similar to what is seen on twitter

<img src="./img/d365-pcf-charactersremaining.gif" alt="Example">

## Supported controls

This can be used on a "Single Line of Text" or a "Multiple Lines of Text" field

## Installing the control

Go to the <a href="https://github.com/cathalnoonan/d365-pcf-charactersremaining/releases">releases page</a> and download a solution zip file

It's recommended to select the managed solution

## Configuration

- Open the form editor of Dynamics, then double click the field that should use this control
- In the configuration window, select the `Controls` tab
- Select `Add Control...`
- Select `Characters Remaining`
- In the Properties of the control, enter the number of lines to use
  - This is not mapped to the number of lines configured for the Multiple Lines of Text fields because we don't have access to that information within the PowerApps Component Framework
- Click OK, Save and Publish the form
