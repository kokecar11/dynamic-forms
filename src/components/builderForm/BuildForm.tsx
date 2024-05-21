import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
// import useGlobalContext from "@/context/useGlobalContext"

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
import useFormsContext from "@/context/useFormContext"

const formSchema = z.object({
  title: z.string().nonempty(),
})

export default function BuildForm() {
  // const { forms, setForms } = useGlobalContext()
  const { forms, setForms } = useFormsContext()
  const [open, setOpen] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const newForms = [
      ...forms,
      {
        id: Math.floor(Math.random() * 1001) + 1,
        title: values.title,
        sections: [],
      },
    ]
    setForms(newForms)
    localStorage.setItem("forms-v2", JSON.stringify(newForms))
    setOpen(false)
    form.reset()
    window.alert("Formulario creado")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"default"}>Crear Formulario V2</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear un Formulario o Encuesta</DialogTitle>
          <DialogDescription>
            Complete el formulario para crear un nuevo formulario o encuesta
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del formulario</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Nombre del formulario"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Ingrese el nombre del formulario o encuesta
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

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
