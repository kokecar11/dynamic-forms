import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import useGlobalContext, { FieldForm } from "@/context/useGlobalContext"

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

const fieldSchema = z.object({
  name: z.string().nonempty(),
  type: z.enum(["text", "number", "date", "boolean"]),
  label: z.string().nonempty(),
  placeholder: z.string().nonempty(),
  dataField: z.object({
    value: z.string().optional().or(z.number()),
    defaultValue: z.string().optional().or(z.number()),
  }),
  required: z.boolean().optional(),
  //   disabled: z.boolean().optional(),
})

export default function CreateFields() {
  const { idForm } = useParams<{ idForm: string }>()
  const { forms, setForms } = useGlobalContext()
  const [open, setOpen] = useState(false)

  const form = useForm<z.infer<typeof fieldSchema>>({
    resolver: zodResolver(fieldSchema),
    defaultValues: {
      name: "",
      label: "",
      placeholder: "",
      type: "text",
      dataField: {
        value: "",
        defaultValue: "",
      },
      required: false,
    },
  })

  useEffect(() => {
    const fetchFields = async () => {
      try {
        const savedForms = JSON.parse(localStorage.getItem("forms")!)
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

  function addFieldToForm(formId: string, field: FieldForm) {
    const newFields = forms.map((form) => {
      if (form.id === parseInt(formId)) {
        const fields = form.fields ? [...form.fields, field] : [field]
        return { ...form, fields: fields }
      } else {
        return form
      }
    })
    setForms(newFields)
    localStorage.setItem("forms", JSON.stringify(newFields))
  }

  async function onSubmit(values: z.infer<typeof fieldSchema>) {
    addFieldToForm(idForm!, {
      label: values.label,
      name: values.name,
      type: values.type,
      placeholder: values.placeholder,
      dataField: values.dataField,
      required: values.required,
    })

    setOpen(false)
    form.reset()
    window.alert("Campo creado exitosamente!")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"default"}>Crear Campo</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Crear un Campo</DialogTitle>
          <DialogDescription>
            Complete el siguiente formulario para crear un campo
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-2 gap-2">
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
                        <SelectItem value="text">Text</SelectItem>
                        <SelectItem value="number">Number</SelectItem>
                        <SelectItem value="date">Date</SelectItem>
                        <SelectItem value="boolean">Boolean</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Ingrese el label del campo
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del campo</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Nombre del campo"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Ingrese el nombre del campo
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
              <FormField
                control={form.control}
                name="required"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 col-span-2">
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
                Crear Formulario
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
