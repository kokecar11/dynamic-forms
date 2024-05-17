// import { Transaction } from "@/components/transactions/Columns"
import { create } from "zustand"

export type typeField = "text" | "number" | "date" | "boolean"

export type dataField = {
  value?: string | number | Date | boolean
  defaultValue?: string | number | Date | boolean
}

export type FieldForm = {
  name: string
  type: typeField
  label: string
  placeholder: string
  dataField: dataField
  required?: boolean
  disabled?: boolean
}

export type FormBase = {
  id: number
  name?: string
  fields?: Array<FieldForm>
}

type GlobalContext = {
  formBase: FormBase
  forms: Array<FormBase>
  fields: Array<FieldForm>
  setFormBase: (formBase: FormBase) => void
  setForms: (forms: FormBase[]) => void
  setFieldsForm: (fields: FieldForm[]) => void
}

const useGlobalContext = create<GlobalContext>((set) => ({
  formBase: {
    id: 0,
    name: "",
    fields: [],
  },
  forms: [],
  fields: [],
  setFormBase: (formBase) => set({ formBase }),
  setForms: (forms) => set({ forms }),
  setFieldsForm: (fields) => set({ fields }),
}))

export default useGlobalContext
