import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { Button } from "../ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form"
import { Input } from "../ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { Switch } from "../ui/switch"
import { useParams } from "react-router-dom"
import useFormsContext, { InputForm } from "@/context/useFormContext"
import { Plus } from "lucide-react"
// import { MultipleOptions } from "../../context/useFormContext"

const fieldSchema = z.object({
  type: z.enum([
    "text",
    "number",
    "date",
    "boolean",
    "textarea",
    "select",
    "email",
    "checkbox",
    "radio",
  ]),
  label: z.string().nonempty(),
  placeholder: z.string().nonempty(),
  dataField: z.object({
    value: z.string().optional().or(z.number()),
    defaultValue: z.string().optional().or(z.number()),
  }),
  required: z.boolean().optional(),
  isMultple: z.boolean().default(false),
  options: z.array(z.string()).optional().or(z.number()),
  //   multipleOptions: z
  //     .array(
  //       z.object({
  //         value: z.string().optional().or(z.number()),
  //         label: z.string().nonempty(),
  //       })
  //     )
  //     .optional(),
  //   disabled: z.boolean().optional(),
})

interface AddInputProps {
  idSection: number
}

export default function AddInput({ idSection }: AddInputProps) {
  const { idForm } = useParams<{ idForm: string }>()
  const { forms, setForms } = useFormsContext()
  const [open, setOpen] = useState(false)
  const [options, setOptions] = useState([""])

  const form = useForm<z.infer<typeof fieldSchema>>({
    resolver: zodResolver(fieldSchema),
    defaultValues: {
      label: "",
      placeholder: "",
      type: "text",
      dataField: {
        value: "",
        defaultValue: "",
      },
      required: false,
      isMultple: false,
      options: [],
    },
  })

  useEffect(() => {
    const fetchFields = async () => {
      try {
        const savedForms = JSON.parse(localStorage.getItem("forms-v2")!)
        if (savedForms) {
          setForms(savedForms)
        } else {
          setForms([])
        }
      } catch (error) {
        console.error("Error:", error)
      }
    }

    fetchFields()
  }, [setForms])

  function addInputToForm(formId: string, input: InputForm) {
    const newInput = forms.map((form) => {
      if (form.id === parseInt(formId)) {
        const newSection = form.sections?.map((section) => {
          if (section.id === idSection) {
            return {
              ...section,
              inputs: [...(section.inputs || []), input],
            }
          }
          return section
        })
        return { ...form, sections: newSection }
      }
      return form
    })
    setForms(newInput)
    localStorage.setItem("forms-v2", JSON.stringify(newInput))
  }

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  }

  const addOption = () => {
    setOptions([...options, ""])
  }

  async function onSubmit(values: z.infer<typeof fieldSchema>) {
    const multipleOptions = options.map((option) => ({
      value: option.replace(/\s+/g, "-").toLowerCase(),
      label: option,
    }))

    addInputToForm(idForm!, {
      label: values.label,
      name: values.label.replace(/\s+/g, "-").toLowerCase(),
      type: values.type,
      placeholder: values.placeholder,
      dataField: values.dataField,
      required: values.required,
      isMultiple: values.isMultple,
      multipleOptions: multipleOptions,
    })

    setOpen(false)
    form.reset()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"default"}>Agregar Campo</Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Agregar un campo a una Sección</DialogTitle>
          <DialogDescription>
            Complete el siguiente formulario para agregar un campo
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de dato del campo</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione el tipo de dato del campo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="text">Texto</SelectItem>
                        <SelectItem value="number">Número</SelectItem>
                        <SelectItem value="date">Fecha</SelectItem>
                        <SelectItem value="textarea">Texto libre</SelectItem>
                        <SelectItem value="select">Lista Selección</SelectItem>
                        <SelectItem value="radio">Selección unica</SelectItem>
                        <SelectItem value="checkbox">
                          Selección multiple
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Ingrese el tipo de dato del campo
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="label"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Label del campo</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Label del campo"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Ingrese el label del campo
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="placeholder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Placeholder del campo</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Placeholder del campo"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Ingrese el placeholder del campo
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {(form.getValues("type") === "select" ||
                form.getValues("type") === "checkbox" ||
                form.getValues("type") === "radio") && (
                <FormField
                  control={form.control}
                  name="options"
                  render={() => (
                    <FormItem>
                      <div className="flex place-items-center">
                        <FormLabel className="flex-1">
                          Opciones del campo
                        </FormLabel>
                        <Button
                          variant={"outline"}
                          size="icon"
                          onClick={addOption}
                          type="button"
                        >
                          <Plus size={20} />
                        </Button>
                      </div>
                      {options.map((option, index) => (
                        <FormControl key={index}>
                          <Input
                            type="text"
                            placeholder={`Opción ${index + 1}`}
                            value={option}
                            onChange={(e) =>
                              handleOptionChange(index, e.target.value)
                            }
                          />
                        </FormControl>
                      ))}
                      <FormDescription>
                        Ingrese las opciones del campo
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={form.control}
                name="required"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>Campo requerido</FormLabel>
                      <FormDescription>
                        Marque si el campo es requerido
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-4">
              <DialogClose asChild>
                <Button className="w-full" variant={"outline"} type="button">
                  Cancel
                </Button>
              </DialogClose>
              <Button className="w-full" variant={"default"} type="submit">
                Crear Input
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
