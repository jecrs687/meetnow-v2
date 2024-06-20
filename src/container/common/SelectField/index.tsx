import { FieldProps } from 'formik'
import React from 'react'
import Select, { Props as ReactSelectProps } from 'react-select'

type Option = {
    value: string | number
    label: string
}
export const SelectField: React.FC<{
    options: Option[]
} & FieldProps> = ({
    options,
    field,
    form,
}) => (
        <Select
            styles={{
                control: (styles) => ({
                    ...styles,
                    backgroundColor: 'white',
                    borderColor: 'black',
                    borderRadius: 0,
                    border: 'none',
                    boxShadow: 'none',
                    '&:hover': {
                        borderColor: 'black',
                    },
                    height: '52px',
                }),
            }}
            options={options}
            name={field.name}
            value={options ? options.find(option => option.value === field.value) : ''}
            onChange={(option: Option) => form.setFieldValue(field.name, option.value)}
            onBlur={field.onBlur}
        />
    )