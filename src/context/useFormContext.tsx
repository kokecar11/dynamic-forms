import { create } from "zustand"

export type typeField =
  | "text"
  | "number"
  | "date"
  | "boolean"
  | "textarea"
  | "select"
  | "email"
  | "checkbox"
  | "radio"

export type dataField = {
  value?: string | number | Date | boolean
  defaultValue?: string | number | Date | boolean
}

export type MultipleOptions = {
  value: string
  label: string
}

export type InputForm = {
  name: string
  type: typeField
  label: string
  placeholder: string
  dataField: dataField
  required?: boolean
  disabled?: boolean
  isMultiple?: boolean
  multipleOptions?: Array<MultipleOptions>
}

export type SectionForm = {
  id: number
  title: string
  disabled: boolean
  description?: string
  inputs?: Array<InputForm>
}

export type FormBase = {
  id: number
  title?: string
  sections?: Array<SectionForm>
  isSaved?: boolean
  isPublished?: boolean
}

type FormContext = {
  formBase: FormBase
  forms: Array<FormBase>
  setFormBase: (formBase: FormBase) => void
  setForms: (forms: FormBase[]) => void
}

const useFormsContext = create<FormContext>((set) => ({
  formBase: {
    id: 0,
    name: "",
    sections: [],
  },
  forms: [],
  setFormBase: (formBase) => set({ formBase }),
  setForms: (forms) => set({ forms }),
}))

export default useFormsContext
