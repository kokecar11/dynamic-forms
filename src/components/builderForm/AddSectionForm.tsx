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
import useFormsContext, { SectionForm } from "@/context/useFormContext"
import { useParams } from "react-router-dom"
import { Switch } from "../ui/switch"

const formSchema = z.object({
  title: z.string().nonempty(),
  description: z.string().optional(),
  disabled: z.boolean(),
})

export default function AddSectionForm() {
  const { idForm } = useParams<{ idForm: string }>()
  const { forms, setForms } = useFormsContext()
  const [open, setOpen] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      disabled: false,
    },
  })

  useEffect(() => {
    const fetchForms = async () => {
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

    fetchForms()
  }, [setForms])

  function addSectionToForm(formId: string, section: SectionForm) {
    const newSection = forms.map((form) => {
      if (form.id === parseInt(formId)) {
        const sections = form.sections ? [...form.sections, section] : [section]
        return { ...form, sections }
      } else {
        return form
      }
    })
    setForms(newSection)
    localStorage.setItem("forms-v2", JSON.stringify(newSection))
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    addSectionToForm(idForm!, {
      id: Math.floor(Math.random() * 11) + 1,
      title: values.title,
      description: values.description,
      disabled: values.disabled,
      inputs: [],
    })

    setOpen(false)
    form.reset()
    window.alert("Seccion agregada")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"default"}>Agregar Sección</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agregar una Sección al formulario</DialogTitle>
          <DialogDescription>
            Complete el siguiente formulario para agregar una sección al
            formulario.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titulo de la sección</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Titulo de la sección"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Ingrese el titulo de la sección
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción de la sección</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Descripción de la sección"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Ingrese la Descripción de la sección
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="disabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 col-span-2">
                  <div className="space-y-0.5">
                    <FormLabel>Seccion deshabilitada</FormLabel>
                    <FormDescription>
                      Marque si la seccion esta deshabilitada
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

            <div className="flex gap-4">
              <DialogClose asChild>
                <Button
                  className="w-full"
                  variant={"destructive"}
                  type="button"
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button className="w-full" variant={"default"} type="submit">
                Agregar Sección
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
